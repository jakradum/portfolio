import { useState } from "react";
import { CheckBoxComp } from "../Components/checkbox";
const PWGenComponent = () => {
  const [capschecked, setCapschecked] = useState(false);
  function checkCaps() {
    setCapschecked(!capschecked);
  }
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
      ischeckedfn: "",
      handleChange: "",
    },
  ];
  const wordProp = [
    {
      id: "capital letters",
      name: "",
      value: "",
      label: "CAPITAL LETTERS",
      ischeckedfn: capschecked,
      handleChange: checkCaps,
    },
  ];
  function generateRand(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  let pwlength = 8;

  const capString = () => {
    let password = "";
    for (let i = 0; i < pwlength; i++) {
      const capitalLetter = generateRand(65, 90);
      let res = String.fromCharCode(capitalLetter);
      if (capschecked) {
        password += res;
      } else {
        return;
      }
    }
    return password;
  };
  const res = capString();

  return (
    <div>
      <h2>Strong Password Generator</h2>
      <h3>{res}</h3>
      <fieldset className="flex">
        <CheckBoxComp propArray={numberProps} />
        <CheckBoxComp propArray={splCharProps} />
        <CheckBoxComp propArray={wordProp} />
      </fieldset>
    </div>
  );
};
export default PWGenComponent;
