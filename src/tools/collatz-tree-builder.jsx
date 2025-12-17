import { useState } from 'react';

export const CollatzTreeBuilder = () => {
  const [exponent, setExponent] = useState('');
  const [depth, setDepth] = useState(6);
  const [treeData, setTreeData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Check if a number is prime
  const isPrime = (num) => {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i * i <= num; i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  };

  // Check if a number can be represented as 3n
  const canBe3n = (num) => {
    return num % 3 === 0;
  };

  // Get the previous numbers in the Collatz sequence
  const getPreviousNumbers = (num) => {
    const previous = [];
    previous.push({ value: num * 2, operation: 'n/2', label: '÷2' });
    if ((num - 1) % 3 === 0) {
      const n = (num - 1) / 3;
      previous.push({ value: n, operation: '3n+1', label: '3n+1' });
    }
    return previous;
  };

  // Build tree structure
  const buildTreeStructure = (startNum, maxDepth) => {
    const visited = new Set();

    const buildNode = (num, currentDepth) => {
      const node = { value: num, children: [], depth: currentDepth };

      if (currentDepth >= maxDepth) {
        node.isEndpoint = true;
        node.reason = 'max depth';
        return node;
      }

      if (visited.has(num)) {
        node.isEndpoint = true;
        node.reason = 'cycle';
        return node;
      }

      visited.add(num);

      const previous = getPreviousNumbers(num);

      if (previous.length === 1 && previous[0].operation === 'n/2' && isPrime(num)) {
        node.isEndpoint = true;
        node.reason = 'prime';
        return node;
      }

      for (const prev of previous) {
        if (prev.operation === '3n+1') {
          if (!canBe3n(prev.value - 1)) {
            node.children.push({
              value: prev.value,
              operation: prev.label,
              isEndpoint: true,
              reason: 'not 3n',
              depth: currentDepth + 1,
              children: []
            });
          } else {
            const childNode = buildNode(prev.value, currentDepth + 1);
            childNode.operation = prev.label;
            node.children.push(childNode);
          }
        } else {
          const childNode = buildNode(prev.value, currentDepth + 1);
          childNode.operation = prev.label;
          node.children.push(childNode);
        }
      }

      return node;
    };

    return buildNode(startNum, 0);
  };

  const handleCalculate = () => {
    const exp = parseInt(exponent);

    if (isNaN(exp) || exp < 1) {
      alert('Please enter a valid positive exponent');
      return;
    }

    if (exp % 2 !== 0) {
      alert('Please enter an even exponent (e.g., 2, 4, 6, 8, 10...)');
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const startNumber = Math.pow(2, exp);
      const n = (startNumber - 1) / 3;
      const tree = buildTreeStructure(n, depth);
      setTreeData(tree);
      setIsCalculating(false);
    }, 100);
  };

  // Render tree node recursively
  const renderTreeNode = (node, isRoot = false) => {
    if (!node) return null;

    const getNodeColor = () => {
      if (node.isEndpoint) {
        if (node.reason === 'prime') return '#dc3545';
        if (node.reason === 'not 3n') return '#28a745';
        if (node.reason === 'max depth') return '#6c757d';
        if (node.reason === 'cycle') return '#ffc107';
      }
      return '#007bff';
    };

    const getNodeLabel = () => {
      if (node.isEndpoint) {
        if (node.reason === 'prime') return 'PRIME';
        if (node.reason === 'not 3n') return 'NON-3N';
        if (node.reason === 'max depth') return 'MAX DEPTH';
        if (node.reason === 'cycle') return 'CYCLE';
      }
      return null;
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
        {/* Node */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              padding: '12px 20px',
              backgroundColor: getNodeColor(),
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              minWidth: '60px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            {node.value.toLocaleString()}
            {getNodeLabel() && (
              <div style={{ fontSize: '9px', marginTop: '2px', opacity: 0.9 }}>
                {getNodeLabel()}
              </div>
            )}
          </div>

          {/* Branches */}
          {node.children && node.children.length > 0 && (
            <>
              {/* Vertical line down */}
              <div style={{ width: '2px', height: '20px', backgroundColor: '#999' }}></div>

              {/* Horizontal connector for multiple children */}
              {node.children.length > 1 && (
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: `${node.children.length * 150}px`,
                      height: '2px',
                      backgroundColor: '#999',
                      position: 'relative'
                    }}
                  ></div>
                </div>
              )}

              {/* Children container */}
              <div style={{ display: 'flex', gap: '20px', marginTop: node.children.length > 1 ? '0' : '0' }}>
                {node.children.map((child, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Vertical line to child */}
                    <div style={{ width: '2px', height: '20px', backgroundColor: '#999' }}></div>

                    {/* Operation label */}
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#666',
                        backgroundColor: '#f0f0f0',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        marginBottom: '5px',
                        fontFamily: 'monospace'
                      }}
                    >
                      {child.operation}
                    </div>

                    {/* Child node */}
                    {renderTreeNode(child)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '20px' }}>
      {/* Controls */}
      <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Collatz Tree Builder</h2>
        <p style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
          Explore the reverse Collatz conjecture tree starting from 2^n
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Enter even exponent for 2^n:
          </label>
          <input
            type="number"
            value={exponent}
            onChange={(e) => setExponent(e.target.value)}
            placeholder="e.g., 4 for 2^4 = 16"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid #ddd',
              borderRadius: '6px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Maximum tree depth: {depth}
          </label>
          <input
            type="range"
            min="3"
            max="8"
            value={depth}
            onChange={(e) => setDepth(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.25rem' }}>
            Note: Higher depths create larger trees
          </p>
        </div>

        <button
          className="button-59"
          onClick={handleCalculate}
          disabled={isCalculating}
          style={{ width: '100%', padding: '12px' }}
        >
          {isCalculating ? 'Building Tree...' : 'Build Tree'}
        </button>

        {/* Legend */}
        {treeData && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '0.9rem' }}>Legend:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#dc3545', borderRadius: '3px' }}></div>
                <span>Prime Endpoint</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#28a745', borderRadius: '3px' }}></div>
                <span>Cannot be 3n</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#6c757d', borderRadius: '3px' }}></div>
                <span>Max Depth</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#007bff', borderRadius: '3px' }}></div>
                <span>Branch Node</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tree Visualization */}
      {treeData && (
        <div style={{
          overflowX: 'auto',
          overflowY: 'auto',
          maxHeight: '80vh',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '30px',
          backgroundColor: '#fafafa'
        }}>
          {renderTreeNode(treeData, true)}
        </div>
      )}
    </div>
  );
};
