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
  const { setTheme } = useTheme();

  const [darkTheme, setDarkTheme] = React.useState(true);
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant={"outline"}
              onClick={() => {
                setTheme(darkTheme ? "light" : "dark");
                setDarkTheme(!darkTheme);
              }}
              className="w-full justify-start"
            >
              {darkTheme ? <Sun /> : <Moon />}
              <span>Switch Theme</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
