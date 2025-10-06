'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";

type Props = {
  variant?: "light" | "dark";
};

export default function Navbar({ variant = "light" }: Props) {
  const pathname = usePathname(); // ✅ correct usage
  const { user, isAuthenticated, logout } = useAuth();

  // UI state
  const [openMobile, setOpenMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // theme shells
  const shell =
    variant === "dark"
      ? "bg-neutral-900/70 text-neutral-100 border-neutral-800"
      : "bg-white/70 text-neutral-900 border-neutral-200";

  // link base styles
  const baseLink =
    variant === "dark"
      ? "text-neutral-200 hover:text-white"
      : "text-neutral-700 hover:text-neutral-900";

  // helper: active link underline/gradient pill
  const navLink = (href: string) => {
    const active = pathname === href;
    return [
      "px-3 py-2 rounded-md relative transition",
      baseLink,
      active
        ? "font-semibold"
        : "font-medium",
      // gradient underline on hover + persistent for active
      "after:absolute after:left-3 after:right-3 after:-bottom-[2px] after:h-[3px] after:rounded-full",
      active
        ? "after:bg-gradient-to-r after:from-blue-500 after:to-purple-500"
        : "after:bg-transparent hover:after:bg-gradient-to-r hover:after:from-blue-400/60 hover:after:to-purple-400/60",
    ].join(" ");
  };

  // close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // navigation items (kept simple to match teammates’ pages)
  const links = [
/*     { href: "/homepage", label: "Pokémon" },
 */    { href: "/roster", label: "My Roster" },
    { href: "/battle", label: "Battle" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${shell}`}
      role="banner"
    >
      {/* subtle top gradient bar for “premium” feel */}
      <div className="h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 opacity-70" />

      <nav
        className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between"
        aria-label="Primary"
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/homepage"
            className="group inline-flex items-center gap-2"
            aria-label="PokeBattle home"
          >
            <span className="font-bold tracking-tight text-xl text-blue-700 group-hover:text-blue-600 transition">
              PokeBattle
            </span>
            <span className="hidden sm:inline-block text-xs text-neutral-500 group-hover:text-neutral-700 transition">
              beta
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1 sm:gap-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={navLink(l.href)}>
                {l.label}
              </Link>
            </li>
          ))}

          {/* Auth */}
          {isAuthenticated ? (
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className={`ml-1 px-3 py-2 rounded-md ${baseLink} flex items-center gap-2`}
                aria-haspopup="menu"
                aria-expanded={showDropdown}
              >
                {/* simple avatar circle with initial */}
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="max-w-[10rem] truncate">{user?.name}</span>
                <svg
                  className={`h-3 w-3 transition ${showDropdown ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </button>

              {showDropdown && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-xs text-neutral-500">Signed in as</p>
                    <p className="truncate font-medium">{user?.email ?? user?.name}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-50"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link href="/login" className={navLink("/login")}>
                Sign in/Sign up
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile toggler */}
        <button
          onClick={() => setOpenMobile((v) => !v)}
          className={`md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border ${baseLink}`}
          aria-label="Toggle menu"
          aria-expanded={openMobile}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            {openMobile ? (
              <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`md:hidden border-t ${variant === "dark" ? "border-neutral-800" : "border-neutral-200"
          }`}
      >
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ${openMobile ? "max-h-96" : "max-h-0"
            }`}
        >
          <ul className="px-4 py-2 grid gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpenMobile(false)}
                  className={`${navLink(l.href)} block`}
                >
                  {l.label}
                </Link>
              </li>
            ))}

            {isAuthenticated ? (
              <li>
                <button
                  onClick={() => {
                    setOpenMobile(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100"
                >
                  Sign out
                </button>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  onClick={() => setOpenMobile(false)}
                  className={`${navLink("/login")} block`}
                >
                  Sign in/Sign up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
