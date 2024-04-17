import { NavLink, Outlet } from "react-router-dom";
const Home = () => {
  return (
    <div>
      <menu className="menu flex">
        <ul className="nav">
          <li className="nav-item">
            <NavLink className="nav" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav" to="/tools/">
              Tools
            </NavLink>
          </li>
        </ul>
      </menu>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
export default Home;