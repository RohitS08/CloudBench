import React from 'react';

const About = () => {
  return (
    <div className="flex-grow flex items-center justify-center bg-[#0d1117] py-16 px-6 font-mono">
      <main className="max-w-4xl w-full rounded-lg shadow-lg p-10 bg-[#131c24] text-[#9ccfd8] border border-[#2b313c]">
        <h1 className="text-4xl font-bold text-[#00FFAB] mb-6">
          ➜ About CloudBench
        </h1>
        <p className="text-lg leading-relaxed mb-4">
          <span className="text-[#3DF5F5]">$</span> CloudBench is a cutting-edge platform designed to empower developers
          with seamless cloud-based terminal sessions. Our mission is to streamline
          your development workflow by providing instant, scalable, and secure
          terminal environments accessible anywhere, anytime.
        </p>
        <p className="text-lg leading-relaxed">
          <span className="text-[#3DF5F5]">$</span> Built with modern technologies and a robust architecture, CloudBench
          offers unmatched flexibility and control — ensuring you stay ahead in today’s
          fast-paced digital landscape.
        </p>
      </main>
    </div>
  );
};

export default About;
