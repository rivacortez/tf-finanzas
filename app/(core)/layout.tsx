"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  Home,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  User,
  LogOut
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function CoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Navbar>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar>
            <SidebarHeader className="flex items-center gap-2 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-lg font-bold text-white">EB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-md font-semibold">EduBono</span>
                <span className="text-xs text-muted-foreground">Sistema de Bonos Educativos</span>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard")}
                    tooltip="Dashboard"
                  >
                    <Link href="/dashboard">
                      <Home className="mr-2" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/simulator") || pathname.startsWith("/simulator")}
                    tooltip="Simulador"
                  >
                    <Link href="/simulator">
                      <Calculator className="mr-2" />
                      <span>Simulador de Bonos</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/bonds")}
                    tooltip="Mis Bonos"
                  >
                    <Link href="/bonds">
                      <FileText className="mr-2" />
                      <span>Mis Bonos</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarSeparator />

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/analytics")}
                    tooltip="Análisis"
                  >
                    <Link href="/analytics">
                      <BarChart3 className="mr-2" />
                      <span>Análisis Financiero</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/documentation")}
                    tooltip="Documentación"
                  >
                    <Link href="/documentation">
                      <BookOpen className="mr-2" />
                      <span>Documentación</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/profile")}
                    tooltip="Perfil"
                  >
                    <Link href="/profile">
                      <User className="mr-2" />
                      <span>Perfil</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/settings")}
                    tooltip="Configuración"
                  >
                    <Link href="/settings">
                      <Settings className="mr-2" />
                      <span>Configuración</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarSeparator />

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Cerrar Sesión"
                  >
                    <Link href="/sign-in">
                      <LogOut className="mr-2" />
                      <span>Cerrar Sesión</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <div className="flex flex-1 flex-col">
            <header className="flex h-16 items-center border-b px-6">
              <SidebarTrigger />
              <div className="ml-4 font-semibold">EduBono Perú</div>
              <div className="ml-auto flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </div>
            </header>

            <SidebarInset>
              <main className="flex-1 p-6">
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </Navbar>
  );
} 