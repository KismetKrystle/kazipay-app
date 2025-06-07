import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#e6f7fd] flex flex-col items-center">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white shadow-md w-full flex justify-center">
        <div className="w-full max-w-[1200px] flex justify-between items-center px-8 py-5">
          <div className="font-extrabold text-2xl tracking-tight">KAZI PAY</div>
          <nav className="flex gap-10 text-lg font-medium">
            <a href="#" className="hover:text-blue-600 transition">Secure</a>
            <a href="#" className="hover:text-blue-600 transition">Freelancers</a>
            <a href="#" className="hover:text-blue-600 transition">Projects</a>
            <a href="#" className="hover:text-blue-600 transition">Clients</a>
          </nav>
          <button className="border border-black rounded-full px-6 py-2 font-semibold hover:bg-gray-100 transition">Connect Wallet</button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-[1200px] flex-1 flex flex-col items-center px-4 md:px-8">
        {/* Hero Section */}
        <section className="w-full bg-[#9ee7ff] rounded-3xl mt-10 flex flex-col md:flex-row items-center justify-between px-8 py-14 shadow-lg">
          <div className="max-w-xl">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight text-black">
              Kazi Pay:<br />
              The Payment Lifeline<br />
              for Global Freelancers
            </h1>
            <p className="mb-10 text-lg text-gray-800">
              Building trust in remote work. Milestone based crypto payouts for global freelancers powered by XRP Ledger.
            </p>
            <div className="flex gap-6">
              <button className="bg-white text-black font-semibold px-7 py-3 rounded-full shadow hover:bg-gray-100 transition">Get started</button>
              <button className="bg-white text-black font-semibold px-7 py-3 rounded-full shadow hover:bg-gray-100 transition">Request demo</button>
            </div>
          </div>
          <div className="mt-12 md:mt-0 md:ml-12 flex-shrink-0 flex items-center justify-center">
            {/* Placeholder for Kazi Pay logo */}
            <div className="bg-cyan-700 rounded-xl flex items-center justify-center w-80 h-44 shadow-xl">
              <span className="text-6xl font-extrabold text-white tracking-tight">KAZI <span className="block text-4xl">PAY</span></span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
          <div className="bg-white rounded-3xl p-7 flex flex-col items-start shadow min-h-[150px]">
            <span className="text-gray-700 mb-2 text-lg font-medium">Active users</span>
            <span className="text-4xl font-bold mb-3">500K+</span>
            {/* Placeholder avatars */}
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-gray-500 border-2 border-white" />
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white" />
            </div>
          </div>
          <div className="bg-[#9ee7ff] rounded-3xl p-7 flex flex-col items-start shadow min-h-[150px]">
            <span className="text-gray-700 mb-2 text-lg font-medium">Transactions processed</span>
            <span className="text-4xl font-bold mb-3">2M+</span>
            {/* Placeholder icon */}
            <span className="text-3xl">💳</span>
          </div>
          <div className="bg-[#9ee7ff] rounded-3xl p-7 flex flex-col items-start shadow min-h-[150px]">
            <span className="text-gray-700 mb-2 text-lg font-medium">Freelancers paid globally</span>
            <span className="text-4xl font-bold mb-3">1M+</span>
            {/* Placeholder icon */}
            <span className="text-3xl">🤝</span>
          </div>
          <div className="bg-white rounded-3xl p-7 flex flex-col justify-between shadow min-h-[150px]">
            <span className="text-gray-700 mb-2 text-lg font-medium">Join now</span>
            <span className="text-3xl font-bold mb-3">SIGN UP</span>
            <span className="text-4xl">→</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage; 