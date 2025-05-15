"use client";

import Link from "next/link";


import {
	
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
	
} from "@/components/ui/sidebar";

import { Navbar } from "@/components/ui/navbar";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	

	return (
		<Navbar>
			<SidebarProvider>
				<div className="flex min-h-screen">
					

					<div className="flex flex-1 flex-col">
						<header className="flex h-16 items-center border-b px-6">
							<SidebarTrigger />
							<div className="ml-4 font-semibold">EduBono Perú</div>
							<div className="ml-auto flex items-center gap-4">
								<Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
									Volver al Dashboard
								</Link>
							</div>
						</header>

						<SidebarInset>
							<main className="flex-1">
								{children}
							</main>
						</SidebarInset>
					</div>
				</div>
			</SidebarProvider>
		</Navbar>
	);
}