import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const pageTitles: Record<string, string> = {
  "/": "Calendar",
};

export function AppShell({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  const title = pageTitles[currentPath] ?? "This Month";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar currentPath={currentPath} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <p className="text-sm font-medium">{title}</p>
            <span className="ml-auto rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              Taxfix
            </span>
          </header>
          <div className="flex flex-1 flex-col p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
