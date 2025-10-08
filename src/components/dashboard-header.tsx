import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Github, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

interface DashboardHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ title, actions }: DashboardHeaderProps) {
  const { setTheme } = useTheme();

  const [darkTheme, setDarkTheme] = useState(true);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 py-2 lg:gap-2 lg:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {actions}
          <Button
            variant={"outline"}
            onClick={() => {
              setTheme(darkTheme ? "light" : "dark");
              setDarkTheme(!darkTheme);
            }}
            className=" justify-start"
          >
            {darkTheme ? <Sun /> : <Moon />}
          </Button>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <div>
              <Github />
              <a
                href="https://github.com/nick-reis/dashlytics-ai"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
