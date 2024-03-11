import logo from "./logo.svg";
import "./App.css";
import { ButtonComponent } from "./Components/Button";
import { useState } from "react";
import NavBar from "./Nav";
import PWGenComponent from "./Password Generator";

function App() {
  const pwGenButton = () => {
    setState({ ...state, enter: true, home: false });
  };
  const buttonProps = [
    { buttonText: "Strong Password Generator", onclickfn: pwGenButton },
  ];
  const [state, setState] = useState({ enter: false, home: true });
  const { enter, home } = state;
  const goHome = () => {
    setState({...state,home:true})
  };
  return (
    <div className="App">
      <NavBar onClick={goHome} />
      {home ? (
        <div>
          <div className="intro">
            <h2>Welcome to Jakradum</h2>
            <p>Enjoy this password generator</p>
          </div>
          <ButtonComponent propArray={buttonProps} />
        </div>
      ) : (
        <PWGenComponent/>
      )}
    </div>
  );
}

export default App;
