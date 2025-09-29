"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function UIShellLayout({children}: {children:ReactNode}) {
    const pathname = usePathname() || '/pokemon'
    const variant = pathname.startsWith('/battle') ? 'dark' : 'light';

    return (
        <>
            <Navbar variant={variant} />
            <main className="mx-auto max-w-6xl px-4 py-6"> {children} </main>
            <Footer variant={variant} />
        </>
    )
}