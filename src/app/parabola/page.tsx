"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { VisualizerLayout } from "@/components/visualizer-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import katex from "katex";
import "katex/dist/katex.min.css";

function Tex({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        displayMode: false,
        throwOnError: false,
      });
    }
  }, [children]);

  return <span ref={ref} />;
}

// Format coefficient for display (hide 1, show -1 as -)
function formatCoeff(coeff: number, isFirst: boolean = false): string {
  if (coeff === 1) return isFirst ? "" : "+";
  if (coeff === -1) return "-";
  if (coeff >= 0 && !isFirst) return `+${coeff}`;
  return `${coeff}`;
}

export default function Parabola() {
  const [a, setA] = useState<string>("-1");
  const [b, setB] = useState<string>("4");
  const [c, setC] = useState<string>("15");
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const aNum = parseFloat(a) || 0;
  const bNum = parseFloat(b) || 0;
  const cNum = parseFloat(c) || 0;

  // Calculate vertex using -b/2a
  const vertex = useMemo(() => {
    if (aNum === 0) return { x: 0, y: cNum };
    const x = -bNum / (2 * aNum);
    const y = aNum * x * x + bNum * x + cNum;
    return { x, y };
  }, [aNum, bNum, cNum]);

  // Determine if it's a min or max
  const isMaximum = aNum < 0;

  // Generate 1000 data points for the table
  const tableData = useMemo(() => {
    const data: { x: number; y: number }[] = [];
    const range = 100; // Wider range for table
    const xStart = vertex.x - range;
    const step = (range * 2) / 999; // 1000 points

    for (let i = 0; i < 1000; i++) {
      const x = xStart + i * step;
      const y = aNum * x * x + bNum * x + cNum;
      data.push({ x, y });
    }
    return data;
  }, [aNum, bNum, cNum, vertex]);

  // Find vertex from table (min or max y value)
  const tableVertex = useMemo(() => {
    if (tableData.length === 0) return { x: 0, y: 0, index: 0 };

    let extremeIndex = 0;
    let extremeY = tableData[0].y;

    for (let i = 1; i < tableData.length; i++) {
      if (isMaximum) {
        // Looking for maximum
        if (tableData[i].y > extremeY) {
          extremeY = tableData[i].y;
          extremeIndex = i;
        }
      } else {
        // Looking for minimum
        if (tableData[i].y < extremeY) {
          extremeY = tableData[i].y;
          extremeIndex = i;
        }
      }
    }

    return {
      x: tableData[extremeIndex].x,
      y: tableData[extremeIndex].y,
      index: extremeIndex,
    };
  }, [tableData, isMaximum]);

  // Calculate roots using quadratic formula
  const computedRoots = useMemo(() => {
    if (aNum === 0) return { discriminant: 0, root1: null, root2: null, hasRoots: false };

    const discriminant = bNum * bNum - 4 * aNum * cNum;

    if (discriminant < 0) {
      return { discriminant, root1: null, root2: null, hasRoots: false };
    }

    const sqrtDisc = Math.sqrt(discriminant);
    const root1 = (-bNum + sqrtDisc) / (2 * aNum);
    const root2 = (-bNum - sqrtDisc) / (2 * aNum);

    return { discriminant, root1, root2, hasRoots: true };
  }, [aNum, bNum, cNum]);

  // Find roots from table (where y crosses zero or is closest to zero)
  const tableRoots = useMemo(() => {
    if (tableData.length === 0) return { root1: null, root2: null, root1Index: -1, root2Index: -1 };

    // Find sign changes (where y crosses zero)
    const crossings: { x: number; index: number }[] = [];

    for (let i = 1; i < tableData.length; i++) {
      const prevY = tableData[i - 1].y;
      const currY = tableData[i].y;

      // Check for sign change
      if ((prevY <= 0 && currY >= 0) || (prevY >= 0 && currY <= 0)) {
        // Linear interpolation to find approximate x where y = 0
        const t = Math.abs(prevY) / (Math.abs(prevY) + Math.abs(currY));
        const crossX = tableData[i - 1].x + t * (tableData[i].x - tableData[i - 1].x);
        crossings.push({ x: crossX, index: i });
      }
    }

    if (crossings.length === 0) {
      return { root1: null, root2: null, root1Index: -1, root2Index: -1 };
    }

    if (crossings.length === 1) {
      return { root1: crossings[0].x, root2: null, root1Index: crossings[0].index, root2Index: -1 };
    }

    // Return first two crossings (sorted by x value)
    const sorted = crossings.sort((a, b) => a.x - b.x);
    return {
      root1: sorted[0].x,
      root2: sorted[1]?.x ?? null,
      root1Index: sorted[0].index,
      root2Index: sorted[1]?.index ?? -1,
    };
  }, [tableData]);

  // Generate points for the parabola graph (fewer points for rendering)
  const { points, xMin, xMax, yMin, yMax } = useMemo(() => {
    const points: { x: number; y: number }[] = [];

    // Center the view around the vertex, zoom affects range
    const baseRange = 10;
    const range = baseRange / zoom;
    const xMin = vertex.x - range;
    const xMax = vertex.x + range;

    // Generate points
    const step = (xMax - xMin) / 200;
    for (let x = xMin; x <= xMax; x += step) {
      const y = aNum * x * x + bNum * x + cNum;
      points.push({ x, y });
    }

    // Calculate y bounds
    let minY = vertex.y;
    let maxY = vertex.y;
    for (const p of points) {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    // Add some padding
    const yPadding = (maxY - minY) * 0.1 || 10;

    return {
      points,
      xMin,
      xMax,
      yMin: minY - yPadding,
      yMax: maxY + yPadding,
    };
  }, [aNum, bNum, cNum, vertex, zoom]);

  // Convert data coordinates to SVG coordinates
  const toSvg = (x: number, y: number, width: number, height: number) => {
    const svgX = ((x - xMin) / (xMax - xMin)) * width;
    const svgY = height - ((y - yMin) / (yMax - yMin)) * height;
    return { x: svgX, y: svgY };
  };

  // Generate SVG path
  const pathData = useMemo(() => {
    const width = 800;
    const height = 400;

    if (points.length === 0) return "";

    const svgPoints = points.map((p) => toSvg(p.x, p.y, width, height));
    let d = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
    for (let i = 1; i < svgPoints.length; i++) {
      d += ` L ${svgPoints[i].x} ${svgPoints[i].y}`;
    }
    return d;
  }, [points, xMin, xMax, yMin, yMax]);

  // Vertex in SVG coordinates
  const vertexSvg = toSvg(vertex.x, vertex.y, 800, 400);

  // X-axis position in SVG
  const xAxisY = 400 - ((0 - yMin) / (yMax - yMin)) * 400;
  const showXAxis = yMin <= 0 && yMax >= 0;

  // Y-axis position in SVG
  const yAxisX = ((0 - xMin) / (xMax - xMin)) * 800;
  const showYAxis = xMin <= 0 && xMax >= 0;

  return (
    <VisualizerLayout title="Parabola Vertex Finder">
      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="a">x² coefficient (a)</Label>
          <Input
            id="a"
            type="number"
            step="0.1"
            value={a}
            onChange={(e) => setA(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="b">x coefficient (b)</Label>
          <Input
            id="b"
            type="number"
            step="0.1"
            value={b}
            onChange={(e) => setB(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c">constant (c)</Label>
          <Input
            id="c"
            type="number"
            step="0.1"
            value={c}
            onChange={(e) => setC(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-lg text-muted-foreground">
          <Tex>{`y = ${formatCoeff(aNum, true)}x^2 ${formatCoeff(bNum)}x ${cNum >= 0 ? "+" : ""}${cNum}`}</Tex>
        </p>
      </div>

      {/* Comparison: Formula vs Table */}
      <div className="mb-8 grid grid-cols-2 gap-8">
        {/* Calculated using -b/2a */}
        <div className="border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Calculated using -b/2a</p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">x value</p>
              <p className="text-2xl font-light text-accent">{vertex.x.toFixed(5)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{isMaximum ? "Maximum" : "Minimum"} y value</p>
              <p className="text-2xl font-light text-accent">{vertex.y.toFixed(5)}</p>
            </div>
          </div>
        </div>

        {/* Found from table */}
        <div className="border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{isMaximum ? "Maximum" : "Minimum"} from table (row {tableVertex.index + 1})</p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">x value</p>
              <p className="text-2xl font-light text-foreground">{tableVertex.x.toFixed(5)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{isMaximum ? "Maximum" : "Minimum"} y value</p>
              <p className="text-2xl font-light text-foreground">{tableVertex.y.toFixed(5)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Difference */}
      <div className="mb-8 text-xs text-muted-foreground">
        <p>Difference: x = {Math.abs(vertex.x - tableVertex.x).toExponential(2)}, y = {Math.abs(vertex.y - tableVertex.y).toExponential(2)}</p>
      </div>

      {/* Zoom controls */}
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => setZoom((prev) => Math.max(0.25, prev - 0.25))}
          className="h-8 w-8 border border-border text-foreground transition-colors hover:border-foreground"
        >
          −
        </button>
        <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((prev) => Math.min(4, prev + 0.25))}
          className="h-8 w-8 border border-border text-foreground transition-colors hover:border-foreground"
        >
          +
        </button>
        <span className="ml-4 text-xs text-muted-foreground">
          x range: [{xMin.toFixed(1)}, {xMax.toFixed(1)}]
        </span>
      </div>

      {/* Graph */}
      <div
        className="relative border border-border overflow-hidden"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = e.clientX - rect.left;
          const py = e.clientY - rect.top;
          setMousePos({ x: px, y: py });

          // Convert mouse position to data coordinates
          if (svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const relX = (px / svgRect.width) * 800;
            // Convert SVG x to data x
            const dataX = xMin + (relX / 800) * (xMax - xMin);
            const dataY = aNum * dataX * dataX + bNum * dataX + cNum;
            setHoverPoint({ x: dataX, y: dataY });
          }
        }}
        onMouseLeave={() => {
          setMousePos(null);
          setHoverPoint(null);
        }}
        onWheel={(e) => {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.25 : 0.25;
          setZoom((prev) => Math.max(0.25, Math.min(4, prev + delta)));
        }}
      >
        <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-auto">
          {/* X-axis */}
          {showXAxis && (
            <line
              x1="0"
              y1={xAxisY}
              x2="800"
              y2={xAxisY}
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          )}

          {/* Y-axis */}
          {showYAxis && (
            <line
              x1={yAxisX}
              y1="0"
              x2={yAxisX}
              y2="400"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          )}

          {/* Parabola */}
          <path
            d={pathData}
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2"
          />

          {/* Vertex point */}
          <circle
            cx={vertexSvg.x}
            cy={vertexSvg.y}
            r="6"
            fill="#a78bfa"
          />

          {/* Vertex horizontal line to y-axis */}
          {showYAxis && (
            <line
              x1={yAxisX}
              y1={vertexSvg.y}
              x2={vertexSvg.x}
              y2={vertexSvg.y}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="4"
            />
          )}

          {/* Vertex vertical line to x-axis */}
          {showXAxis && (
            <line
              x1={vertexSvg.x}
              y1={xAxisY}
              x2={vertexSvg.x}
              y2={vertexSvg.y}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="4"
            />
          )}

          {/* Hover point on parabola */}
          {hoverPoint && (() => {
            const hoverSvg = toSvg(hoverPoint.x, hoverPoint.y, 800, 400);
            // Only show if within visible y range
            if (hoverSvg.y >= 0 && hoverSvg.y <= 400) {
              return (
                <>
                  <circle
                    cx={hoverSvg.x}
                    cy={hoverSvg.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#a78bfa"
                    strokeWidth="2"
                  />
                  {/* Crosshairs */}
                  <line
                    x1={hoverSvg.x}
                    y1="0"
                    x2={hoverSvg.x}
                    y2="400"
                    stroke="#a78bfa"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    strokeDasharray="2"
                  />
                  <line
                    x1="0"
                    y1={hoverSvg.y}
                    x2="800"
                    y2={hoverSvg.y}
                    stroke="#a78bfa"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    strokeDasharray="2"
                  />
                </>
              );
            }
            return null;
          })()}
        </svg>

        {/* Tooltip */}
        {mousePos && hoverPoint && (
          <div
            className="pointer-events-none absolute z-10 border border-border bg-background px-2 py-1"
            style={{
              left: mousePos.x + 12,
              top: mousePos.y + 12,
            }}
          >
            <p className="text-xs text-accent">x: {hoverPoint.x.toFixed(4)}</p>
            <p className="text-xs text-accent">y: {hoverPoint.y.toFixed(4)}</p>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-4 right-4 flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-0.5" style={{ backgroundColor: "#a78bfa" }} />
            Parabola
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-0.5" style={{ backgroundColor: "#ef4444" }} />
            Vertex
          </div>
        </div>
      </div>

      {/* Formula Section */}
      <div className="mt-8 space-y-6 border-t border-border pt-8">
        <h3 className="text-sm font-medium text-muted-foreground">Formula</h3>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Vertex x-value */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Vertex x-value</p>
            <div className="text-foreground">
              <Tex>{"x = \\frac{-b}{2a}"}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`x = \\frac{-${bNum >= 0 ? `(${bNum})` : `(${bNum})`}}{2 \\cdot ${aNum >= 0 ? `(${aNum})` : `(${aNum})`}}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`x = \\frac{${-bNum}}{${2 * aNum}}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`x = ${vertex.x.toFixed(5)}`}</Tex>
            </div>
          </div>

          {/* Vertex y-value */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Vertex y-value ({isMaximum ? "Maximum" : "Minimum"})</p>
            <div className="text-foreground">
              <Tex>{"y = ax^2 + bx + c"}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`y = ${aNum}(${vertex.x.toFixed(2)})^2 ${bNum >= 0 ? "+" : ""}${bNum}(${vertex.x.toFixed(2)}) ${cNum >= 0 ? "+" : ""}${cNum}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`y = ${vertex.y.toFixed(5)}`}</Tex>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="mt-8 space-y-4 text-sm text-muted-foreground border-t border-border pt-8">
        <p>
          A parabola is a curve that results from plotting a quadratic equation on the x-y plane. It shows how the value of &quot;y&quot; (vertical movement) corresponds to a certain value of x when plugged into the quadratic equation.
        </p>
        <p>
          Any quadratic equation is in the form of ax²+bx+c and when a is less than 0 (i.e. negative) you get a parabola that opens downwards, this is because no matter how large the value of x, the negative sign in front of x² results in a negative number almost every time. The only instances where it will result in a positive number is when bx and c together &quot;cancel out&quot; or are greater than -ax².
        </p>
        <p>
          The part where the parabola makes a &quot;U-turn&quot; is called the vertex. This is either the maximum or the minimum value of y. This means the vertical movement of this point is &apos;capped&apos; by the equation. And conversely, when a is positive you have a parabola that opens upward.
        </p>
        <p>
          In fact you can see above the visualiser the precise point at which the bx and c terms &quot;cancel out&quot; the ax² term resulting in a zero. This value of x can also be worked out by factorising the equation.
        </p>
        <p className="border-t border-border pt-4 mt-4">
          This calculator shows you both the &quot;brute forced&quot; vertex - it generates a table of 1000 possible values of x greater and lesser than the one you enter, and shows you exactly at what value of x it was that y hit the vertex. This can also be found mathematically using -b/2a and we compare the difference.
        </p>
      </div>

      {/* Data Table */}
      <div className="mt-8 space-y-4 border-t border-border pt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Data Table (1000 points)</h3>
          <p className="text-xs text-muted-foreground">x range: {tableData[0]?.x.toFixed(2)} to {tableData[tableData.length - 1]?.x.toFixed(2)}</p>
        </div>

        <div className="h-[400px] overflow-auto border border-border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-background border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-muted-foreground font-medium w-16">#</th>
                <th className="px-3 py-2 text-right text-muted-foreground font-medium">x value</th>
                <th className="px-3 py-2 text-right text-muted-foreground font-medium">y value</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {tableData.map((point, i) => {
                const isTableVertex = i === tableVertex.index;
                return (
                  <tr
                    key={i}
                    className={isTableVertex ? "bg-accent/20" : i % 2 === 0 ? "bg-muted/30" : ""}
                  >
                    <td className="px-3 py-1 text-muted-foreground">{i + 1}</td>
                    <td className={`px-3 py-1 text-right ${isTableVertex ? "text-accent font-medium" : ""}`}>
                      {point.x.toFixed(5)}
                    </td>
                    <td className={`px-3 py-1 text-right ${isTableVertex ? "text-accent font-medium" : ""}`}>
                      {point.y.toFixed(5)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appendix: Roots Comparison */}
      <div className="mt-8 space-y-6 border-t border-border pt-8">
        <h3 className="text-sm font-medium text-muted-foreground">Appendix: Roots (where y = 0)</h3>

        <div className="grid grid-cols-2 gap-8">
          {/* Computed using quadratic formula */}
          <div className="border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Computed using quadratic formula</p>
            <div className="mb-4 text-muted-foreground">
              <Tex>{`x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`}</Tex>
            </div>
            {computedRoots.hasRoots ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Discriminant (b² - 4ac)</p>
                  <p className="text-lg font-light">{computedRoots.discriminant.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Root 1 (x₁)</p>
                  <p className="text-2xl font-light text-accent">{computedRoots.root1?.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Root 2 (x₂)</p>
                  <p className="text-2xl font-light text-accent">{computedRoots.root2?.toFixed(5)}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No real roots (discriminant = {computedRoots.discriminant.toFixed(2)} &lt; 0)
              </p>
            )}
          </div>

          {/* Found from table */}
          <div className="border border-border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Found from table (where y crosses 0)</p>
            {tableRoots.root1 !== null ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Root 1 (x₁) - near row {tableRoots.root1Index}</p>
                  <p className="text-2xl font-light text-foreground">{tableRoots.root1.toFixed(5)}</p>
                </div>
                {tableRoots.root2 !== null && (
                  <div>
                    <p className="text-xs text-muted-foreground">Root 2 (x₂) - near row {tableRoots.root2Index}</p>
                    <p className="text-2xl font-light text-foreground">{tableRoots.root2.toFixed(5)}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No zero crossings found in table range
              </p>
            )}
          </div>
        </div>

        {/* Difference comparison */}
        {computedRoots.hasRoots && tableRoots.root1 !== null && (
          <div className="text-xs text-muted-foreground">
            <p>
              Difference: x₁ = {Math.abs((computedRoots.root1 ?? 0) - tableRoots.root1).toExponential(2)}
              {tableRoots.root2 !== null && computedRoots.root2 !== null && (
                <>, x₂ = {Math.abs(computedRoots.root2 - tableRoots.root2).toExponential(2)}</>
              )}
            </p>
          </div>
        )}

        {/* Formula breakdown */}
        {computedRoots.hasRoots && (
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Formula breakdown</p>
            <div className="text-muted-foreground">
              <Tex>{`x = \\frac{-(${bNum}) \\pm \\sqrt{(${bNum})^2 - 4(${aNum})(${cNum})}}{2(${aNum})}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`x = \\frac{${-bNum} \\pm \\sqrt{${bNum * bNum} - ${4 * aNum * cNum}}}{${2 * aNum}}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`x = \\frac{${-bNum} \\pm \\sqrt{${computedRoots.discriminant}}}{${2 * aNum}}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`x = \\frac{${-bNum} \\pm ${Math.sqrt(computedRoots.discriminant).toFixed(5)}}{${2 * aNum}}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`x_1 = ${computedRoots.root1?.toFixed(5)}, \\quad x_2 = ${computedRoots.root2?.toFixed(5)}`}</Tex>
            </div>
          </div>
        )}
      </div>
    </VisualizerLayout>
  );
}
