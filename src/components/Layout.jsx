import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="flex-1 pt-24 pb-16">
        <Outlet />
      </main>
    </div>
  );
}