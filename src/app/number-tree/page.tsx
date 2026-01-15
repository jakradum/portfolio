"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { VisualizerLayout } from "@/components/visualizer-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Check if a number is prime
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// Get prime factors of a number
function getPrimeFactors(n: number): number[] {
  if (n < 2) return [];
  const factors: number[] = [];
  let remaining = n;

  for (let p = 2; p <= remaining; p++) {
    if (remaining % p === 0) {
      factors.push(p);
      while (remaining % p === 0) {
        remaining /= p;
      }
    }
  }
  return factors;
}

// Get all multiples of a number up to max
function getMultiples(n: number, max: number): number[] {
  const multiples: number[] = [];
  for (let m = n * 2; m <= max; m += n) {
    multiples.push(m);
  }
  return multiples;
}

interface NodeData {
  value: number;
  isPrime: boolean;
  primeFactors: number[];
}

export default function NumberTree() {
  const [maxNum, setMaxNum] = useState<string>("50");
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const maxN = Math.min(Math.max(2, parseInt(maxNum) || 10), 500);

  // Grid configuration based on maxN
  const gridConfig = useMemo(() => {
    const cols = maxN <= 50 ? 10 : maxN <= 150 ? 15 : maxN <= 300 ? 20 : 25;
    const gap = maxN <= 100 ? 6 : maxN <= 200 ? 4 : 3;
    const cellHeight = maxN <= 50 ? 36 : maxN <= 100 ? 32 : maxN <= 200 ? 28 : 24;
    const fontSize = maxN <= 50 ? "text-sm" : maxN <= 100 ? "text-xs" : "text-[10px]";
    return { cols, gap, cellHeight, fontSize };
  }, [maxN]);

  // Build the node data
  const { nodes, primes, composites } = useMemo(() => {
    const nodes: Map<number, NodeData> = new Map();
    const primes: number[] = [];
    const composites: number[] = [];

    for (let i = 2; i <= maxN; i++) {
      const prime = isPrime(i);
      if (prime) {
        primes.push(i);
      } else {
        composites.push(i);
      }
      nodes.set(i, {
        value: i,
        isPrime: prime,
        primeFactors: prime ? [] : getPrimeFactors(i),
      });
    }

    return { nodes, primes, composites };
  }, [maxN]);

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [maxN]);

  // Calculate node positions mathematically based on grid
  const getNodePosition = useCallback((num: number) => {
    if (containerSize.width === 0) return null;

    const index = num - 1; // 0-indexed (1 is first number in grid)
    const { cols, gap, cellHeight } = gridConfig;

    const row = Math.floor(index / cols);
    const col = index % cols;

    // Calculate cell width based on container width
    const totalGapWidth = (cols - 1) * gap;
    const cellWidth = (containerSize.width - totalGapWidth) / cols;

    const x = col * (cellWidth + gap) + cellWidth / 2;
    const y = row * (cellHeight + gap) + cellHeight / 2;

    return { x, y };
  }, [containerSize.width, gridConfig]);

  // Calculate which nodes/connections to highlight based on hover
  const { highlightedNodes, highlightedConnections } = useMemo(() => {
    const highlightedNodes = new Set<number>();
    const highlightedConnections: { from: number; to: number }[] = [];

    if (hoveredNode === null) {
      return { highlightedNodes, highlightedConnections };
    }

    const node = nodes.get(hoveredNode);
    if (!node) return { highlightedNodes, highlightedConnections };

    highlightedNodes.add(hoveredNode);

    if (node.isPrime) {
      // Hovering on prime: highlight all multiples
      const multiples = getMultiples(hoveredNode, maxN);
      multiples.forEach(m => {
        highlightedNodes.add(m);
        highlightedConnections.push({ from: hoveredNode, to: m });
      });
    } else {
      // Hovering on composite: highlight all prime factors and trace back
      node.primeFactors.forEach(p => {
        highlightedNodes.add(p);
        highlightedConnections.push({ from: p, to: hoveredNode });
      });
    }

    return { highlightedNodes, highlightedConnections };
  }, [hoveredNode, nodes, maxN]);

  const handleNodeHover = useCallback((value: number | null) => {
    setHoveredNode(value);
  }, []);

  // Numbers array from 1 to maxN (1 is included but greyed out)
  const numbers = useMemo(() => {
    const arr: number[] = [];
    for (let i = 1; i <= maxN; i++) {
      arr.push(i);
    }
    return arr;
  }, [maxN]);

  // Calculate total grid height for SVG
  const totalRows = Math.ceil(maxN / gridConfig.cols);
  const gridHeight = totalRows * gridConfig.cellHeight + (totalRows - 1) * gridConfig.gap;

  return (
    <VisualizerLayout title="Number Tree">
      <div className="mb-8 max-w-xs">
        <div className="space-y-2">
          <Label htmlFor="maxNum">Numbers from 2 to</Label>
          <Input
            id="maxNum"
            type="number"
            min="2"
            max="500"
            value={maxNum}
            onChange={(e) => setMaxNum(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 flex gap-12">
        <div>
          <p className="text-sm text-muted-foreground">Primes</p>
          <p className="text-3xl font-light text-accent">{primes.length}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Composites</p>
          <p className="text-3xl font-light text-foreground">{composites.length}</p>
        </div>
      </div>

      {/* Hover info */}
      <div className="mb-4 h-6">
        {hoveredNode !== null && (
          <p className="text-sm">
            {nodes.get(hoveredNode)?.isPrime ? (
              <span className="text-accent">
                <span className="font-medium">{hoveredNode}</span> is prime → gives rise to {getMultiples(hoveredNode, maxN).length} multiples{getMultiples(hoveredNode, maxN).length === 0 ? ` (under ${maxN})` : ""}
              </span>
            ) : (
              <span className="text-foreground">
                <span className="font-medium">{hoveredNode}</span> = {getPrimeFactors(hoveredNode).join(" × ")} → comes from {getPrimeFactors(hoveredNode).length} prime{getPrimeFactors(hoveredNode).length > 1 ? "s" : ""}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Grid visualization with SVG overlay for connections */}
      <div className="border border-border p-3">
        <div ref={containerRef} className="relative">
          {/* SVG overlay for connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: gridHeight, zIndex: 5 }}
          >
            {highlightedConnections.map(({ from, to }, i) => {
              const fromPos = getNodePosition(from);
              const toPos = getNodePosition(to);
              if (!fromPos || !toPos) return null;

              return (
                <line
                  key={`${from}-${to}-${i}`}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="#a78bfa"
                  strokeWidth={1.5}
                  strokeOpacity={0.6}
                />
              );
            })}
          </svg>

          {/* Number grid */}
          <div
            className="grid relative"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
              gap: `${gridConfig.gap}px`,
              zIndex: 10,
            }}
          >
            {numbers.map((num) => {
              // Special handling for 1 - greyed out, no hover
              if (num === 1) {
                return (
                  <div
                    key={num}
                    data-value={num}
                    className="relative flex items-center justify-center border border-border/30 bg-background text-muted-foreground/30"
                    style={{ height: gridConfig.cellHeight }}
                  >
                    <span className={gridConfig.fontSize}>1</span>
                  </div>
                );
              }

              const node = nodes.get(num);
              const isHighlighted = highlightedNodes.has(num);
              const isHovered = hoveredNode === num;
              const isPrimeNum = node?.isPrime ?? false;

              return (
                <div
                  key={num}
                  data-value={num}
                  onMouseEnter={() => handleNodeHover(num)}
                  onMouseLeave={() => handleNodeHover(null)}
                  className={`
                    relative flex items-center justify-center cursor-pointer transition-all duration-150
                    border
                    ${isHovered
                      ? "bg-accent border-accent text-background"
                      : isHighlighted
                      ? isPrimeNum
                        ? "bg-accent/20 border-accent text-accent"
                        : "bg-muted border-accent text-foreground"
                      : isPrimeNum
                      ? "border-accent/50 text-accent"
                      : "border-border text-muted-foreground"
                    }
                  `}
                  style={{ height: gridConfig.cellHeight }}
                >
                  <span className={`${gridConfig.fontSize} ${isPrimeNum ? "font-medium" : ""}`}>
                    {num}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-8 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 border border-accent/50" />
          <span>Prime numbers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 border border-border" />
          <span>Composite numbers</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-8 space-y-4 text-sm text-muted-foreground border-t border-border pt-8">
        <p>
          This visualizes the relationship between prime numbers and composite numbers. Primes are the &quot;roots&quot; of the number system - they cannot be broken down into smaller factors.
        </p>
        <p>
          <strong className="text-foreground">Hover on a prime</strong> to see all the numbers it &quot;gives rise to&quot; - its multiples. For example, hovering on 2 highlights all even numbers.
        </p>
        <p>
          <strong className="text-foreground">Hover on a composite</strong> to trace back to the primes it &quot;comes from&quot; - its prime factors. For example, 12 traces back to both 2 and 3.
        </p>
        <p>
          Every composite number is uniquely determined by its prime factors (Fundamental Theorem of Arithmetic).
        </p>
        <p className="border-t border-border pt-4 mt-4">
          Primes are the basis for all numbers, but composites present their own fascinating side. As you interact with this tool, try hovering on the composites - how many lines do you generally see? 2? 3? 4?
        </p>
        <p>
          You&apos;ll never see 5 lines tracing back to primes from any composite up to 500. But you will see 4. Which numbers are they? One way to find these composites with the most distinct prime factors is straightforward - multiply as many small primes as you can while keeping the product under 500. Try <strong className="text-foreground">210</strong> - it&apos;s 2 × 3 × 5 × 7.
        </p>
      </div>

      {/* Prime list */}
      <div className="mt-8 space-y-4 border-t border-border pt-8">
        <h3 className="text-sm font-medium text-muted-foreground">Primes up to {maxN}</h3>
        <p className="text-accent">
          {primes.join(", ")}
        </p>
      </div>
    </VisualizerLayout>
  );
}
