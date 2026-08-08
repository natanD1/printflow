"use client";

import {
  Boxes,
  Home,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { icon: Home, title: "Home", url: "/home" },
  { icon: Boxes, title: "Filamentos", url: "/filamentos" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { setTheme } = useTheme();

  const handleLogout = useCallback(() => {
    logout()
      .then(() => router.push("/auth"))
      .catch(() => null);
  }, [logout, router]);

  const handleLightTheme = useCallback(() => setTheme("light"), [setTheme]);
  const handleDarkTheme = useCallback(() => setTheme("dark"), [setTheme]);
  const handleSystemTheme = useCallback(() => setTheme("system"), [setTheme]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 overflow-hidden rounded-md p-2 group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-5" />
          </div>
          <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">
            PrintFlow
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    render={<Link href={item.url} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<SidebarMenuButton tooltip="Tema" />}
              >
                <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Tema</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleLightTheme}>
                  <Sun />
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDarkTheme}>
                  <Moon />
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSystemTheme}>
                  <Monitor />
                  Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/configuracoes"}
              render={<Link href="/configuracoes" />}
              tooltip="Configurações"
            >
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer transition-colors hover:bg-rose-500 hover:text-white"
              onClick={handleLogout}
              tooltip="Sair"
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
