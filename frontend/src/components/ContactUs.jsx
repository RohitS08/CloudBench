import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#0d1117] py-16 px-6 font-mono">
      <main className="max-w-4xl w-full rounded-lg shadow-xl p-10 bg-[#131c24] text-[#c9d1d9] border border-[#2b313c]">
        <h1 className="text-4xl font-bold text-[#00FFAB] mb-8">➜ Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg text-[#7fe3ff] mb-1">[Name]</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded bg-[#0d1117] border border-[#3b4048] px-4 py-2 text-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#00FFAB] shadow-inner"
              placeholder="Enter your name..."
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg text-[#7fe3ff] mb-1">[Email]</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded bg-[#0d1117] border border-[#3b4048] px-4 py-2 text-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#00FFAB] shadow-inner"
              placeholder="Enter your email..."
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-lg text-[#7fe3ff] mb-1">[Message]</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full rounded bg-[#0d1117] border border-[#3b4048] px-4 py-2 text-[#d1d5db] resize-none focus:outline-none focus:ring-2 focus:ring-[#00FFAB] shadow-inner"
              placeholder="What's on your mind?"
            />
          </div>
          <button
            type="submit"
            className="bg-[#00FFAB] hover:bg-[#53c7ff] text-[#0d1117] font-semibold py-3 px-6 rounded-md transition-all duration-300 shadow-md"
          >
            ▶ Send Message
          </button>
        </form>
      </main>
    </div>
  );
};

export default ContactUs;
