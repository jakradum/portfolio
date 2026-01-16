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

// Binomial coefficient: n! / (k! * (n-k)!)
function binomial(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

// Coin component
function Coin({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
    >
      <circle cx="12" cy="12" r="11" fill={color} />
      <circle cx="12" cy="12" r="8" fill="none" stroke={color === "#a78bfa" ? "#8b5cf6" : "#4a4a4a"} strokeWidth="1" />
      <circle cx="12" cy="12" r="4" fill={color === "#a78bfa" ? "#8b5cf6" : "#4a4a4a"} opacity="0.3" />
    </svg>
  );
}

export default function CoinToss() {
  const [trials, setTrials] = useState<string>("20");
  const [headsPercent, setHeadsPercent] = useState<string>("20");
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const trialsNum = parseInt(trials) || 0;
  const headsPercentNum = parseFloat(headsPercent) || 0;

  // Calculate desired number of heads from percentage
  const desiredHeads = useMemo(() => {
    return Math.round((headsPercentNum / 100) * trialsNum);
  }, [trialsNum, headsPercentNum]);

  // Calculate probability
  const { probability, binomialCoeff, totalOutcomes } = useMemo(() => {
    if (trialsNum <= 0 || desiredHeads < 0 || desiredHeads > trialsNum) {
      return { probability: 0, binomialCoeff: 0n, totalOutcomes: 1n };
    }

    // Binomial coefficient: n! / (k! * (n-k)!)
    const binomialCoeff = binomial(trialsNum, desiredHeads);

    // Total outcomes: 2^n
    const totalOutcomes = 2n ** BigInt(trialsNum);

    // Probability = binomialCoeff / totalOutcomes
    const probability = Number(binomialCoeff) / Number(totalOutcomes);

    return { probability, binomialCoeff, totalOutcomes };
  }, [trialsNum, desiredHeads]);

  // Generate coins for visualization - limit to reasonable number
  const { totalCoins, favorableCoins } = useMemo(() => {
    const maxCoins = 100; // Maximum coins to display
    const total = Number(totalOutcomes);
    const favorable = Number(binomialCoeff);

    if (total <= maxCoins) {
      return { totalCoins: total, favorableCoins: favorable };
    }

    // Scale down proportionally
    const scale = maxCoins / total;
    return {
      totalCoins: maxCoins,
      favorableCoins: Math.max(1, Math.round(favorable * scale)),
    };
  }, [totalOutcomes, binomialCoeff]);

  return (
    <VisualizerLayout title="Coin Toss Probability">
      <div className="mb-8 grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="trials">Number of tosses</Label>
          <Input
            id="trials"
            type="number"
            min="1"
            value={trials}
            onChange={(e) => setTrials(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headsPercent">% of heads desired</Label>
          <Input
            id="headsPercent"
            type="number"
            min="0"
            max="100"
            value={headsPercent}
            onChange={(e) => setHeadsPercent(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Probability of occurrence</p>
        <p className="text-3xl font-light text-foreground">{(probability * 100).toFixed(4)}%</p>
        <p className="mt-2 text-sm text-muted-foreground">
          ({desiredHeads} heads out of {trialsNum} tosses)
        </p>
      </div>

      {/* Coin Visualizer */}
      <div
        className="relative border border-border overflow-hidden p-4"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => setMousePos(null)}
      >
        {/* Coins grid */}
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: totalCoins }).map((_, i) => (
            <Coin
              key={i}
              color={i < favorableCoins ? "#a78bfa" : "#363636"}
              size={totalCoins <= 20 ? 32 : totalCoins <= 50 ? 24 : 18}
            />
          ))}
        </div>

        {/* Small tooltip following cursor */}
        {mousePos && (
          <div
            className="pointer-events-none absolute z-10 border border-border bg-background px-2 py-1"
            style={{
              left: mousePos.x + 12,
              top: mousePos.y + 12,
            }}
          >
            <p className="text-xs text-accent">{(probability * 100).toFixed(4)}%</p>
            <p className="text-xs text-muted-foreground">
              {Number(binomialCoeff).toExponential(2)} / {Number(totalOutcomes).toExponential(2)}
            </p>
          </div>
        )}

        {/* Labels */}
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <div>
            <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: "#a78bfa" }} />
            Favorable: {binomialCoeff.toString()}
          </div>
          <div>
            <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: "#363636" }} />
            Total: {totalOutcomes.toString()}
          </div>
        </div>
      </div>

      {/* Formula Section */}
      <div className="mt-8 space-y-6 border-t border-border pt-8">
        <h3 className="text-sm font-medium text-muted-foreground">Formula</h3>

        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Step 1: Desired heads</p>
            <div className="text-muted-foreground">
              <Tex>{`k = n \\times \\frac{\\%}{100} = ${trialsNum} \\times \\frac{${headsPercentNum}}{100} = ${desiredHeads}`}</Tex>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Step 2: Binomial coefficient</p>
            <div className="text-foreground">
              <Tex>{`\\binom{n}{k} = \\frac{n!}{k! \\cdot (n-k)!}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`\\binom{${trialsNum}}{${desiredHeads}} = \\frac{${trialsNum}!}{${desiredHeads}! \\cdot ${trialsNum - desiredHeads}!}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`\\binom{${trialsNum}}{${desiredHeads}} = ${binomialCoeff.toString()}`}</Tex>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Step 3: Probability</p>
            <div className="text-foreground">
              <Tex>{`P = \\frac{\\binom{n}{k}}{2^n}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`P = \\frac{${binomialCoeff.toString()}}{2^{${trialsNum}}}`}</Tex>
            </div>
            <div className="text-muted-foreground">
              <Tex>{`P = \\frac{${binomialCoeff.toString()}}{${totalOutcomes.toString()}}`}</Tex>
            </div>
            <div className="text-accent">
              <Tex>{`P = ${probability.toFixed(6)} = ${(probability * 100).toFixed(4)}\\%`}</Tex>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-8 space-y-4 text-sm text-muted-foreground border-t border-border pt-8">
        <p>
          This is a simple visualizer to show you how the probability of getting a certain % of your tosses (say 50%) as heads (or tails). For instance, the probability of getting half your tosses as H or T never goes over, well, 50%. The fewer the number of tosses, the higher the probability of any one single outcome.
        </p>
        <p>
          By symmetry, heads and tails are equally likely. So P(heads &gt; 50%) = P(tails &gt; 50%). Since these two events can&apos;t both happen at once (you can&apos;t have more than half heads AND more than half tails), each probability is at most 50%.
        </p>
        <p>
          Here&apos;s a fun paradox: getting <strong className="text-foreground">exactly</strong> 50% heads is the single most likely outcome - yet its probability shrinks toward zero as you flip more coins. For 100 flips, landing exactly 50 heads has only about an 8% chance.
        </p>
        <p>
          The &quot;most likely&quot; outcome can still be quite unlikely. Each additional flip spreads the probability across more possible outcomes.
        </p>
      </div>
    </VisualizerLayout>
  );
}
