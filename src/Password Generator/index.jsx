import { useState } from 'react';
import { CheckBoxComp } from '../Components/checkbox';

const PWGenComponent = () => {
  const [state, setState] = useState({
    capsChecked: false,
    splCharCheck: null,
    numsCheck: null,
    lowercaseChecked: false,
    lettersEnabled: true,
    textinputEnabled: false,
    sliderNum: 9,
    customPW: '',
  });
  function capsCheckFn() {
    setState({
      ...state,
      capsChecked: !capsChecked,
    });
  }
  function splCharCheckFn() {
    setState({
      ...state,
      splCharCheck: !splCharCheck,
    });
  }
  function numsCheckFn() {
    setState({
      ...state,
      numsCheck: !numsCheck,
    });
  }
  function lowercaseCheckFn() {
    setState({
      ...state,
      lowercaseChecked: !lowercaseChecked,
    });
  }
  function handleRadioCheck() {
    setState({ ...state, lettersEnabled: !lettersEnabled, textinputEnabled: !textinputEnabled, customPW: '' });
  }
  function handleInputRadioCheck() {
    setState({
      ...state,
      textinputEnabled: !textinputEnabled,
      lettersEnabled: !lettersEnabled,
      lowercaseChecked: false,
      capsChecked: false,
    });
  }
  function sliderChange(e) {
    setState({ ...state, sliderNum: parseInt(e.target.value) });
  }
  function inputChange(e) {
    setState({ ...state, customPW: e.target.value });
  }
  const {
    capsChecked,
    splCharCheck,
    numsCheck,
    lowercaseChecked,
    lettersEnabled,
    textinputEnabled,
    sliderNum,
    customPW,
  } = state;
  const numberProps = [
    {
      id: 'number',
      name: 'number',
      value: 'number',
      label: '123',
      inputType: 'checkbox',
      ischeckedfn: numsCheck,
      handleChange: numsCheckFn,
    },
  ];
  const splCharProps = [
    {
      id: 'Special characters',
      name: 'Special characters',
      value: '',
      label: '*%#',
      inputType: 'checkbox',
      ischeckedfn: splCharCheck,
      handleChange: splCharCheckFn,
    },
  ];
  const wordProp = [
    {
      id: 'capital letters',
      name: '',
      value: '',
      label: 'ABC',
      inputType: 'checkbox',
      ischeckedfn: capsChecked,
      handleChange: capsCheckFn,
      disabled: lettersEnabled,
    },
  ];
  const lowercaseProp = [
    {
      id: 'small letters',
      name: '',
      value: '',
      label: 'abc',
      inputType: 'checkbox',
      ischeckedfn: lowercaseChecked,
      handleChange: lowercaseCheckFn,
      disabled: lettersEnabled,
    },
  ];

  let pwLength = sliderNum;
  let password = '';

  // random number & characters
  const generateRandom = (min, max) => {
    const randNum = Math.floor(Math.random() * (max - min + 1) + min);
    const randChar = String.fromCharCode(randNum);
    password += randChar;
  };

  // true values
  const allValues = [capsChecked, splCharCheck, numsCheck, lowercaseChecked, customPW];
  let trueValues = [];
  allValues.forEach((v, i) => {
    if (v) {
      trueValues.push(v);
    }
  });

  // logic
  //custom input only
  let newCustomPw = '';
  if (customPW) {
    for (let [i, v] of [...customPW].entries()) {
      let randomcustomChar = Math.floor(Math.random() * customPW.length - 1);
      if (v === ' ') {
        continue;
      }
      if (i % randomcustomChar === 0) {
        newCustomPw += v.toUpperCase();
      } else {
        newCustomPw += v.toString();
      }
    }
  }
  // custom inputs + spl char
  else if (customPW && splCharCheck) {
    for (let [i, v] of [...customPW].entries()) {
      let randomcustomChar = Math.floor(Math.random() * customPW.length - 1);
      if (v === ' ') {
        continue;
      }
      if (i % randomcustomChar === 0) {
        newCustomPw += v.toUpperCase();
      } else {
        newCustomPw += v.toString();
      }
    }
    let count = 0;
    let tempString = '';
    while (count < newCustomPw.length) {
      let randChar = String.fromCharCode(Math.floor(Math.random() * (47 - 33 + 1) + 33));
      tempString += randChar;
      count++;
    }
    newCustomPw += tempString;
  }

  // caps and lowercase but not others
  if (trueValues.length === 2 && capsChecked && lowercaseChecked) {
    while (password.length < Math.floor(pwLength)) {
      generateRandom(97, 122);
      generateRandom(65, 90);
    }
  }
  // caps and lowercase and some other
  else if (trueValues.length >= 2 && capsChecked && lowercaseChecked) {
    while (password.length < Math.floor(pwLength / 2)) {
      generateRandom(65, 90);
      generateRandom(97, 122);
    }
    let remaining = pwLength - password.length;
    if (splCharCheck && numsCheck) {
      while (remaining > 0) {
        generateRandom(33, 57);
        remaining--;
      }
    } else if (splCharCheck && !numsCheck) {
      while (remaining > 0) {
        generateRandom(33, 47);
        remaining--;
      }
    } else if (numsCheck && !splCharCheck) {
      while (remaining > 0) {
        generateRandom(48, 57);
        remaining--;
      }
    }
  }

  // caps and some other
  else if (trueValues.length >= 2 && capsChecked) {
    while (password.length < Math.floor(pwLength / 2)) {
      generateRandom(65, 90);
    }
    let remaining = pwLength - password.length;
    if (splCharCheck && numsCheck) {
      while (remaining > 0) {
        generateRandom(33, 57);
        remaining--;
      }
    }
    if (splCharCheck) {
      while (remaining > 0) {
        generateRandom(33, 47);
        remaining--;
      }
    }
    if (numsCheck) {
      while (remaining > 0) {
        generateRandom(48, 57);
        remaining--;
      }
    }
  } // lowercase and some other
  else if (trueValues.length >= 2 && lowercaseChecked) {
    while (password.length < Math.floor(pwLength / 2)) {
      generateRandom(97, 122);
    }
    let remaining = pwLength - password.length;
    if (splCharCheck && numsCheck) {
      while (remaining > 0) {
        generateRandom(33, 57);
        remaining--;
      }
    }
    if (splCharCheck) {
      while (remaining > 0) {
        generateRandom(33, 47);
        remaining--;
      }
    }
    if (numsCheck) {
      while (remaining > 0) {
        generateRandom(48, 57);
        remaining--;
      }
    }
  }

  // nums or splchar
  else if (numsCheck && splCharCheck) {
    while (password.length < pwLength) {
      generateRandom(33, 57);
    }
  }

  // individual
  else if (trueValues.length === 1) {
    if (capsChecked) {
      while (password.length < pwLength) {
        generateRandom(65, 90);
      }
    }
    if (splCharCheck) {
      while (password.length < pwLength) {
        generateRandom(33, 47);
      }
    }
    if (numsCheck) {
      while (password.length < pwLength) {
        generateRandom(48, 57);
      }
    }
    if (lowercaseChecked) {
      while (password.length < pwLength) {
        generateRandom(97, 122);
      }
    }
  }

  // JSX for the password string component
  return (
    <div>
      <h2>Strong Password Generator</h2>
      <div className="password ">
        <h3>{password || newCustomPw}</h3>
        <p className="charCount">{password.length || newCustomPw.length} characters</p>
      </div>
      <input
        onChange={sliderChange}
        type="range"
        min="6"
        max="40"
        value={password.length || newCustomPw.length}
        id="myRange"
      ></input>
      <fieldset className="flex">
        <CheckBoxComp propArray={numberProps} />
        <CheckBoxComp propArray={splCharProps} />
        <div className="flex radio">
          <div>
            <input type="radio" id="checkboxes" onChange={handleRadioCheck} name="password" value="Choose one" />
            <label for="html">Letters</label>
            <div className="flexbox">
              <CheckBoxComp propArray={wordProp} />
              <CheckBoxComp propArray={lowercaseProp} />
            </div>
            <input
              type="radio"
              id="input"
              onChange={handleInputRadioCheck}
              name="password"
              value="Enter your own"
              defaultChecked
            />
            <label for="css">Enter Custom</label>
          </div>
          <div className=" choices">
            <form className="customPw">
              <label htmlFor="typeOwn"></label>
              <input
                type="text"
                placeholder="Type your own"
                id="customText"
                name="customText"
                value={customPW}
                onChange={inputChange}
                disabled={textinputEnabled}
              />
            </form>
          </div>
        </div>
      </fieldset>
    </div>
  );
};
export default PWGenComponent;
