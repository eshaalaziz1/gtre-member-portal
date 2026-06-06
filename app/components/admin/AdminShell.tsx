"use client";

import Link from "next/link";
import MemberAuth from "../MemberAuth";

export type AdminSectionId =
  | "overview"
  | "submissions"
  | "forum"
  | "assignments"
  | "resources";

const SECTION_TITLES: Record<AdminSectionId, string> = {
  overview: "Overview",
  submissions: "Submissions",
  forum: "Q&A Forum",
  assignments: "Assignments",
  resources: "Resources",
};

const NAV_ITEMS: { id: AdminSectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "submissions", label: "Submissions" },
  { id: "forum", label: "Forum Q&A" },
  { id: "assignments", label: "Assignments" },
  { id: "resources", label: "Resources" },
];

function hrefForSection(id: AdminSectionId) {
  return `/admin?section=${id}`;
}

export default function AdminShell({
  email,
  activeSection,
  counts,
  children,
}: {
  email: string;
  activeSection: AdminSectionId;
  counts: { submissions: number; openQuestions: number };
  children: React.ReactNode;
}) {
  return (
    <div className="portal-root">
      <div className="portal-layout">
        <aside className="portal-sidebar admin-sidebar">
          <div className="portal-sb-header">
            <div className="portal-sb-logo">GTRE ADMIN</div>
            <div className="portal-sb-user">{email}</div>
          </div>
          <nav className="portal-sb-nav">
            <div className="portal-sb-section-label">Manage</div>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={hrefForSection(item.id)}
                className={`portal-nav-item${activeSection === item.id ? " active" : ""}`}
              >
                <span>{item.label}</span>
                {item.id === "submissions" && counts.submissions > 0 && (
                  <span className="admin-nav-badge">{counts.submissions}</span>
                )}
                {item.id === "forum" && counts.openQuestions > 0 && (
                  <span className="admin-nav-badge">{counts.openQuestions}</span>
                )}
              </Link>
            ))}
            <div className="portal-sb-section-label">Portal</div>
            <Link href="/" className="portal-nav-item">
              <span>← Member portal</span>
            </Link>
          </nav>
          <div className="portal-sb-footer">
            <div className="portal-semester-pill">Admin</div>
          </div>
        </aside>
        <main className="portal-main">
          <header className="portal-topbar">
            <h1>{SECTION_TITLES[activeSection]}</h1>
            <div className="portal-topbar-actions">
              <MemberAuth variant="compact" initialLoggedIn initialEmail={email} />
            </div>
          </header>
          <div className="portal-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
