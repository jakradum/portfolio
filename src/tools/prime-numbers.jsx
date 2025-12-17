import React, { useState } from 'react';

export const PrimeNumbers = () => {
  const [number, setNumber] = useState('');
  let divisor;

  // logic
  function dingDong(e) {
    if (e.target.value === '') {
      setNumber('Enter a number');
      return;
    }
    let num = parseInt(e.target.value);
    let prime, res, neither, large;
    let length = num.toString().length;
    
    if(length > 10){large = true; return;}

    if (num % 2 === 0) {
      // if the number is even
      prime = false; // ie it is composite
      divisor = 2;
    } else {
      if (num % 5 === 0) {
        res = `div by 5`
      }
      // if the number is odd, actual prime check starts here
      let currentNum = 3;
      function isPrime() {
        // base case
        if (prime) {
          return;
        }
        else if (num < 3) {
          neither = true;
          return;
        } else if (num === currentNum) {
          prime = true; // found a prime number!
        } else if(num % currentNum === 0) {
          // if divisible by current num
          prime = false;
          divisor = currentNum;
          console.log(divisor);
          
          return;
        } else { // recursion
          currentNum = currentNum + 2;
          isPrime()
        }
      }
      isPrime();
    }
    if (large) {
      res = `Try a smaller number`;
    } else if (neither) {
      res = `Enter a number greater than 1`;
    } else if (prime) {
      res = `${num} is Prime`;
    } else {
      res = `Not Prime, divisible by ${divisor}`;
    }
    setNumber(res);
  }

  return (
    <section style={{ alignItems: 'center' }}>
      <h1 style={{ margin: '0 auto' }}>Prime Number Checker</h1>
      <div className="flex">
        <fieldset>
          <div className="flexbox">
            <input type="text" className="textInput" onChange={dingDong} placeholder="Enter a number" />
          </div>
        </fieldset>
        <div className="password">
          <h3>{number ? number : 'Number will appear here'}</h3>
        </div>
      </div>
    </section>
  );
};
