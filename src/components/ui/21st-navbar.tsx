"use client";

import * as React from "react";
import clsx from "clsx";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavDropdownItem {
  text: string;
  description?: string;
  to: string;
  icon?: React.ReactNode;
}

export interface NavItem {
  to?: string;
  text: string;
  items?: NavDropdownItem[];
}

export interface SkillBridgeHeaderProps {
  className?: string;
  logo?: React.ReactNode;
  menuItems?: NavItem[];
  rightContent?: React.ReactNode;
  onMobileMenuOpen?: () => void;
}

// ─── Chevron ──────────────────────────────────────────────────────────────────

const ChevronIcon = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-2.5 opacity-60 transition-transform duration-200 group-hover:rotate-180"
  >
    <path
      d="M1 1L5 5L9 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Desktop Navigation ───────────────────────────────────────────────────────

const Navigation: React.FC<{ items: NavItem[] }> = ({ items }) => (
  <nav>
    <ul className="flex gap-x-8 lg:hidden">
      {items.map(({ to, text, items: subItems }, index) => {
        const Tag = to ? "a" : "button";
        return (
          <li
            className={clsx("relative [perspective:2000px]", subItems && subItems.length > 0 && "group")}
            key={index}
          >
            <Tag
              className="flex items-center gap-x-1.5 whitespace-nowrap text-sm text-zinc-400 hover:text-white transition-colors duration-200"
              href={to}
            >
              {text}
              {subItems && subItems.length > 0 && <ChevronIcon />}
            </Tag>

            {subItems && subItems.length > 0 && (
              <div
                className={clsx(
                  "absolute -left-4 top-full w-[280px] pt-4 z-50",
                  "pointer-events-none opacity-0",
                  "origin-top-left transition-[opacity,transform] duration-200",
                  "[transform:rotateX(-12deg)_scale(0.92)]",
                  "group-hover:pointer-events-auto group-hover:opacity-100 group-hover:[transform:none]"
                )}
              >
                <ul className="relative flex flex-col gap-y-0.5 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.6)]">
                  {/* Arrow */}
                  <div className="absolute -top-1.5 left-6 w-3 h-3 rotate-45 bg-zinc-900 border-l border-t border-zinc-800" />

                  {subItems.map(({ icon, text: subText, description, to: subTo }, i) => (
                    <li key={i}>
                      <a
                        className={clsx(
                          "relative flex items-center gap-3 rounded-xl p-2.5 transition-colors duration-150",
                          "hover:bg-zinc-800",
                          "before:absolute before:inset-0 before:rounded-xl"
                        )}
                        href={subTo}
                      >
                        {icon && (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
                            {icon}
                          </div>
                        )}
                        <div>
                          <span className="block text-sm font-medium text-white">{subText}</span>
                          {description && (
                            <span className="mt-0.5 block text-xs text-zinc-500 leading-relaxed">
                              {description}
                            </span>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

// ─── Mobile Menu Button ───────────────────────────────────────────────────────

const MobileMenuButton: React.FC<{
  isOpen: boolean;
  onClick: () => void;
}> = ({ isOpen, onClick }) => (
  <button
    className="hidden lg:flex flex-col justify-center items-center w-8 h-8 gap-1.5"
    onClick={onClick}
    aria-label="Menüyü aç"
  >
    <span
      className={clsx(
        "block h-0.5 w-5 rounded-full bg-zinc-400 transition-all duration-300",
        isOpen && "translate-y-2 rotate-45"
      )}
    />
    <span
      className={clsx(
        "block h-0.5 w-5 rounded-full bg-zinc-400 transition-all duration-300",
        isOpen && "opacity-0"
      )}
    />
    <span
      className={clsx(
        "block h-0.5 w-5 rounded-full bg-zinc-400 transition-all duration-300",
        isOpen && "-translate-y-2 -rotate-45"
      )}
    />
  </button>
);

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

const MobileMenu: React.FC<{
  items: NavItem[];
  rightContent?: React.ReactNode;
  isOpen: boolean;
}> = ({ items, rightContent, isOpen }) => (
  <div
    className={clsx(
      "hidden lg:block overflow-hidden transition-all duration-300",
      isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
    )}
  >
    <div className="border-t border-zinc-800 px-5 py-4 flex flex-col gap-2">
      {items.map(({ to, text, items: subItems }, i) => (
        <div key={i}>
          <a
            href={to ?? "#"}
            className="block py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            {text}
          </a>
          {subItems && subItems.length > 0 && (
            <div className="pl-3 border-l border-zinc-800 mt-1 flex flex-col gap-1">
              {subItems.map(({ to: subTo, text: subText }, j) => (
                <a
                  key={j}
                  href={subTo}
                  className="block py-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {subText}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
      {rightContent && <div className="mt-4 flex flex-col gap-2">{rightContent}</div>}
    </div>
  </div>
);

// ─── Main Header ──────────────────────────────────────────────────────────────

export const SkillBridgeHeader: React.FC<SkillBridgeHeaderProps> = ({
  className,
  logo,
  menuItems = [],
  rightContent,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 shadow-[0_1px_20px_rgba(0,0,0,0.4)]"
          : "bg-transparent",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* Logo */}
          <div className="shrink-0">{logo}</div>

          {/* Desktop Nav */}
          <div className="flex-1 flex justify-center">
            <Navigation items={menuItems} />
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="lg:hidden flex items-center gap-3">{rightContent}</div>
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((o) => !o)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileMenu
        items={menuItems}
        rightContent={rightContent}
        isOpen={isMobileMenuOpen}
      />
    </header>
  );
};

export default SkillBridgeHeader;
