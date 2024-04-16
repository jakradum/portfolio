import { NavLink, Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div>
      <menu className="menu">
        <ul className="nav">
          <li className="nav-item">
            <NavLink className="nav" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav" to="/tools/strong-password-generator">
              PW
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
