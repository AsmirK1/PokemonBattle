'use client'
import Link from "next/link"
/* import { usePathname } from "next/navigation";
 */
import { usePathname } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

type Props = {
    variant?: 'light' | 'dark';
}

export default function Navbar({variant = 'light'}: Props) {
    const { user, isAuthenticated, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const shell =
        variant === 'dark'
            ? 'bg-neutral-900/80 text-neutral-100 border-neutral-800'
            : 'bg-white/80 text-neutral-900 border-neutral-200';
    
    const link = 
        variant === 'dark'
            ? 'text-neutral-200 hover:bg-neutral-800'
            : 'text-neutral-700 hover:bg-neutral-100';

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    return (
        <header className={`sticky top-0 z-40 border-b backdrop-blur ${shell}`}>
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <Link href='/homepage' className= 'text-lg text-blue-700 font-semibold justify-start hover:text-blue-700'>PokemonBattle</Link>

                <ul className="flex items-center gap-1 sm:gap-2 text-sm">
                    <li><Link href="/pokemon" className={`px-3 py-2 rounded-md ${link}`}>Pokemon</Link></li>
                    <li><Link href="/roster" className={`px-3 py-2 rounded-md ${link}`}>My Roster</Link></li>
                    <li><Link href="/battle" className={`px-3 py-2 rounded-md ${link}`}>Battle</Link></li>
                    <li><Link href="/leaderboard" className={`px-3 py-2 rounded-md ${link}`}>Leaderboard</Link></li>
                    
                    {/* Auth Section */}
                    {isAuthenticated ? (
                        <li className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className={`px-3 py-2 rounded-md ${link} flex items-center gap-1 relative z-40`}
                            >
                                <span>👤</span>
                                {user?.name}
                                <span className={`transform transition-transform ${showDropdown ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            
                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <li><Link href="/login" className={`px-3 py-2 rounded-md ${link}`}>Sign in/Sign up</Link></li>
                    )}
                </ul>
            </nav>
           
        </header>
    )
}