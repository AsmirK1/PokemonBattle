import Link from "next/link";

type Props = {
  variant?: "light" | "dark";
};

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.76.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.08 1.85 2.84 1.32 3.53 1.01.11-.79.42-1.32.76-1.63-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.51.12-3.15 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.64.24 2.85.12 3.15.77.84 1.23 1.91 1.23 3.23 0 4.64-2.8 5.65-5.48 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 12 .5Z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path fill="currentColor" d="M20.45 20.45h-3.55v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H9.32V9h3.4v1.56h.05c.47-.9 1.62-1.85 3.33-1.85 3.56 0 4.22 2.34 4.22 5.39v6.35ZM5.34 7.44A2.06 2.06 0 1 1 5.33 3.3a2.06 2.06 0 0 1 .01 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z"/>
  </svg>
);

export default function Footer({ variant = "light" }: Props) {
  const shell =
    variant === "dark"
      ? "bg-neutral-900/90 text-neutral-300 border-neutral-800"
      : "bg-white text-neutral-600 border-neutral-200";

  const link =
    variant === "dark"
      ? "text-neutral-300 hover:text-white"
      : "text-neutral-600 hover:text-neutral-900";

  const iconBtn =
    variant === "dark"
      ? "bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700"
      : "bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200";

  const year = new Date().getFullYear();

  return (
    <footer className={`border-t ${shell}`}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/homepage" className={link}>Home</Link>
          <Link href="/pokemon" className={link}>Pokémon</Link>
          <Link href="/roster" className={link}>My Roster</Link>
          <Link href="/battle" className={link}>Battle</Link>
          <Link href="/leaderboard" className={link}>Leaderboard</Link>
        </nav>

        <div className="mt-4 flex justify-center gap-3">
          <a
            href="https://github.com/AsmirK1/PokemonBattle"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={`h-10 w-10 sm:h-9 sm:w-9 rounded-full border flex items-center justify-center transition-colors ${iconBtn}`}
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className={`h-10 w-10 sm:h-9 sm:w-9 rounded-full border flex items-center justify-center transition-colors ${iconBtn}`}
          >
            <LinkedInIcon />
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
          <Link href="/privacy" className={link}>Privacy</Link>
          <Link href="/terms" className={link}>Terms</Link>
          <a href="mailto:team@example.com" className={link}>Contact</a>
          <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className={link}>
            Powered by PokeAPI
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-4 text-center text-xs opacity-80">
          &copy; {year} PokémonBattle — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
