"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Heart, LayoutGrid, Map, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/lib/store";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";

const NAV = [
  { href: "/", label: "Discover", icon: LayoutGrid },
  { href: "/stations", label: "Stations", icon: Radio },
  { href: "/map", label: "Map", icon: Map },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

export default function Header() {
  const pathname = usePathname();
  const { favorites } = usePlayerStore();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
            <Radio className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Radio</span>
            <span className="text-lg font-bold text-orange-500">World</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                pathname === href ? "bg-orange-500/10 text-orange-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
              {href === "/favorites" && favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
          ))}

          {/* User */}
          {session ? (
            <Link href="/profile" className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/profile" ? "bg-orange-500/10 text-orange-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}>
              {session.user?.image ? (
                <Image src={session.user.image} alt="avatar" width={24} height={24} className="rounded-full" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Profile</span>
            </Link>
          ) : (
            <button onClick={() => signIn()}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-400">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
