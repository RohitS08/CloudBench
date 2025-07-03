import React from 'react';
import { useLogin } from '../util/isLoggedin';
import Dashboard from '../components/Dashboard';

function LandingPage() {
  const { isLoggedIn } = useLogin();

  return (
    <>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <div className="flex-grow py-20 bg-[#0d1117] text-[#C3F3D9] font-mono transition-all">
          <div className="w-[85%] mx-auto text-center">
            <h1 className="text-5xl font-bold text-[#00FFAB] drop-shadow-glow">
              Welcome to CloudBench_
            </h1>
            <p className="mt-4 text-lg text-[#8AFFEF]">
              Your one-stop solution for cloud-based terminal access.
            </p>
          </div>

          <section className="py-16 px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-[#3DF5F5] mb-6">Why Choose CloudBench?</h2>
              <p className="text-lg text-[#7DF5CA] mb-12">
                Empowering developers and learners with seamless, browser-based terminal access in isolated cloud environments.
              </p>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: 'Instant Terminal Access',
                    desc: 'Launch Linux shell, Python, or Node.js terminals in seconds—straight from your browser.',
                  },
                  {
                    title: 'Isolated & Secure',
                    desc: 'Every session runs in its own Docker container with secure, persistent storage options.',
                  },
                  {
                    title: 'Session Lifecycle Control',
                    desc: 'Start, pause, resume, or terminate sessions anytime—full control at your fingertips.',
                  },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-[#161b22] border border-[#2ea043] p-6 rounded-xl shadow-inner hover:shadow-[#00FFAB] hover:scale-[1.02] transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-[#00FFAB] mb-2">{card.title}</h3>
                    <p className="text-[#C3F3D9]">{card.desc}</p>
                  </div>
                ))}

                {/* Locked Features */}
                {[
                  {
                    title: 'Real-time Collaboration',
                    desc: 'Collaborate with peers, instructors, or teammates in real time through shared terminal sessions (coming soon).',
                  },
                  {
                    title: 'Dashboard & Analytics',
                    desc: 'Track terminal usage, storage, and activity history with a personalized dashboard.',
                  },
                  {
                    title: 'Scalable Architecture',
                    desc: 'Built with Docker, Socket.IO, and Traefik to support high-concurrency usage and load-balanced deployments.',
                  },
                ].map((card, idx) => (
                  <div
                    key={`locked-${idx}`}
                    className="relative bg-[#1a1f27] border border-[#444c56] p-6 rounded-xl shadow-inner cursor-not-allowed"
                  >
                    <h3 className="text-xl font-semibold text-[#3DF5F5] mb-2">{card.title}</h3>
                    <p className="text-[#C3F3D9] mb-4">{card.desc}</p>
                    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-[#00FFAB]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 00-6 0v2c0 1.657 1.343 3 3 3z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z"
                        />
                      </svg>
                      <span className="font-semibold">Coming Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default LandingPage;
