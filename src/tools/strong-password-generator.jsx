import { useState } from 'react';
import { CheckBoxComp } from '../Components/checkbox';
import { ReloadIcon } from '../Components/refresh-svgrepo-com';

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
    reloadCount: 0,
    sliderUse: false,
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
    setState({ ...state, sliderNum: parseInt(e.target.value), sliderUse: !sliderUse });
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
    reloadCount,
    sliderUse,
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
  let newCustomPw = '';

  // random number & characters
  const generateRandom = (min, max) => {
    const randNum = Math.floor(Math.random() * (max - min + 1) + min);
    const randChar = String.fromCharCode(randNum);
    password += randChar;
  };

  // true values
  const allValues = [capsChecked, splCharCheck, numsCheck, lowercaseChecked];
  let trueValues = [];
  allValues.forEach((v, i) => {
    if (v) {
      trueValues.push(v);
    }
  });

  // logic
  //custom input only

  if (customPW && !splCharCheck && !numsCheck) {
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
  else if (customPW && splCharCheck && !numsCheck) {
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
    while (count < 8) {
      let randNum = Math.floor(Math.random() * (47 - 33 + 1) + 33);
      let randChar = String.fromCharCode(randNum);
      newCustomPw += randChar;
      count++;
    }
  } else if (customPW && !splCharCheck && numsCheck) {
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
    while (count < 8) {
      let randNum = Math.floor(Math.random() * (57 - 48 + 1) + 48);
      let randChar = String.fromCharCode(randNum);
      newCustomPw += randChar;
      count++;
    }
  } else if (customPW && splCharCheck && numsCheck) {
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
    while (count < 8) {
      let randNum = Math.floor(Math.random() * (57 - 33 + 1) + 33);
      let randChar = String.fromCharCode(randNum);
      newCustomPw += randChar;
      count++;
    }
  }

  // caps and lowercase but not others
  else if (trueValues.length === 2 && capsChecked && lowercaseChecked) {
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
  // reload button function
  const handleReload = () => {
    setState({ ...state, reloadCount: reloadCount + 1 });
  };
  // password strength
  

  // JSX for the password string component
  return (
    <div className='flex'>
      <h2>Strong Password Generator</h2>
      <div className="password ">
        <div className="flexbox">
          <h3>{password || newCustomPw}</h3>
          <div className="reloadIcon">
            <ReloadIcon onClick={handleReload} />
          </div>
        </div>
        <p className="charCount">{password.length || newCustomPw.length} characters</p>
      </div>
      <div>
      <input
        onChange={sliderChange}
        type="range"
        min="6"
        max="33"
        value={password.length || newCustomPw.length}
        id="myRange"
      ></input>
      </div>
      <div className="error">
        <p style={{ fontSize: '.8rem', color: 'grey' }}>
          {customPW && sliderUse ? 'Password length is controlled by typing' : ''}
        </p>
      </div>
      <div className="grid">
        <fieldset className="">
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
                  className="textInput"
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
        <aside>
          <h4>How to use this password generator</h4>
          <ol>
            <li>
              Enter your own word, like name of site for which you're generating the password (Amazon, HSBC bank etc.)
            </li>
            <li>Or choose the 'Letters' option to generate random letters</li>
            <li>Select additional inputs like numbers or special characters</li>
            <li>Use the slider to control the length and use the refresh button to generate new options</li>
          </ol>
        </aside>
      </div>
    </div>
  );
};
export default PWGenComponent;
