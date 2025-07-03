import Docker from 'dockerode';
const docker = new Docker(); // Connects to local Docker by default

export default function initDockerSession(io) {
  io.on('connection', (socket) => {
    console.log('[Docker Server] Connected to /session namespace');

    socket.on('start-session', async ({ sessionId }) => {
      console.log(`[Docker Server] Starting session for container ID: ${sessionId}`);

      try {
        const container = docker.getContainer(sessionId);

        const exec = await container.exec({
          Cmd: ['sh'], // TODO: later change it to fetch dynamically from sessionMetadata
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
        });

        const stream = await exec.start({ hijack: true, stdin: true });

        const containerInpectData = await container.inspect();
        const containerNanoCpus = containerInpectData.HostConfig.NanoCpus;

        // 📊 Attach Stats Stream
        const statsStream = await container.stats({ stream: true });
        let previous = null;

        statsStream.on('data', (chunk) => {
          const stats = JSON.parse(chunk.toString());
          if (!previous) {
            previous = stats;
            return;
          }

          const cpuPercent = calculateCpu(stats, previous, containerNanoCpus);
          const memUsed = stats.memory_stats.usage;
          const memLimit = stats.memory_stats.limit;
          const memPercent = (memUsed / memLimit) * 100;

          socket.emit('metrics', {
            cpuPercent: cpuPercent.toFixed(2),
            memPercent: memPercent.toFixed(2),
            memUsed: formatBytes(memUsed),
            memLimit: formatBytes(memLimit),
            cpuLimit: '0.5 CPU', // You can fetch this dynamically if needed
          });

          previous = stats;
        });

        // Pipe Docker stdout to backend socket
        stream.on('data', (chunk) => {
          console.log(chunk.toString('utf-8'));
          socket.emit('output', chunk.toString());
        });

        // Pipe backend input to Docker stdin
        socket.on('input', (data) => {
          stream.write(data);
        });

        socket.on('disconnect', () => {
          console.log(`[Docker Server] Session ${sessionId} disconnected`);
          statsStream?.destroy?.();
          stream.end?.();
        });

      } catch (error) {
        console.error(`[Docker Server] Error in session ${sessionId}:`, error.message);
        socket.emit('error', `Could not start terminal session: ${error.message}`);
        statsStream?.destroy?.();
      }
    });
  });
}
// 🧠 Calculate CPU % usage
function calculateCpu(current, previous, nanoCpus) {
  const cpuDelta = current.cpu_stats.cpu_usage.total_usage - previous.cpu_stats.cpu_usage.total_usage;
  const systemDelta = current.cpu_stats.system_cpu_usage - previous.cpu_stats.system_cpu_usage;
  const onlineCpus = current.cpu_stats.online_cpus || current.cpu_stats.cpu_usage.percpu_usage.length;
  
  if(nanoCpus === 0) nanoCpus = onlineCpus;
  if (systemDelta === 0) return 0;

  const hostUsagePercent = (cpuDelta / systemDelta) * onlineCpus * 100;
  const containerLimit = nanoCpus / 1e9; // convert nanocpus to CPU count

  const normalized = (hostUsagePercent / containerLimit); // shows % of allowed usage
  return Math.min(normalized, 100); // cap to 100%
}


// 🧮 Format bytes to readable unit
function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}