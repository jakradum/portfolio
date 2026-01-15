import Link from "next/link";

interface VisualizerLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function VisualizerLayout({ title, children }: VisualizerLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            MathSee
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="font-medium text-foreground">{title}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
