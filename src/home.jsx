import { NavLink, Outlet, useLocation } from 'react-router-dom';

const HomePage = () => {
  return (
    <section className='flex'>
      <h1>Jakradum</h1>
      <p>I’m copywriter with some interest in coding. Welcome to my website where you’ll find a bunch of my coding projects. Hopefully, I’m adding to this as you read this. If you think it’s been a while since my last project, send me a little motivation by hitting this button below (it’s free). I’m thinking of putting up a blog here with a few of my thoughts on everything under the sun. Cheers.</p>
      <button>C'mon!</button>
    </section>
  );
};

const Home = () => {
  const location = useLocation();

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
        {location.pathname === '/' ? <HomePage /> : <Outlet />}
      </main>
    </div>
  );
};

export default Home;