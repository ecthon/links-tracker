<!-- link-card.tsx -->
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

interface LinkCardProps {
    icon: any;
    title: string;
    url: string;
    onClick?: () => void;
}

export function LinkCard({ icon, title, url, onClick }: LinkCardProps) {
    return (
        <Link href={url} target="_blank" onClick={onClick} className="flex w-full justify-between items-center p-3 bg-zinc-200/60 dark:bg-zinc-900/60 rounded-lg hover:px-2 transition-all duration-200 cursor-pointer group">
            <div className="flex gap-4">
                <HugeiconsIcon icon={icon} size={16} strokeWidth={2} className="text-zinc-600 dark:text-zinc-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
                <div className="font-semibold text-sm text-zinc-700 dark:text-zinc-200">{title}</div>
            </div>
            <div>
                <HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} className="text-zinc-600 dark:text-zinc-400 transition-transform duration-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
            </div>
        </Link>
    );
}
<!-- pages.tsx -->
"use client";

import { LinkCard } from "./link-card";
import { LINKS_DATA } from "@/constants/data";
import Image from "next/image";
import { EnergyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { track } from "@vercel/analytics";
import Link from "next/link";

export default function LinksPage() {
    return (
        <main className="flex flex-col w-full min-h-screen max-w-[600px] px-4 mx-auto py-8">
            <div className="flex-1 flex flex-col justify-center w-full gap-12">
                <div className="flex flex-col items-center justify-center gap-8">
                    <Image src="/ecthon.jpeg" alt="Ecthon" width={1000} height={1000} quality={80} className="w-16 h-16 rounded-full" />
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">@ecthon</p>
                        <div className="flex items-center gap-4">
                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">×͜×</p>
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">ecthon</h1>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full items-center justify-center p-2 space-y-2 sm:p-0 sm:gap-0">
                    {LINKS_DATA.map((link) => (
                        <LinkCard
                            key={link.title}
                            icon={link.icon}
                            title={link.title}
                            url={link.url}
                            onClick={() => track("link_click", { title: link.title, url: link.url })}
                        />
                    ))}
                </div>
            </div>
            <footer className="flex w-full items-center justify-center mt-8 pb-4">
                <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-full pl-2 pr-4 py-1">
                    <HugeiconsIcon icon={EnergyIcon} size={20} strokeWidth={2} className="text-zinc-600 dark:text-zinc-200" />
                    <Link href="https://ecthon.me" className="text-zinc-900 dark:text-zinc-100">ecthon</Link>
                </div>
            </footer>
        </main>
    );
}


export const SOCIAL_LINKS = [
    {
        name: "ecthon",
        url: "https://instagram.com/ecthon",
        icon: InstagramIcon,
        showName: true,
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com/in/ecthon",
        icon: Linkedin01Icon,
        showName: false,
    },
    {
        name: "GitHub",
        url: "https://github.com/ecthon",
        icon: GithubIcon,
        showName: false,
    }
];