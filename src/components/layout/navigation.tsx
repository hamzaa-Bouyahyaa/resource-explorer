"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/hooks";

export function Navigation() {
  const pathname = usePathname();
  const { count } = useFavorites();

  const navItems = [
    {
      href: "/",
      label: "Characters",
      isActive: pathname === "/",
    },
    {
      href: "/favorites",
      label: "Favorites",
      isActive: pathname === "/favorites",
      badge: count > 0 ? count : undefined,
    },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-bold text-sm">RM</span>
            </div>
            <div className="hidden sm:block">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Resource Explorer
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group
                  ${
                    item.isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  }
                `}
              >
                <span className="relative z-10">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse z-[9999]">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
                {/* Active indicator */}
                {item.isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 opacity-100" />
                )}
                {/* Hover effect */}
                {!item.isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Mobile navigation component
 */
export function MobileNavigation() {
  const pathname = usePathname();
  const { count } = useFavorites();

  const navItems = [
    {
      href: "/",
      label: "Characters",
      isActive: pathname === "/",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      href: "/favorites",
      label: "Favorites",
      isActive: pathname === "/favorites",
      badge: count > 0 ? count : undefined,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 sm:hidden z-50 shadow-2xl">
      <div className="flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex-1 flex flex-col items-center justify-center py-3 relative transition-all duration-300 group
              ${
                item.isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            {/* Background highlight for active item */}
            {item.isActive && (
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-transparent" />
            )}

            <div className="relative z-10">
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs mt-1.5 font-semibold relative z-10">
              {item.label}
            </span>

            {/* Active indicator dot */}
            {item.isActive && (
              <div className="absolute top-1 w-1 h-1 bg-blue-600 rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
