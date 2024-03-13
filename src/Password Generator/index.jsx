import { useState } from "react";
import { CheckBoxComp } from "../Components/checkbox";
const PWGenComponent = () => {
  const [state, setState] = useState({
    capschecked: false,
    splCharCheck: false,
  });
  function capsCheckFn() {
    setState({
      ...state,
      capschecked: !capschecked,
    });
  }
  function splCharCheckFn() {
    setState({
      ...state,
      splCharCheck: !splCharCheck,
    });
  }
  const { capschecked, splCharCheck } = state;
  const numberProps = [
    {
      id: "number",
      name: "number",
      value: "number",
      label: "Number",
      ischeckedfn: "",
      handleChange: "",
    },
  ];
  const splCharProps = [
    {
      id: "Special characters",
      name: "Special characters",
      value: "",
      label: "Special characters",
      ischeckedfn: splCharCheck,
      handleChange: splCharCheckFn,
    },
  ];
  const wordProp = [
    {
      id: "capital letters",
      name: "",
      value: "",
      label: "CAPITAL LETTERS",
      ischeckedfn: capschecked,
      handleChange: capsCheckFn,
    },
  ];
  function generateRand(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  let pwlength = 6;
  const capString = () => {
    let password = "";
    while (password.length < pwlength) {
      const capitalLetterRand = generateRand(65, 90);
      const splCharRand = generateRand(33, 47);
      let res = String.fromCharCode(capitalLetterRand,splCharRand);
      password += res;
    }
    return password;
  };
  const res = capString();

  return (
    <div>
      <h2>Strong Password Generator</h2>
      <div className="password ">
        <h3>{res}</h3>
      </div>
      <fieldset className="flex">
        <CheckBoxComp propArray={numberProps} />
        <CheckBoxComp propArray={splCharProps} />
        <CheckBoxComp propArray={wordProp} />
      </fieldset>
    </div>
  );
};
export default PWGenComponent;
