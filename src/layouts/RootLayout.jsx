import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Loader from '../components/Loader';
import PricingModal from '../components/PricingModal';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden pb-12">
      {/* Dynamic Background Neon Ambient Glows */}
      <div className="ambient-glow-teal top-[10%] left-[-10%]" />
      <div className="ambient-glow-violet bottom-[20%] right-[-10%]" />

      {/* Floating Header */}
      <Navigation />

      {/* Main Core Container */}
      <main className="flex-1 w-[calc(100%-2rem)] max-w-7xl mx-auto my-6 px-4">
        <Outlet />
      </main>

      {/* Global Interactive Context Elements */}
      <Loader />
      <PricingModal />
    </div>
  );
}
