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

// Factorial function
function factorial(n: number): bigint {
  if (n <= 1) return 1n;
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }
  return result;
}

// Binomial coefficient: C(n, k) = n! / (k! * (n-k)!)
function binomial(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  if (k === 0 || k === n) return 1n;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

// Generate all combinations of choosing k items from n (1-indexed)
function generateCombinations(n: number, k: number): number[][] {
  if (k < 0 || k > n || n <= 0) return [];
  if (k === 0) return [[]];

  const result: number[][] = [];

  function backtrack(start: number, current: number[]) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i <= n - (k - current.length) + 1; i++) {
      current.push(i);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(1, []);
  return result;
}

export default function Probabilitree() {
  // Input state
  const [totalObjects, setTotalObjects] = useState<string>("20");
  const [purpleObjects, setPurpleObjects] = useState<string>("8");
  const [objectsToPick, setObjectsToPick] = useState<string>("5");
  const [desiredPurple, setDesiredPurple] = useState<string>("2");

  // Hover state
  const [hoveredPurpleCombo, setHoveredPurpleCombo] = useState<number[] | null>(null);
  const [hoveredGreyCombo, setHoveredGreyCombo] = useState<number[] | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [greyTooltipPos, setGreyTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Parsed values
  const N = Math.max(0, parseInt(totalObjects) || 0);  // Total objects in pool
  const K = Math.max(0, Math.min(parseInt(purpleObjects) || 0, N));  // Purple objects in pool
  const n = Math.max(0, Math.min(parseInt(objectsToPick) || 0, N));  // Objects to pick
  const p = Math.max(0, Math.min(parseInt(desiredPurple) || 0, Math.min(K, n)));  // Desired purple

  // Validation
  const isValid = N > 0 && K >= 0 && K <= N && n > 0 && n <= N && p >= 0 && p <= K && p <= n && (n - p) <= (N - K);

  // Calculate probability
  const { favorable, total, probability, purpleWays, greyWays } = useMemo(() => {
    if (!isValid) {
      return { favorable: 0n, total: 1n, probability: 0, purpleWays: 0n, greyWays: 0n };
    }

    const purpleWays = binomial(K, p);
    const greyWays = binomial(N - K, n - p);
    const favorable = purpleWays * greyWays;
    const total = binomial(N, n);
    const probability = total > 0n ? Number(favorable) / Number(total) : 0;

    return { favorable, total, probability, purpleWays, greyWays };
  }, [N, K, n, p, isValid]);

  // Generate combinations for display (limited)
  const maxDisplayCombos = 15;

  const purpleCombos = useMemo(() => {
    if (!isValid || K > 25 || p > 10) return [];
    return generateCombinations(K, p).slice(0, maxDisplayCombos);
  }, [K, p, isValid]);

  const greyCombos = useMemo(() => {
    if (!isValid || (N - K) > 25 || (n - p) > 10) return [];
    return generateCombinations(N - K, n - p).slice(0, maxDisplayCombos);
  }, [N, K, n, p, isValid]);

  // Total outcomes for depth visualization
  const allCombos = useMemo(() => {
    if (!isValid || N > 20 || n > 8) return [];
    return generateCombinations(N, n);
  }, [N, n, isValid]);

  // Determine which combinations are "favorable" for highlighting
  const favorableCombosSet = useMemo(() => {
    if (!isValid || allCombos.length === 0) return new Set<string>();

    const favorable = new Set<string>();
    // A combination is favorable if it contains exactly p purple objects (numbered 1 to K)
    allCombos.forEach(combo => {
      const purpleCount = combo.filter(x => x <= K).length;
      if (purpleCount === p) {
        favorable.add(combo.join(","));
      }
    });
    return favorable;
  }, [allCombos, K, p, isValid]);

  // Layer distribution for depth effect
  const layers = useMemo(() => {
    if (allCombos.length === 0) return [];

    const numLayers = 5;
    const combosPerLayer = Math.ceil(allCombos.length / numLayers);

    // Sort so favorable combos are more likely to be in front
    const sorted = [...allCombos].sort((a, b) => {
      const aFav = favorableCombosSet.has(a.join(",")) ? 0 : 1;
      const bFav = favorableCombosSet.has(b.join(",")) ? 0 : 1;
      return aFav - bFav;
    });

    return Array.from({ length: numLayers }, (_, layerIndex) => {
      const start = layerIndex * combosPerLayer;
      const end = Math.min(start + combosPerLayer, sorted.length);
      return {
        combos: sorted.slice(start, end),
        depth: layerIndex,
        blur: layerIndex * 2,
        opacity: 1 - (layerIndex * 0.18),
        scale: 1 - (layerIndex * 0.1),
      };
    }).filter(layer => layer.combos.length > 0);
  }, [allCombos, favorableCombosSet]);

  const showDepthViz = allCombos.length > 0 && allCombos.length <= 200;

  // Calculate connections count (handshakes) for a combo
  const getConnectionsCount = (combo: number[]) => {
    if (combo.length < 2) return 0;
    return (combo.length * (combo.length - 1)) / 2;
  };

  return (
    <VisualizerLayout title="Probabilitree">
      {/* Input Section */}
      <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="totalObjects">Total objects (N)</Label>
          <Input
            id="totalObjects"
            type="number"
            min="1"
            max="100"
            value={totalObjects}
            onChange={(e) => setTotalObjects(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purpleObjects">Purple objects (K)</Label>
          <Input
            id="purpleObjects"
            type="number"
            min="0"
            max={N}
            value={purpleObjects}
            onChange={(e) => setPurpleObjects(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objectsToPick">Objects to pick (n)</Label>
          <Input
            id="objectsToPick"
            type="number"
            min="1"
            max={N}
            value={objectsToPick}
            onChange={(e) => setObjectsToPick(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desiredPurple">Desired purple (p)</Label>
          <Input
            id="desiredPurple"
            type="number"
            min="0"
            max={Math.min(K, n)}
            value={desiredPurple}
            onChange={(e) => setDesiredPurple(e.target.value)}
          />
        </div>
      </div>

      {/* Metrics Display */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">
          Probability of getting exactly {p} purple when picking {n} from {N} objects ({K} purple, {N - K} grey)
        </p>
        <p className="text-3xl font-light text-accent">{(probability * 100).toFixed(4)}%</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {favorable.toString()} favorable out of {total.toString()} total outcomes
        </p>
      </div>

      {/* Object Pool Visualizer */}
      <div className="mb-8 border border-border p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">Object Pool</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: Math.min(N, 25) }).map((_, i) => {
            const displayN = Math.min(N, 25);
            const scaledK = N <= 25 ? K : Math.round((K / N) * 25);
            const isPurple = i < scaledK;
            const label = isPurple ? i + 1 : i - scaledK + 1;
            const isHighlightedPurple = isPurple && hoveredPurpleCombo?.includes(i + 1);
            const isHighlightedGrey = !isPurple && hoveredGreyCombo?.includes(i - scaledK + 1);

            return (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center text-xs font-medium transition-all duration-150
                  ${isPurple
                    ? isHighlightedPurple
                      ? "bg-accent text-background ring-2 ring-accent ring-offset-2 ring-offset-background"
                      : "bg-accent/70 text-background"
                    : isHighlightedGrey
                      ? "bg-neutral-400 text-background ring-2 ring-neutral-400 ring-offset-2 ring-offset-background"
                      : "bg-neutral-600 text-neutral-200"
                  }`}
              >
                {label}
              </div>
            );
          })}
        </div>
        {N > 25 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Showing 25 of {N} objects (proportionally scaled)
          </p>
        )}
        <div className="mt-4 flex gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent" />
            <span className="text-muted-foreground">Purple: {K}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-neutral-600" />
            <span className="text-muted-foreground">Grey: {N - K}</span>
          </div>
        </div>
      </div>

      {/* Combinations Breakdown - Circle Visualization */}
      <div className="mb-8 border border-border p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
          Combinations Breakdown
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Purple circle */}
          <div>
            <p className="text-sm text-accent mb-2">
              Choose {p} purple from {K}
            </p>
            <p className="text-2xl font-light text-accent mb-4">
              C({K}, {p}) = {purpleWays.toString()}
            </p>
            {p === 0 ? (
              <div className="space-y-1">
                <div className="flex gap-1 p-1 bg-accent/10">
                  <span className="text-xs text-muted-foreground italic">{ } (empty set)</span>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  There is exactly 1 way to choose nothing
                </p>
              </div>
            ) : K > 0 && K <= 20 ? (
              <div className="relative">
                <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto">
                  {/* Lines connecting hovered combo */}
                  {hoveredPurpleCombo && hoveredPurpleCombo.length >= 2 && (
                    <>
                      {hoveredPurpleCombo.map((num1, i) =>
                        hoveredPurpleCombo.slice(i + 1).map((num2, j) => {
                          const angle1 = ((num1 - 1) / K) * 2 * Math.PI - Math.PI / 2;
                          const angle2 = ((num2 - 1) / K) * 2 * Math.PI - Math.PI / 2;
                          const x1 = 100 + 70 * Math.cos(angle1);
                          const y1 = 100 + 70 * Math.sin(angle1);
                          const x2 = 100 + 70 * Math.cos(angle2);
                          const y2 = 100 + 70 * Math.sin(angle2);
                          return (
                            <line
                              key={`${num1}-${num2}`}
                              x1={x1}
                              y1={y1}
                              x2={x2}
                              y2={y2}
                              stroke="#a78bfa"
                              strokeWidth="2"
                              strokeOpacity="0.8"
                            />
                          );
                        })
                      )}
                    </>
                  )}
                  {/* Nodes in a circle */}
                  {Array.from({ length: K }, (_, i) => {
                    const angle = (i / K) * 2 * Math.PI - Math.PI / 2;
                    const x = 100 + 70 * Math.cos(angle);
                    const y = 100 + 70 * Math.sin(angle);
                    const isSelected = hoveredPurpleCombo?.includes(i + 1);
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? 14 : 12}
                          fill={isSelected ? "#a78bfa" : "rgba(167, 139, 250, 0.5)"}
                          className="transition-all duration-150"
                        />
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={isSelected ? "#000" : "#fff"}
                          fontSize="10"
                          fontWeight={isSelected ? "bold" : "normal"}
                        >
                          {i + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                {/* Combo selector */}
                <div className="mt-4 flex flex-wrap gap-1 max-h-32 overflow-y-auto relative">
                  {purpleCombos.map((combo, i) => (
                    <button
                      key={i}
                      className={`px-2 py-1 text-xs border transition-colors ${
                        hoveredPurpleCombo?.join(",") === combo.join(",")
                          ? "border-accent bg-accent/20 text-accent"
                          : "border-border text-muted-foreground hover:border-accent/50"
                      }`}
                      onMouseEnter={(e) => {
                        setHoveredPurpleCombo(combo);
                        const rect = e.currentTarget.getBoundingClientRect();
                        const containerRect = e.currentTarget.parentElement?.getBoundingClientRect();
                        if (containerRect) {
                          setTooltipPos({
                            x: rect.left - containerRect.left + rect.width / 2,
                            y: rect.top - containerRect.top - 8
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredPurpleCombo(null);
                        setTooltipPos(null);
                      }}
                    >
                      {combo.join(",")}
                    </button>
                  ))}
                  {Number(purpleWays) > maxDisplayCombos && (
                    <span className="px-2 py-1 text-xs text-muted-foreground">
                      +{Number(purpleWays) - maxDisplayCombos} more
                    </span>
                  )}
                  {/* Tooltip */}
                  {hoveredPurpleCombo && tooltipPos && getConnectionsCount(hoveredPurpleCombo) > 0 && (
                    <div
                      className="absolute z-20 bg-background border border-accent px-2 py-1 pointer-events-none whitespace-nowrap"
                      style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y,
                        transform: "translate(-50%, -100%)"
                      }}
                    >
                      <p className="text-xs text-accent">
                        {getConnectionsCount(hoveredPurpleCombo)} connection{getConnectionsCount(hoveredPurpleCombo) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {K > 20 ? "Too many objects for circle display" : ""}
              </p>
            )}
          </div>

          {/* Grey combinations - compact rows */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Choose {n - p} grey from {N - K}
            </p>
            <p className="text-2xl font-light text-foreground mb-4">
              C({N - K}, {n - p}) = {greyWays.toString()}
            </p>
            {(n - p) === 0 ? (
              <div className="space-y-1">
                <div className="flex gap-1 p-1 bg-neutral-800/50">
                  <span className="text-xs text-muted-foreground italic">{ } (empty set)</span>
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  There is exactly 1 way to choose nothing
                </p>
              </div>
            ) : greyCombos.length > 0 ? (
              <div className="space-y-0.5 max-h-52 overflow-y-auto relative">
                {greyCombos.map((combo, i) => (
                  <div
                    key={i}
                    className={`flex gap-0.5 p-0.5 cursor-pointer transition-colors ${
                      hoveredGreyCombo?.join(",") === combo.join(",")
                        ? "bg-neutral-700"
                        : "hover:bg-neutral-800"
                    }`}
                    onMouseEnter={(e) => {
                      setHoveredGreyCombo(combo);
                      const rect = e.currentTarget.getBoundingClientRect();
                      const containerRect = e.currentTarget.parentElement?.getBoundingClientRect();
                      if (containerRect) {
                        setGreyTooltipPos({
                          x: rect.right - containerRect.left + 8,
                          y: rect.top - containerRect.top + rect.height / 2
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredGreyCombo(null);
                      setGreyTooltipPos(null);
                    }}
                  >
                    {combo.map((num, j) => (
                      <span
                        key={j}
                        className="w-5 h-5 bg-neutral-600 text-neutral-200 flex items-center justify-center text-[10px]"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                ))}
                {Number(greyWays) > maxDisplayCombos && (
                  <p className="text-xs text-muted-foreground pt-1">
                    ... and {Number(greyWays) - maxDisplayCombos} more
                  </p>
                )}
                {/* Grey Tooltip */}
                {hoveredGreyCombo && greyTooltipPos && getConnectionsCount(hoveredGreyCombo) > 0 && (
                  <div
                    className="absolute z-20 bg-background border border-neutral-500 px-2 py-1 pointer-events-none whitespace-nowrap"
                    style={{
                      left: greyTooltipPos.x,
                      top: greyTooltipPos.y,
                      transform: "translateY(-50%)"
                    }}
                  >
                    <p className="text-xs text-neutral-300">
                      {getConnectionsCount(hoveredGreyCombo)} connection{getConnectionsCount(hoveredGreyCombo) !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {(N - K) > 25 ? "Too many to display individually" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Favorable outcomes summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Favorable outcomes = {purpleWays.toString()} × {greyWays.toString()} =
            <span className="text-accent font-medium ml-2">
              {favorable.toString()}
            </span>
          </p>
        </div>
      </div>

      {/* Total Outcomes Depth Visualizer */}
      {showDepthViz && (
        <div className="mb-8 border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
            Total Outcome Space — {allCombos.length} ways to pick {n} from {N}
          </p>

          <div
            className="relative overflow-hidden"
            style={{
              perspective: "1000px",
              perspectiveOrigin: "center center",
              height: "280px"
            }}
          >
            {layers.map((layer, layerIndex) => (
              <div
                key={layerIndex}
                className="absolute inset-0 flex flex-wrap gap-1 p-2 justify-center content-start"
                style={{
                  filter: `blur(${layer.blur}px)`,
                  opacity: layer.opacity,
                  transform: `translateZ(${-layerIndex * 60}px) scale(${layer.scale})`,
                  zIndex: 5 - layerIndex,
                }}
              >
                {layer.combos.map((combo, i) => {
                  const isFavorable = favorableCombosSet.has(combo.join(","));

                  return (
                    <div
                      key={i}
                      className={`flex gap-0.5 p-1 ${
                        isFavorable && layerIndex === 0
                          ? "bg-accent/20 ring-1 ring-accent"
                          : ""
                      }`}
                    >
                      {combo.map((num, j) => {
                        const isPurple = num <= K;
                        return (
                          <span
                            key={j}
                            className={`w-5 h-5 flex items-center justify-center text-[9px] ${
                              isPurple
                                ? "bg-accent text-background"
                                : "bg-neutral-600 text-neutral-200"
                            }`}
                          >
                            {num}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Gradient overlay to enhance depth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent 0%, transparent 50%, hsl(var(--background)) 100%)"
              }}
            />
          </div>

          {/* Legend */}
          <div className="mt-4 flex justify-between text-xs">
            <div>
              <span className="text-muted-foreground">Favorable (highlighted): </span>
              <span className="text-accent font-medium">{favorable.toString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total: </span>
              <span className="text-foreground">{total.toString()}</span>
            </div>
          </div>
        </div>
      )}

      {!showDepthViz && (
        <div className="mb-8 border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
            Total Outcome Space
          </p>
          <p className="text-sm text-muted-foreground">
            With {N} objects and picking {n}, there are <span className="text-foreground font-medium">{total.toString()}</span> possible outcomes.
            {Number(total) > 200 && " (Too many to visualize individually)"}
          </p>
        </div>
      )}

      {/* Formula Section */}
      <div className="mt-8 space-y-6 border-t border-border pt-8">
        <h3 className="text-sm font-medium text-muted-foreground">Formula</h3>

        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Step 1: Ways to choose purple</p>
            <div className="text-foreground">
              <Tex>{`C(K, p) = \\frac{K!}{p! \\cdot (K-p)!}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`C(${K}, ${p}) = \\frac{${K}!}{${p}! \\cdot ${K - p}!}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`C(${K}, ${p}) = ${purpleWays.toString()}`}</Tex>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Step 2: Ways to choose grey</p>
            <div className="text-foreground">
              <Tex>{`C(N-K, n-p) = \\frac{(N-K)!}{(n-p)! \\cdot ((N-K)-(n-p))!}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`C(${N - K}, ${n - p}) = \\frac{${N - K}!}{${n - p}! \\cdot ${(N - K) - (n - p)}!}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`C(${N - K}, ${n - p}) = ${greyWays.toString()}`}</Tex>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Step 3: Favorable outcomes</p>
            <div className="text-foreground">
              <Tex>{`\\text{Favorable} = C(K, p) \\times C(N-K, n-p)`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`\\text{Favorable} = ${purpleWays.toString()} \\times ${greyWays.toString()}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`\\text{Favorable} = ${favorable.toString()}`}</Tex>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Step 4: Total outcomes</p>
            <div className="text-foreground">
              <Tex>{`\\text{Total} = C(N, n) = \\frac{N!}{n! \\cdot (N-n)!}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`\\text{Total} = C(${N}, ${n}) = \\frac{${N}!}{${n}! \\cdot ${N - n}!}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`\\text{Total} = ${total.toString()}`}</Tex>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Step 5: Probability</p>
            <div className="text-foreground">
              <Tex>{`P = \\frac{\\text{Favorable}}{\\text{Total}}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`P = \\frac{${favorable.toString()}}{${total.toString()}}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`P = ${probability.toFixed(6)} = ${(probability * 100).toFixed(4)}\\%`}</Tex>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="mt-8 space-y-4 text-sm text-muted-foreground border-t border-border pt-8">
        <p>
          Probability is at its heart a ratio of desired outcomes to all possible outcomes. This tool helps you visualise just that. Say you had a pool of objects — some grey, some purple — and you were to randomly draw {n} objects from it wanting exactly {p} purple, you should be able to see above all the scenarios in which your selections could play out.
        </p>
        <p>
          Probability is best understood through the lens of <strong className="text-foreground">combinatorics</strong> — a branch of maths that has to do with permutations and combinations — because this way you account for every possible scenario (both desired and total).
        </p>
        <p>
          Personally, I understood this first through the famous <a href="https://www.ucd.ie/mathstat/t4media/1.%20The%20handshake%20puzzle.pdf" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent/80">handshake problem</a>, which asks: how many handshakes are possible among a group of n persons where no two persons shake hands with each other more than once? This is the basis for &quot;selections&quot;. That's part of the reason why I've visualised selecting the purple objects by arranging them in a circle. It's akin to asking - how many connections exist between any <i>n</i> points in the circle.
        </p>
      </div>
    </VisualizerLayout>
  );
}
