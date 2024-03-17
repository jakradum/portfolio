import { useState } from 'react';
import { CheckBoxComp } from '../Components/checkbox';
const PWGenComponent = () => {
  const [state, setState] = useState({
    capsChecked: true,
    splCharCheck: null,
    numsCheck: null,
    lowercaseChecked: false,
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
  const { capsChecked, splCharCheck, numsCheck, lowercaseChecked } = state;
  const numberProps = [
    {
      id: 'number',
      name: 'number',
      value: 'number',
      label: 'Number',
      ischeckedfn: numsCheck,
      handleChange: numsCheckFn,
    },
  ];
  const splCharProps = [
    {
      id: 'Special characters',
      name: 'Special characters',
      value: '',
      label: 'Special characters',
      ischeckedfn: splCharCheck,
      handleChange: splCharCheckFn,
    },
  ];
  const wordProp = [
    {
      id: 'capital letters',
      name: '',
      value: '',
      label: 'CAPITAL LETTERS',
      ischeckedfn: capsChecked,
      handleChange: capsCheckFn,
    },
  ];
  const lowercaseProp = [
    {
      id: 'small letters',
      name: '',
      value: '',
      label: 'lower case letters',
      ischeckedfn: lowercaseChecked,
      handleChange: lowercaseCheckFn,
    },
  ];

  let pwLength = 12;
  let password = '';

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

  // multiple true
  // caps and lowercase and some other
  if (trueValues.length >= 2 && capsChecked && lowercaseChecked) {
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
   // caps and lowercase but not others
   else if (trueValues.length === 2 && capsChecked && lowercaseChecked) {
    while (password.length < Math.floor(pwLength)) {
      generateRandom(97, 122);
      generateRandom(65, 90);
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
        <h3>{password}</h3>
      </div>
      {/* <p>remaining characters: {pwLength - password.length}</p> */}
      <fieldset className="flex">
        <CheckBoxComp propArray={numberProps} />
        <CheckBoxComp propArray={splCharProps} />
        <CheckBoxComp propArray={wordProp} />
        <CheckBoxComp propArray={lowercaseProp} />
      </fieldset>
    </div>
  );
};
export default PWGenComponent;
