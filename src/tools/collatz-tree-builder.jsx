import { useState } from 'react';

export const CollatzTreeBuilder = () => {
  const [exponent, setExponent] = useState('');
  const [depth, setDepth] = useState(10);
  const [endpoints, setEndpoints] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Check if a number can be represented as 3n (i.e., divisible by 3)
  const canBe3n = (num) => {
    return num % 3 === 0;
  };

  // Get the previous number in the Collatz sequence (reverse operations)
  const getPreviousNumbers = (num) => {
    const previous = [];

    // Case 1: num could have come from 2*num (division operation in forward Collatz)
    previous.push({ value: num * 2, operation: 'halved' });

    // Case 2: num could have come from (num-1)/3 if (num-1) is divisible by 3
    // This is the reverse of 3n+1
    if ((num - 1) % 3 === 0) {
      const n = (num - 1) / 3;
      previous.push({ value: n, operation: '3n+1' });
    }

    return previous;
  };

  // Build the reverse Collatz tree
  const buildReverseTree = (startNum, maxDepth) => {
    const foundEndpoints = new Set();
    const visited = new Set();

    const explore = (num, currentDepth) => {
      // Stop if we've reached max depth
      if (currentDepth >= maxDepth) {
        foundEndpoints.add(num);
        return;
      }

      // Stop if we've seen this number before (cycle detection)
      if (visited.has(num)) {
        foundEndpoints.add(num);
        return;
      }

      visited.add(num);

      // Get possible previous numbers
      const previous = getPreviousNumbers(num);

      for (const prev of previous) {
        // If this came from 3n+1 operation, check if the result is valid
        if (prev.operation === '3n+1') {
          // If the number can't be represented as 3n, it's an endpoint
          if (!canBe3n(prev.value - 1)) {
            foundEndpoints.add(prev.value);
          } else {
            explore(prev.value, currentDepth + 1);
          }
        } else {
          // For halved numbers, continue exploring
          explore(prev.value, currentDepth + 1);
        }
      }
    };

    explore(startNum, 0);
    return Array.from(foundEndpoints).sort((a, b) => a - b);
  };

  const handleCalculate = () => {
    const exp = parseInt(exponent);

    // Validate input
    if (isNaN(exp) || exp < 1) {
      alert('Please enter a valid positive exponent');
      return;
    }

    if (exp % 2 !== 0) {
      alert('Please enter an even exponent (e.g., 2, 4, 6, 8, 10...)');
      return;
    }

    if (exp > 20) {
      const confirm = window.confirm(
        `Exponent ${exp} will calculate 2^${exp} = ${Math.pow(2, exp).toLocaleString()}. This might take a while. Continue?`
      );
      if (!confirm) return;
    }

    setIsCalculating(true);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const startNumber = Math.pow(2, exp);
      const n = (startNumber - 1) / 3;

      console.log(`Starting from 2^${exp} = ${startNumber}`);
      console.log(`3n+1 gives us ${startNumber}, so n = ${n}`);
      console.log(`Building tree from ${n} with max depth ${depth}`);

      const results = buildReverseTree(n, depth);
      setEndpoints(results);
      setIsCalculating(false);
    }, 100);
  };

  return (
    <div className="flex">
      <div className="password">
        <h2>Collatz Tree Builder</h2>
        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#666' }}>
          Explore the reverse Collatz conjecture tree starting from 2^n
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Enter even exponent for 2^n:
          </label>
          <input
            type="number"
            value={exponent}
            onChange={(e) => setExponent(e.target.value)}
            placeholder="e.g., 10 for 2^10 = 1024"
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Maximum tree depth: {depth}
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={depth}
            onChange={(e) => setDepth(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          className="button-59"
          onClick={handleCalculate}
          disabled={isCalculating}
          style={{ marginBottom: '1.5rem' }}
        >
          {isCalculating ? 'Calculating...' : 'Build Tree'}
        </button>

        {endpoints.length > 0 && (
          <div>
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
              Tree Endpoints ({endpoints.length} found)
            </h3>
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '1rem',
              backgroundColor: '#f9f9f9'
            }}>
              {endpoints.map((num, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: '1px solid #eee',
                    fontFamily: 'monospace'
                  }}
                >
                  {num.toLocaleString()}
                  {!canBe3n(num - 1) && (
                    <span style={{ marginLeft: '1rem', color: '#28a745', fontSize: '0.8rem' }}>
                      (cannot be 3n)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
