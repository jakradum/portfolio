import { NavLink } from "react-router-dom";
export const ErrorElement = () => {
  return (
    <div>
      404, bitch
      <div>
        <NavLink to="/">Go back home</NavLink>
      </div>
    </div>
  );
}