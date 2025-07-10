"use client";

import { Home, Calculator, FileText, Package, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";

const menuItems = [
  { name: "Inicio", icon: Home, href: "/simulator/bono-frances" },
  { name: "Calculadora Bonos", icon: Calculator, href: "/simulator/bono-frances" },
  { name: "Mis Bonos", icon: FileText, href: "/bonds" },
  { name: "Gestión de Bonos", icon: Package, href: "/bond" },
  { name: "Documentación", icon: BookOpen, href: "/documentation" },
  { name: "Perfil", icon: Users, href: "/profile" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Finanzas App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
