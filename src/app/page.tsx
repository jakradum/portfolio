import Link from "next/link";

const visualizers = [
  {
    slug: "ap-generator",
    title: "Arithmetic Progression",
    description: "See sequences unfold on a number line",
  },
  {
    slug: "age-ratio",
    title: "Parent-Child Age Ratio",
    description: "Watch ratios approach but never reach 100%",
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
    slug: "prime-finder",
    title: "Prime Number Finder",
    description: "The geometry of divisibility",
  },
  {
    slug: "square-root",
    title: "Geometric Square Root",
    description: "Classical construction, no calculator",
  },
  {
    slug: "pattern",
    title: "Pattern Generator",
    description: "Repeating geometric designs",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-16">
          <h1 className="text-4xl font-light tracking-tight text-foreground">
            MathSee
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Interactive visualizers that show you the answer and why the answer is true.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visualizers.map((viz) => (
            <Link
              key={viz.slug}
              href={`/${viz.slug}`}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/20 hover:bg-accent"
            >
              <h2 className="font-medium text-card-foreground group-hover:text-foreground">
                {viz.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {viz.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
