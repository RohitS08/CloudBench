import { useEffect, useState } from 'react';
import Card_NewSession from '../assets/Card_NewSession';
import SessionList from './SessionList';

import { useAuth } from './../util/authContext';
import LoadingHover from '../assets/LoadingHover';

function Dashboard() {
  const { accessToken } = useAuth();

  const [showNewSessionCard, setShowNewSessionCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sessionList, setSessionList] = useState([]);

  const [loadingMessage, setLoadingMessage] = useState(null);

  const fetchSessionList = () => {
    fetch(`${import.meta.env.VITE_API_URL}/sessions/getUserSessions`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    })
      .then(res => res.json())
      .then(res => setSessionList(res.session_list))
      .catch(err => {
        console.error(err);
        alert('Failed to fetch sessions.');
      });
  };

  useEffect(() => {
    document.title = 'Dashboard - CloudBench';
    fetchSessionList();
  }, []);

  const apiAction = async (action, containerName) => {
    switch(action){
      case 'remove':
        setLoadingMessage("Deleting & Removing the session...")
        break;
      case 'resume':
        setLoadingMessage("Running up the container...")
        break;
      case 'pause':
        setLoadingMessage("Pausing the container...")
        break;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/sessions/${action}/${containerName}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        }
      );
      if (!res.ok) throw new Error('Server error');
      fetchSessionList();
    } catch (err) {
      alert('Some error occurred at the server.');
      console.error(err);
    } finally {
      setLoadingMessage(null);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <LoadingHover message={loadingMessage} />
        </div>
      )}

      <main className="flex-grow min-h-screen flex flex-col items-center bg-gradient-to-br from-[#071013] via-[#0d1117] to-[#071013] text-[#A0F0D9] font-mono px-4 sm:px-8 py-20">
        <section className="max-w-5xl w-full text-center">
          <h1 className="text-7xl font-extrabold mb-3 tracking-wide text-[#00FFAB] drop-shadow-[0_0_12px_rgba(0,255,171,0.85)]">
            Welcome back,
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-[#88ffe0] font-semibold drop-shadow-md">
            Ready to power up your CloudBench terminal sessions with blazing speed and secure isolation?
          </p>
        </section>

        <section className="mt-14 w-full max-w-md">
          <button
            onClick={() => setShowNewSessionCard(true)}
            className="w-full py-4 rounded-lg bg-gradient-to-r from-[#00FFAB] to-[#00C6AB] text-[#0d1117] font-semibold text-lg shadow-lg hover:scale-105 hover:brightness-110 transition-transform transition-filter duration-300 focus:outline-none focus:ring-4 focus:ring-[#00FFAB]/60"
            aria-label="Start a new session"
          >
            + Start a New Session
          </button>

          {showNewSessionCard && (
            <div className="mt-10 max-w-xl mx-auto rounded-lg bg-[#121b22] border border-[#00ffab] p-6 shadow-[0_0_20px_rgba(0,255,171,0.4)]">
              <Card_NewSession
                onClose={() => setShowNewSessionCard(false)}
                onSessionCreated={fetchSessionList}
                loader={{ loading, setLoading }}
                setLoadingMessage={ setLoadingMessage }
              />
            </div>
          )}
        </section>

        <section className="flex-grow w-full max-w-7xl mt-20 px-2 sm:px-6">
          <SessionList
            sessionList={sessionList}
            handler={{
              removeContainer: containerName => apiAction('remove', containerName),
              resumeSession: containerName => apiAction('resume', containerName),
              pauseSession: containerName => apiAction('pause', containerName),
            }}
            className="bg-[#121b22] rounded-lg border border-[#00FFAB]/50 shadow-lg p-6"
          />
        </section>
      </main>
    </>
  );
}

export default Dashboard;
