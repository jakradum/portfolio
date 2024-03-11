import { CheckBoxComp } from "../Components/checkbox";
const PWGenComponent = () => {
  const numberProps = [
    {
      id: "number",
      name: "number",
      value: "number",
      label: "Number",
    },
  ];
  const splCharProps = [
    {
      id: "Special characters",
      name: "Special characters",
      value: "",
      label: "Special characters",
    },
  ];
  const wordProp = [
    {
      id: "Alphabets",
      name: "alphabets",
      value: "alphabets",
      label: "Alphabets",
    },
  ];
  return (
    <div>
      <h2>Strong Password Generator</h2>
      <fieldset className="flex">
        <CheckBoxComp propArray={numberProps} />
        <CheckBoxComp propArray={splCharProps} />
        <CheckBoxComp propArray={wordProp} />
      </fieldset>
    </div>
  );
};
export default PWGenComponent;
