import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ButtonComponent } from './Components/Button';
import { WebsitePreview } from './Components/preview';
import VerticalTimeline from './Components/verticalTimeline';
import { Logos } from './Components/logos';

const HomePage = () => {
  const [count, setCount] = useState(0);
  const counterClick = () => {
    setCount((prevCount) => prevCount + 1);
  }
  const buttonProps = [{
    onclickfn: counterClick,
    buttonText: `Well done!`,
  }]
  return (
    <section className="flex">
      <h1>Hello.</h1>
      <p>
        I’m copywriter with some interest in building websites. Welcome to my website where you’ll find a bunch of my coding
        projects using JavaScript. Hopefully, I’m adding to this as you read this. If you think it’s been a while since my last project,
        send me a little motivation by hitting this button below (it’s free). I’m thinking of putting up a blog here
        with a few of my thoughts on everything under the sun. Cheers.
      </p>
      <ButtonComponent propArray={buttonProps}/>
      <p>
        {count > 110
          ? 'bye'
          : count > 100
          ? `${count} times! You need help`
          : count > 50
          ? `You just hit that button ${count} times!!!!!!`
          : count > 30
          ? `Pls im begging u`
          : count > 20
          ? `I'm doing my best`
          : count > 15
          ? 'I really got it, stop'
          : count > 2
          ? `Thanks, you just said that ${count} times`
          : count === 2
          ? `You've said that twice now`
          : count === 1
          ? 'Thanks!'
          : <br/>}
      </p>
      {/* <hr/>
      <h2>More about me</h2>
      <p>My experience</p>
      <VerticalTimeline items={timelineItems}/> */}
      <Logos/>
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