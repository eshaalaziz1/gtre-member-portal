"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MemberAuth from "../MemberAuth";
import type { DashboardSummary } from "@/lib/dashboard";

export type PortalTabId =
  | "home"
  | "grades"
  | "assignments"
  | "materials"
  | "checkin"
  | "schedule"
  | "casestudy"
  | "forum"
  | "profile";

const TAB_TITLES: Record<PortalTabId, string> = {
  home: "Home",
  grades: "Grades",
  assignments: "Assignments",
  materials: "Study materials",
  checkin: "Check in",
  schedule: "Schedule",
  casestudy: "Case study",
  forum: "Q&A",
  profile: "My profile",
};

type NavItem = {
  id: PortalTabId;
  label: string;
  section?: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", section: "Main" },
  { id: "grades", label: "Grades" },
  { id: "assignments", label: "Assignments" },
  { id: "materials", label: "Study materials" },
  { id: "checkin", label: "Check in", section: "Sessions" },
  { id: "schedule", label: "Schedule", section: "Analyst Program" },
  { id: "casestudy", label: "Case study" },
  { id: "forum", label: "Q&A" },
  { id: "profile", label: "My profile" },
];

export default function PortalShell({
  email,
  activeTab,
  dashboard,
  children,
}: {
  email: string | null;
  activeTab: PortalTabId;
  dashboard: DashboardSummary;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function hrefForTab(id: PortalTabId) {
    const params = new URLSearchParams();
    params.set("tab", id);
    const qs = params.toString();
    return `${pathname}?${qs}`;
  }

  let lastSection: string | undefined;

  return (
    <div className="portal-root">
      <div className="portal-layout">
        <aside className="portal-sidebar">
          <div className="portal-sb-header">
            <div className="portal-sb-logo">GTRE</div>
            <div className="portal-sb-user">{email ?? "Member"}</div>
          </div>
          <nav className="portal-sb-nav" aria-label="Portal navigation">
            {NAV_ITEMS.map((item) => {
              const sectionHeader =
                item.section && item.section !== lastSection ? (
                  <div
                    key={`section-${item.section}`}
                    className="portal-sb-section-label"
                  >
                    {item.section}
                  </div>
                ) : null;
              if (item.section) lastSection = item.section;

              return (
                <span key={item.id}>
                  {sectionHeader}
                  <Link
                    href={hrefForTab(item.id)}
                    className={`portal-nav-item${activeTab === item.id ? " active" : ""}`}
                  >
                    <span className="portal-nav-label">{item.label}</span>
                  </Link>
                </span>
              );
            })}
          </nav>
          <div className="portal-sb-footer">
            <span className="portal-semester-pill">Spring 2026</span>
          </div>
        </aside>

        <div className="portal-main">
          <header className="portal-topbar">
            <div className="portal-topbar-title">{TAB_TITLES[activeTab]}</div>
            <div className="portal-topbar-actions">
              <span className="portal-pill">
                <b>{dashboard.completionPct}%</b> complete
              </span>
              <span className="portal-pill">
                <b>{dashboard.avgQuizLabel}</b> avg score
              </span>
              <MemberAuth
                initialLoggedIn
                initialEmail={email}
                variant="compact"
              />
            </div>
          </header>
          <div className="portal-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
