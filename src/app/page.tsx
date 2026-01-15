import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const visualizers = [
  {
    slug: "ap-generator",
    title: "Arithmetic Progression",
    description: "See sequences unfold on a number line",
  },
  {
    slug: "parabola",
    title: "Parabola Vertex Finder",
    description: "Brute force meets -b/2a",
  },
  {
    slug: "coin-toss",
    title: "Coin Toss Probability",
    description: "Binomial coefficients visualized",
  },
  {
    slug: "number-tree",
    title: "Number Tree",
    description: "Primes as roots, composites as branches",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-medium text-foreground">MathSee</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-12 max-w-xl text-muted-foreground">
          Interactive visualizers that show you the answer and why the answer is true.
        </p>

        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {visualizers.map((viz) => (
            <Link
              key={viz.slug}
              href={`/${viz.slug}`}
              className="group bg-background p-6 transition-colors hover:bg-accent"
            >
              <h2 className="font-medium text-foreground">
                {viz.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground group-hover:text-accent-foreground">
                {viz.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
