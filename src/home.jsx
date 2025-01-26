import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ButtonComponent } from './Components/Button';
import { WebsitePreview } from './Components/preview';
import VerticalTimeline from './Components/verticalTimeline';
import { Logos } from './Components/logos';
import { HashRouter } from 'react-router-dom';

const HomePage = () => {
  const [count, setCount] = useState(0);
  const counterClick = () => {
    setCount((prevCount) => prevCount + 1);
  };
  const buttonProps = [
    {
      onclickfn: counterClick,
      buttonText: `Well done!`,
    },
  ];
  return (
    <section className="flex">
      <h1>Hello.</h1>
      <p>
        I’m copywriter with some interest in building websites. Welcome to my website where you’ll find a bunch of my
        coding projects using JavaScript. Hopefully, I’m adding to this as you read this. If you think it’s been a while
        since my last project, send me a little motivation by hitting this button below (it’s free). I’m thinking of
        putting up a blog here with a few of my thoughts on everything under the sun. Cheers.
      </p>
      <ButtonComponent propArray={buttonProps} />
      <p>
        {count > 110 ? (
          'bye'
        ) : count > 100 ? (
          `${count} times! You need help`
        ) : count > 50 ? (
          `You just hit that button ${count} times!!!!!!`
        ) : count > 30 ? (
          `Pls im begging u`
        ) : count > 20 ? (
          `I'm doing my best`
        ) : count > 15 ? (
          'I really got it, stop'
        ) : count > 2 ? (
          `Thanks, you just said that ${count} times`
        ) : count === 2 ? (
          `You've said that twice now`
        ) : count === 1 ? (
          'Thanks!'
        ) : (
          <br />
        )}
      </p>
      {/* <hr/>
      <h2>More about me</h2>
      <p>My experience</p>
      <VerticalTimeline items={timelineItems}/> */}
      <Logos />
    </section>
  );
};

const Home = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when location changes
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

  return (
    <div>
      <menu className="menu flex">
        <ul className="nav">
          <li className="nav-item">
            <NavLink className="nav" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item dropdown" ref={dropdownRef}>
            <button className="dropdown-trigger" onClick={toggleDropdown}>
              Tools
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <NavLink to="/tools/tic-tac-toe" onClick={() => setIsDropdownOpen(false)}>
                    Tic Tac Toe
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tools/strong-password-generator" onClick={() => setIsDropdownOpen(false)}>
                    Strong Password Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tools/prime-numbers" onClick={() => setIsDropdownOpen(false)}>
                    Prime Number Finder
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tools/mental-math" onClick={() => setIsDropdownOpen(false)}>
                    Mental Math
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </menu>

      <main>
        {location.pathname === '/' ? <HomePage /> : location.pathname.startsWith('/tools') ? <Outlet /> : null}
      </main>
    </div>
  );
};

export default Home;
