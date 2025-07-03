import { IconContext } from "react-icons";
import { TbBrowserMaximize } from "react-icons/tb";
import { FaPlay } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { RxResume } from "react-icons/rx";

function SessionList({ sessionList = [], handler }) {
    return (
        <div className="container mx-auto mt-4 px-2 py-3 bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-lg">
            {sessionList.length > 0 ? (
                <div className="overflow-x-auto rounded-xl">
                    <table className="min-w-full table-auto border-collapse text-[#c9d1d9]">
                        <thead className="bg-[#161b22] border-b border-[#30363d]">
                            <tr>
                                {["Name", "Type", "Status", "Created At", "Public URL", "Action"].map((heading) => (
                                    <th
                                        key={heading}
                                        className="text-left px-6 py-3 font-semibold text-[#00FFAB] tracking-wider"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sessionList.map((session) => (
                                <tr
                                    key={session._id}
                                    className="odd:bg-[#0d1117] even:bg-[#161b22] hover:bg-[#1f2937] transition-colors"
                                >
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <span className="font-semibold text-[#F4C753]">{session.name}</span>
                                        {session.status === "running" && (
                                            <a
                                                href={`/session/id/${session._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#00FFAB] hover:text-green-400"
                                                title="Open session"
                                            >
                                                <IconContext.Provider value={{ size: "1.2rem" }}>
                                                    <TbBrowserMaximize />
                                                </IconContext.Provider>
                                            </a>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 capitalize">{session.session_type}</td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                session.status === "running"
                                                    ? "bg-green-800 text-green-300"
                                                    : "bg-yellow-700 text-yellow-100"
                                            }`}
                                        >
                                            {session.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-[#8b949e]">
                                        {new Date(session.createdAt).toLocaleString()}
                                    </td>

                                    <td className="px-6 py-4">
                                        <a
                                            href={`http://${session._id}.terminal.localhost`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline"
                                        >
                                            Open
                                        </a>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() =>
                                                    session.status !== "running"
                                                        ? handler.resumeSession(session._id)
                                                        : handler.pauseSession(session._id)
                                                }
                                                title={session.status === "running" ? "Pause Session" : "Resume Session"}
                                                className={`px-3 py-2 rounded-md focus:outline-none transition font-bold ${
                                                    session.status === "running"
                                                        ? "bg-yellow-600 hover:bg-yellow-500 text-black"
                                                        : "bg-green-600 hover:bg-green-500 text-black"
                                                }`}
                                            >
                                                {session.status === "running" ? (
                                                    <RxResume size={16} />
                                                ) : (
                                                    <FaPlay size={16} />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handler.removeContainer(session._id)}
                                                title="Delete Session"
                                                className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white font-bold transition"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-yellow-400 font-semibold text-lg mt-8 animate-pulse">
                    No Active or Suspended Sessions.
                </p>
            )}
        </div>
    );
}

export default SessionList;
