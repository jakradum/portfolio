import { useState } from "react";

const NavBar = ({onClick}) => {
  
 
  return (
    <menu className="nav">
      <h4 onClick={onClick}>Home</h4>
    </menu>
  );
};

export default NavBar;