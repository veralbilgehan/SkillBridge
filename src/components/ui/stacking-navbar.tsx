"use client"

import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface NavItem {
  href: string;
  label: string;
  active?: boolean;
}

const StackingNavbar = ({ items }: { items?: NavItem[] }) => {
  const [expanded, setExpanded] = useState(false);

  const defaultItems: NavItem[] = items ?? [
    { href: "#", label: "Projects" },
    { href: "#", label: "Components" },
    { href: "#", label: "Information" },
  ];

  return (
    <div
      className="flex items-center gap-x-2"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {defaultItems.map((item, index) => (
        <StackingNavbarItem
          href={item.href}
          expanded={expanded}
          active={item.active}
          key={item.label}
          index={index}
        >
          {item.label}
        </StackingNavbarItem>
      ))}
    </div>
  );
};

const StackingNavbarItem = ({
  href,
  children,
  style,
  expanded,
  active,
  index,
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  expanded: boolean;
  active?: boolean;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ x: -110 * index }}
      animate={{ x: expanded ? 0 : -110 * index }}
      transition={{
        duration: 0.5,
        ease: "circInOut",
        delay: 0.08 * index,
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      style={{ zIndex: 100 - index }}
    >
      <Link
        className={`flex items-center text-sm px-5 py-2.5 rounded-3xl no-underline backdrop-blur-lg transition-colors duration-300 ease-in-out whitespace-nowrap ${
          active
            ? "bg-indigo-600 text-white"
            : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white"
        }`}
        href={href}
        style={style}
      >
        {children}
      </Link>
    </motion.div>
  );
};

export { StackingNavbar };
