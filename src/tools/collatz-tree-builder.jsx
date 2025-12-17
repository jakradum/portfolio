import { useState, useEffect } from 'react';

export const CollatzTreeBuilder = () => {
  const [exponent, setExponent] = useState('');
  const [currentDepth, setCurrentDepth] = useState(10);
  const [treeData, setTreeData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [visibleDepth, setVisibleDepth] = useState(0);
  const [expansionCount, setExpansionCount] = useState(0);
  const [startNumber, setStartNumber] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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

  // Animate tree reveal level by level
  useEffect(() => {
    if (treeData && visibleDepth < currentDepth) {
      const timer = setTimeout(() => {
        setVisibleDepth(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [treeData, visibleDepth, currentDepth]);

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
    setVisibleDepth(0);
    setExpansionCount(0);

    setTimeout(() => {
      const num = Math.pow(2, exp);
      const n = (num - 1) / 3;
      setStartNumber(n);
      const tree = buildTreeStructure(n, currentDepth);
      setTreeData(tree);
      setIsCalculating(false);
    }, 100);
  };

  const handleExpandDepth = () => {
    if (expansionCount >= 5 || !startNumber) return;

    setIsCalculating(true);
    setExpansionCount(prev => prev + 1);
    const newDepth = currentDepth + 10;
    setCurrentDepth(newDepth);

    setTimeout(() => {
      const tree = buildTreeStructure(startNumber, newDepth);
      setTreeData(tree);
      setIsCalculating(false);
      setVisibleDepth(currentDepth); // Start animation from current depth
    }, 100);
  };

  // Calculate scale based on current depth and zoom
  const getScale = () => {
    let baseScale = 1;
    if (currentDepth <= 10) baseScale = 1;
    else if (currentDepth <= 20) baseScale = 0.85;
    else if (currentDepth <= 30) baseScale = 0.7;
    else if (currentDepth <= 40) baseScale = 0.6;
    else baseScale = 0.5;

    return baseScale * zoomLevel;
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Render tree node recursively with animation
  const renderTreeNode = (node, isRoot = false) => {
    if (!node) return null;

    // Only show nodes up to visible depth
    if (node.depth > visibleDepth) return null;

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
        if (node.reason === 'max depth') return 'MAX';
        if (node.reason === 'cycle') return 'CYCLE';
      }
      return null;
    };

    const scale = getScale();

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: `${10 * scale}px`,
          opacity: node.depth === visibleDepth ? 0 : 1,
          animation: node.depth === visibleDepth ? 'fadeIn 0.5s ease-in forwards' : 'none'
        }}
      >
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>

        {/* Node */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              padding: `${12 * scale}px ${20 * scale}px`,
              backgroundColor: getNodeColor(),
              color: 'white',
              borderRadius: `${8 * scale}px`,
              fontWeight: 'bold',
              fontSize: `${14 * scale}px`,
              minWidth: `${60 * scale}px`,
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            {node.value.toLocaleString()}
            {getNodeLabel() && (
              <div style={{ fontSize: `${9 * scale}px`, marginTop: '2px', opacity: 0.9 }}>
                {getNodeLabel()}
              </div>
            )}
          </div>

          {/* Branches */}
          {node.children && node.children.length > 0 && (
            <>
              {/* Vertical line down */}
              <div style={{ width: `${2 * scale}px`, height: `${20 * scale}px`, backgroundColor: '#999' }}></div>

              {/* Horizontal connector for multiple children */}
              {node.children.length > 1 && (
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: `${node.children.length * 150 * scale}px`,
                      height: `${2 * scale}px`,
                      backgroundColor: '#999',
                      position: 'relative'
                    }}
                  ></div>
                </div>
              )}

              {/* Children container */}
              <div style={{ display: 'flex', gap: `${20 * scale}px`, marginTop: '0' }}>
                {node.children.map((child, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Vertical line to child */}
                    <div style={{ width: `${2 * scale}px`, height: `${20 * scale}px`, backgroundColor: '#999' }}></div>

                    {/* Operation label */}
                    <div
                      style={{
                        fontSize: `${11 * scale}px`,
                        color: '#666',
                        backgroundColor: '#f0f0f0',
                        padding: `${2 * scale}px ${8 * scale}px`,
                        borderRadius: `${4 * scale}px`,
                        marginBottom: `${5 * scale}px`,
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
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Fixed Header Controls */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        borderBottom: '2px solid #ddd',
        padding: '20px',
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px', marginTop: 0 }}>Collatz Tree Builder</h2>
          <p style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
            Explore the reverse Collatz conjecture tree starting from 2^n
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
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

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                Current depth: {currentDepth} levels
              </label>
              <button
                className="button-59"
                onClick={handleCalculate}
                disabled={isCalculating}
                style={{ width: '100%', padding: '12px', marginTop: '4px' }}
              >
                {isCalculating ? 'Building Tree...' : treeData ? 'Rebuild Tree' : 'Build Tree'}
              </button>
            </div>
          </div>

          {treeData && (
            <>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button
                  className="button-59"
                  onClick={handleExpandDepth}
                  disabled={expansionCount >= 5 || isCalculating}
                  style={{
                    flex: 1,
                    padding: '10px',
                    opacity: expansionCount >= 5 ? 0.5 : 1,
                    cursor: expansionCount >= 5 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isCalculating ? 'Expanding...' : `Expand +10 Levels (${5 - expansionCount} left)`}
                </button>
              </div>

              {/* Legend and Zoom Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#dc3545', borderRadius: '2px' }}></div>
                    <span>Prime</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#28a745', borderRadius: '2px' }}></div>
                    <span>Non-3n</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#6c757d', borderRadius: '2px' }}></div>
                    <span>Max</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#007bff', borderRadius: '2px' }}></div>
                    <span>Branch</span>
                  </div>
                </div>

                {/* Zoom Controls */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={handleZoomOut}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: '0.85rem', minWidth: '60px', textAlign: 'center' }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={handleResetZoom}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tree Visualization - Full Width */}
      {treeData && (
        <div style={{
          overflowX: 'auto',
          overflowY: 'auto',
          padding: '40px 20px',
          minHeight: '500px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          {renderTreeNode(treeData, true)}
        </div>
      )}

      {!treeData && (
        <div style={{
          textAlign: 'center',
          padding: '100px 20px',
          color: '#999',
          fontSize: '1.1rem'
        }}>
          Enter an even exponent and click "Build Tree" to visualize the Collatz tree
        </div>
      )}
    </div>
  );
};
