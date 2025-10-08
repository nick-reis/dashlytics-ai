"use client";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  LibraryBig,
  Moon,
  Sun,
  Tag,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Chat from "./chat";
import { Separator } from "./ui/separator";

const items = [
  {
    title: "Products",
    url: "/products",
    icon: Tag,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: User,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: LibraryBig,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar className="flex flex-col">
      <SidebarHeader />
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={pathname == "/"} asChild>
                <Link href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={isActive} asChild>
                      <Link href={item.url || "/"}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="p-4 flex-1 mt-auto h-full overflow-hidden">
          <div className=" h-full bg-background rounded-lg border w-full overflow-hidden">
            <Chat />
          </div>
        </div>
      </SidebarContent>

      <SidebarRail></SidebarRail>
    </Sidebar>
  );
}
