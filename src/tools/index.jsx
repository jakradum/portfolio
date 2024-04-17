// RootLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div>
      <menu className="menu flex">
        <ul className="nav">
          <li className="nav-item">
            <NavLink className="nav" to="/tools/strong-password-generator">
              Password Generator
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav" to="/tools/tic-tac-toe">
              Tic Tac Toe
            </NavLink>
          </li>
        </ul>
      </menu>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
