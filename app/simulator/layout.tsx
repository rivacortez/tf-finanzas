"use client";

import { Navbar } from "@/components/ui/navbar";
import { ReactNode } from "react";

export default function SimulatorLayout({ children }: { children: ReactNode }) {
  return (
    <Navbar>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto py-8 px-4">{children}</main>
      </div>
    </Navbar>
  );
}