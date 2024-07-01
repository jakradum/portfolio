import { NavLink } from "react-router-dom";
export const ErrorElement = () => {
  return (
    <div>
      <h2>404</h2>
      <p>I'm not sure what you're looking for in life, but you won't find it here.</p>
      <div>
        <NavLink to="/">Go back home</NavLink>
      </div>
    </div>
  );
}