import { useState } from 'react';
import { useAuth } from '../util/authContext';

function Card_NewSession({ onClose, onSessionCreated, loader, setLoadingMessage }) {
  const { accessToken } = useAuth();

  const [newSessionData, setNewSessionData] = useState({
    session_name: '',
    session_type: 'NodeJs',
  });

  const [errors, setErrors] = useState({
    session_name: '',
    session_type: '',
  });

  const handleChange = (e) => {
    setNewSessionData({ ...newSessionData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = () => {
    const { session_name, session_type } = newSessionData;

    if (!session_name.trim()) {
      return setErrors((e) => ({ ...e, session_name: 'Name cannot be empty.' }));
    }

    if (!session_type.trim()) {
      return setErrors((e) => ({ ...e, session_type: 'Type must be selected.' }));
    }

    onClose();
    setLoadingMessage("Creating new Session...")
    loader.setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/sessions/new`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken,
        ...newSessionData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          onSessionCreated();
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        alert('Failed to start session.');
        console.error(err);
      })
      .finally(() => {
        setLoadingMessage(null);
        loader.setLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#101820] text-white rounded-2xl shadow-2xl border border-[#00FFAB]/30 max-w-md w-full p-8 relative transition-all">
        <button
          className="absolute top-4 right-4 text-3xl font-bold text-[#FF5C8D] hover:text-[#ff2d6e] transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-[#00FFAB] mb-6 text-center tracking-wide">
          New CloudBench Session
        </h2>

        <div className="mb-5">
          <label htmlFor="session_name" className="block font-medium text-[#8be6d1] mb-2">
            Session Name:
          </label>
          <input
            type="text"
            name="session_name"
            id="session_name"
            placeholder="Enter a name"
            value={newSessionData.session_name}
            onChange={handleChange}
            className="w-full rounded-md border border-[#2c3e50] bg-[#16242e] text-white px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FFAB]/70 hover:outline-none hover:ring-1"
          />
          <p className="text-red-500 text-sm mt-1">{errors.session_name}</p>
        </div>

        <div className="mb-5">
          <label htmlFor="session_type" className="block font-medium text-[#8be6d1] mb-2">
            Session Type:
          </label>
          <select
            id="session_type"
            name="session_type"
            value={newSessionData.session_type}
            onChange={handleChange}
            className="w-full rounded-md border border-[#2c3e50] bg-[#16242e] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FFAB]/70 hover:outline-none hover:ring-1"
          >
            <option value="NodeJs">Node.js</option>
            <option value="Linux Dev Environment">Linux Dev Environment</option>
            <option value="Linux">Linux</option>
            <option value="Python">Python 3.12.x</option>
          </select>
          <p className="text-red-500 text-sm mt-1">{errors.session_type}</p>
        </div>

        <p className="text-sm text-[#cccccc] mb-6 text-center">
          ⚡ Your app will be accessible on port <span className="font-semibold text-[#00FFAB]">3000</span>
        </p>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#00FFAB] to-[#00C6AB] text-[#0d1117] font-bold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Launch Session 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card_NewSession;
