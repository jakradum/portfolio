"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { VisualizerLayout } from "@/components/visualizer-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import katex from "katex";
import "katex/dist/katex.min.css";

function Tex({ children, display = false }: { children: string; display?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        displayMode: display,
        throwOnError: false,
      });
    }
  }, [children, display]);

  return <span ref={ref} />;
}

export default function APGenerator() {
  const [d, setD] = useState<string>("2");
  const [a, setA] = useState<string>("3");
  const [n, setN] = useState<string>("57");
  const [zoom, setZoom] = useState(1);
  const [hoveredTerm, setHoveredTerm] = useState<{ value: number; index: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const aNum = parseFloat(a) || 0;
  const dNum = parseFloat(d) || 0;
  const nNum = parseInt(n) || 0;

  const sum = useMemo(() => {
    // Sum = n*a + d*(n*(n-1)/2)
    return nNum * aNum + dNum * (nNum * (nNum - 1) / 2);
  }, [aNum, dNum, nNum]);

  const nthTerm = useMemo(() => {
    // nth term = a + (n-1)*d
    return aNum + (nNum - 1) * dNum;
  }, [aNum, dNum, nNum]);

  const { terms, termSet, minVal, maxVal } = useMemo(() => {
    const terms: number[] = [];
    for (let i = 0; i < nNum; i++) {
      terms.push(aNum + i * dNum);
    }

    const termSet = new Set(terms);

    let minVal = 0;
    let maxVal = 10;
    if (terms.length > 0) {
      minVal = terms.reduce((min, val) => val < min ? val : min, terms[0]);
      maxVal = terms.reduce((max, val) => val > max ? val : max, terms[0]);
      if (minVal > 0) minVal = 0;
    }

    return { terms, termSet, minVal, maxVal };
  }, [aNum, dNum, nNum]);

  // Determine what to show based on zoom level
  const displayMode = useMemo(() => {
    if (zoom >= 0.7) return "all"; // Show all numbers
    if (zoom >= 0.4) return "terms"; // Show only terms
    if (zoom >= 0.25) return "every6"; // Show every 6th term
    return "every10"; // Show every 10th term
  }, [zoom]);

  const numberLine = useMemo(() => {
    if (displayMode === "all") {
      const start = Math.floor(minVal) - 2;
      const end = Math.ceil(maxVal) + 2;
      const numbers: number[] = [];
      for (let i = start; i <= end; i++) {
        numbers.push(i);
      }
      return numbers;
    }
    // For other modes, return terms only
    return terms;
  }, [minVal, maxVal, displayMode, terms]);

  const visibleTerms = useMemo(() => {
    if (displayMode === "all" || displayMode === "terms") {
      return new Set(terms);
    }
    if (displayMode === "every6") {
      return new Set(terms.filter((_, i) => i % 6 === 0));
    }
    // every10
    return new Set(terms.filter((_, i) => i % 10 === 0));
  }, [terms, displayMode]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.15, Math.min(3, prev + delta)));
  };

  const getTermIndex = (value: number): number | null => {
    if (dNum === 0) {
      return value === aNum ? 1 : null;
    }

    const index = (value - aNum) / dNum + 1;
    if (index >= 1 && Number.isInteger(index) && index <= nNum) {
      return index;
    }
    return null;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX + (containerRef.current?.scrollLeft || 0));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const newScrollLeft = dragStart - e.clientX;
    containerRef.current.scrollLeft = newScrollLeft;
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const baseWidth = displayMode === "all" ? 60 : 40;

  return (
    <VisualizerLayout title="Arithmetic Progression">
      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="a">First term (a)</Label>
          <Input
            id="a"
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="d">Common difference (d)</Label>
          <Input
            id="d"
            type="number"
            value={d}
            onChange={(e) => setD(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="n">Number of terms (n)</Label>
          <Input
            id="n"
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8 flex gap-12">
        <div>
          <p className="text-sm text-muted-foreground">nth term</p>
          <p className="text-3xl font-light text-foreground">{nthTerm.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sum of series</p>
          <p className="text-3xl font-light text-foreground">{sum.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setZoom((prev) => Math.max(0.15, prev - 0.15))}
            className="h-8 w-8 border border-border text-foreground transition-colors hover:border-foreground"
          >
            −
          </button>
          <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((prev) => Math.min(3, prev + 0.15))}
            className="h-8 w-8 border border-border text-foreground transition-colors hover:border-foreground"
          >
            +
          </button>
          <span className="ml-4 text-xs text-muted-foreground">
            {displayMode === "all" && "Showing all numbers"}
            {displayMode === "terms" && "Showing terms only"}
            {displayMode === "every6" && "Showing every 6th term"}
            {displayMode === "every10" && "Showing every 10th term"}
          </span>
        </div>
        {hoveredTerm && (
          <p className="text-sm text-accent">
            {hoveredTerm.index === 1 ? "1st" : hoveredTerm.index === 2 ? "2nd" : hoveredTerm.index === 3 ? "3rd" : `${hoveredTerm.index}th`} term
          </p>
        )}
      </div>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`relative h-[40vh] overflow-x-auto overflow-y-hidden border border-border ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ userSelect: "none" }}
      >
        <div
          className="flex h-full items-center"
          style={{
            minWidth: `${numberLine.length * baseWidth * zoom}px`,
            padding: "0 40px",
          }}
        >
          {/* Number line axis */}
          <div
            className="absolute left-0 right-0 h-px bg-border"
            style={{ top: "50%" }}
          />

          {/* Numbers */}
          {numberLine.map((num) => {
            const isTerm = termSet.has(num);
            const isVisible = visibleTerms.has(num);
            const termIndex = isTerm ? getTermIndex(num) : null;
            const showLabel = displayMode === "all" || isVisible;

            return (
              <div
                key={num}
                className="relative flex flex-col items-center"
                style={{ width: `${baseWidth * zoom}px`, flexShrink: 0 }}
              >
                {/* Tick mark */}
                {(displayMode === "all" || isVisible) && (
                  <div
                    className={`absolute h-3 w-px ${isTerm && isVisible ? "bg-accent" : "bg-border"}`}
                    style={{ top: "calc(50% - 6px)" }}
                  />
                )}

                {/* Dot for visible terms */}
                {isVisible && isTerm && (
                  <div
                    className="absolute h-3 w-3 cursor-pointer bg-accent transition-transform hover:scale-150"
                    style={{ top: "calc(50% - 6px)" }}
                    onMouseEnter={() => setHoveredTerm({ value: num, index: termIndex! })}
                    onMouseLeave={() => setHoveredTerm(null)}
                  />
                )}

                {/* Number label */}
                {showLabel && (
                  <span
                    className={`absolute text-xs ${isTerm && isVisible ? "font-medium text-accent" : "text-muted-foreground"}`}
                    style={{ top: "calc(50% + 12px)" }}
                  >
                    {num}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Section */}
      <div className="mt-8 space-y-6 border-t border-border pt-8">
        <h3 className="text-sm font-medium text-muted-foreground">Formula</h3>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* nth Term Formula */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">nth Term</p>
            <div className="text-foreground">
              <Tex>{"a_n = a + (n-1) \\cdot d"}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`a_{${nNum}} = ${aNum} + (${nNum}-1) \\cdot ${dNum}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`a_{${nNum}} = ${aNum} + ${nNum - 1} \\cdot ${dNum}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`a_{${nNum}} = ${nthTerm}`}</Tex>
            </div>
          </div>

          {/* Sum Formula */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Sum of Series</p>
            <div className="text-foreground">
              <Tex>{"S_n = n \\cdot a + d \\cdot \\frac{n(n-1)}{2}"}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`S_{${nNum}} = ${nNum} \\cdot ${aNum} + ${dNum} \\cdot \\frac{${nNum}(${nNum}-1)}{2}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`S_{${nNum}} = ${nNum * aNum} + ${dNum} \\cdot \\frac{${nNum * (nNum - 1)}}{2}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`S_{${nNum}} = ${nNum * aNum} + ${dNum * (nNum * (nNum - 1)) / 2}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`S_{${nNum}} = ${sum.toLocaleString()}`}</Tex>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-8 space-y-4 text-sm text-muted-foreground border-t border-border pt-8">
        <p>
          Arithmetic progressions to me are the simplest and most abundant use of algebra in daily life. Say you&apos;re driving out of town, and you enter the highway at the 12th kilometre mark right at a gas station, and there&apos;s a gas station every 20 kilometres, how many gas stations will you have crossed right before 100-kilometre mark? You can use this tool to visualise this and other such progressions.
        </p>
        <p>
          Odd numbers on the number line are also arithmetic progressions, as are multiples of any number. The formulas listed above are the textbook way of doing this, but you could also achieve this through a number of other ways, given how fundamental they are to our understanding of the number line.
        </p>
        <p>
          The answer is <strong className="text-foreground">92</strong>, by the way.
        </p>
      </div>
    </VisualizerLayout>
  );
}
