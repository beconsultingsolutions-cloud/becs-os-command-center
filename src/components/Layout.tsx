import {
  Bell,
  CalendarClock,
  CheckSquare,
  ClipboardList,
  FileText,
  Inbox,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Sun,
  Target,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { RouteKey } from "../lib/types";
import { BrandMark } from "./BrandMark";
import { Button, cn } from "./ui";

type NavItem = {
  route: RouteKey;
  title: string;
  icon: typeof LayoutDashboard;
};

const operationsNav: NavItem[] = [
  { route: "overview", title: "Overview", icon: LayoutDashboard },
  { route: "intake", title: "Intake", icon: Inbox },
  { route: "sales", title: "Sales", icon: Target },
  { route: "onboarding", title: "Onboarding", icon: Users },
  { route: "projects", title: "Projects", icon: ClipboardList },
  { route: "tasks", title: "Tasks", icon: CheckSquare },
  { route: "admin", title: "Admin", icon: FileText },
];

const systemNav: NavItem[] = [
  { route: "communications", title: "Comms", icon: Send },
  { route: "approvals", title: "Approvals", icon: Bell },
  { route: "triggers", title: "Triggers", icon: Workflow },
  { route: "automation", title: "Automation", icon: Zap },
  { route: "calendar", title: "Calendar", icon: CalendarClock },
];

export function Layout({
  activeRoute,
  onNavigate,
  children,
}: {
  activeRoute: RouteKey;
  onNavigate: (route: RouteKey) => void;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className={cn("app-shell", collapsed && "app-shell--collapsed")}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="sidebar" aria-label="Command center navigation">
        <div className="sidebar__brand">
          <BrandMark compact={collapsed} />
        </div>
        <nav className="sidebar__nav">
          <NavGroup label="Operations" items={operationsNav} activeRoute={activeRoute} onNavigate={onNavigate} collapsed={collapsed} />
          <div className="sidebar__separator" />
          <NavGroup label="System" items={systemNav} activeRoute={activeRoute} onNavigate={onNavigate} collapsed={collapsed} />
        </nav>
        <div className="sidebar__footer">
          <div className="db-note" data-testid="text-db-note">
            <strong>Supabase linked</strong>
            {!collapsed && <span>becs_os_* tables</span>}
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar__left">
            <Button aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed((value) => !value)} variant="outline">
              {collapsed ? <PanelLeftOpen className="button__icon" /> : <PanelLeftClose className="button__icon" />}
            </Button>
            <p>Digital operating system for entity-level work</p>
          </div>
          <Button
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
            variant="outline"
          >
            {theme === "dark" ? <Sun className="button__icon" /> : <Moon className="button__icon" />}
          </Button>
        </header>
        <main id="main-content" className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavGroup({
  label,
  items,
  activeRoute,
  onNavigate,
  collapsed,
}: {
  label: string;
  items: NavItem[];
  activeRoute: RouteKey;
  onNavigate: (route: RouteKey) => void;
  collapsed: boolean;
}) {
  return (
    <div className="nav-group">
      {!collapsed && <p className="nav-group__label">{label}</p>}
      <ul>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.route}>
              <button
                className={cn("nav-link", activeRoute === item.route && "nav-link--active")}
                data-testid={`link-${item.title.toLowerCase()}`}
                onClick={() => onNavigate(item.route)}
                title={collapsed ? item.title : undefined}
                type="button"
              >
                <Icon className="nav-link__icon" aria-hidden="true" />
                {!collapsed && <span>{item.title}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
