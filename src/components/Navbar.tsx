'use client'
import Link from "next/link"
/* import { usePathname } from "next/navigation";
 */
type Props = {
    variant?: 'light' | 'dark';
}

export default function Navbar({variant = 'light'}: Props) {
    const shell =
        variant === 'dark'
            ? 'bg-neutral-900/80 text-neutral-100 border-neutral-800'
            : 'bg-white/80 text.neutral-900 border-neutral-200';
    
    const link = 
        variant === 'dark'
            ? 'text-neutral-200 hover:bg-neutral-800'
            : 'text-neutral-700 hover:bg-neutral-100';


    return (

        <header className={`sticky top-0 z-50 border-b backdrop-blur ${shell}`}>
            <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <Link href='/homepage' className= 'text-lg text-blue-700 font-semibold justify-start hover:text-blue-700'>PokemonBattle</Link>
                <ul className="flex items-center gap-1 sm:gap-2 text-sm">
                    <li><Link href="/pokemon" className={`px-3 py-2 rounded-md ${link}`}>Pokemon</Link></li>
                    <li><Link href="/roster" className={`px-3 py-2 rounded-md ${link}`}>My Roster</Link></li>
                    <li><Link href="/battle" className={`px-3 py-2 rounded-md ${link}`}>Battle</Link></li>
                    <li><Link href="/leaderboard" className={`px-3 py-2 rounded-md ${link}`}>Leaderboard</Link></li>
                </ul>
            </nav>
           
        </header>

    )
}