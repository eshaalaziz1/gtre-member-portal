import { cookies } from "next/headers";
import { Suspense } from "react";
import AdminAccessDenied from "@/app/components/admin/AdminAccessDenied";
import AdminShell, {
  type AdminSectionId,
} from "@/app/components/admin/AdminShell";
import AdminAssignmentsTab from "@/app/components/admin/tabs/AdminAssignmentsTab";
import AdminForumTab from "@/app/components/admin/tabs/AdminForumTab";
import AdminOverviewTab from "@/app/components/admin/tabs/AdminOverviewTab";
import AdminResourcesTab from "@/app/components/admin/tabs/AdminResourcesTab";
import AdminSubmissionsTab from "@/app/components/admin/tabs/AdminSubmissionsTab";
import { requireAdmin } from "@/lib/admin";
import {
  loadAssignmentOverrides,
  loadPortalResources,
  mergeProgramWeeks,
} from "@/lib/adminContent";
import { getAdminForumDetail, getAllForumQuestions } from "@/lib/adminForum";
import {
  getAllAssignmentSubmissions,
  getAllQuizAndCheckinSubmissions,
} from "@/lib/adminSubmissions";
import { PROGRAM_WEEKS } from "@/lib/programConfig";
import { getSessionStatus } from "@/lib/session";

export const dynamic = "force-dynamic";

const SECTIONS: AdminSectionId[] = [
  "overview",
  "submissions",
  "forum",
  "assignments",
  "resources",
];

function parseSection(value: string | undefined): AdminSectionId {
  if (value && SECTIONS.includes(value as AdminSectionId)) {
    return value as AdminSectionId;
  }
  return "overview";
}

async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; q?: string }>;
}) {
  const { section: sectionParam, q: questionId } = await searchParams;
  const sessionValue = (await cookies()).get("session")?.value;
  const { loggedIn, email } = await getSessionStatus(sessionValue);
  const admin = await requireAdmin(sessionValue);

  if (!admin) {
    return <AdminAccessDenied loggedIn={loggedIn} email={email} />;
  }

  const activeSection = parseSection(sectionParam);
  const authorName = admin.email.split("@")[0];

  const [
    assignmentSubmissions,
    quizCheckins,
    forumQuestions,
    overrides,
    resources,
  ] = await Promise.all([
    getAllAssignmentSubmissions(admin),
    getAllQuizAndCheckinSubmissions(admin),
    getAllForumQuestions(admin),
    loadAssignmentOverrides(admin),
    loadPortalResources(admin),
  ]);

  const forumDetail =
    activeSection === "forum" && questionId
      ? await getAdminForumDetail(admin, questionId)
      : null;

  const openQuestions = forumQuestions.filter((q) => !q.isAnswered).length;
  const programWeeks = mergeProgramWeeks(overrides);

  let content: React.ReactNode;

  switch (activeSection) {
    case "overview":
      content = (
        <AdminOverviewTab
          stats={{
            assignmentSubmissions: assignmentSubmissions.length,
            quizSubmissions: quizCheckins.quizzes.length,
            checkins: quizCheckins.checkins.length,
            openQuestions,
            assignmentCount: programWeeks.flatMap((w) => w.assignments).length,
            resourceCount: resources.length,
          }}
        />
      );
      break;
    case "submissions":
      content = (
        <AdminSubmissionsTab
          assignments={assignmentSubmissions}
          quizzes={quizCheckins.quizzes}
          checkins={quizCheckins.checkins}
        />
      );
      break;
    case "forum":
      content = (
        <AdminForumTab
          questions={forumDetail ? [] : forumQuestions}
          detail={forumDetail}
          authorName={authorName}
        />
      );
      break;
    case "assignments":
      content = (
        <AdminAssignmentsTab weeks={PROGRAM_WEEKS} overrides={overrides} />
      );
      break;
    case "resources":
      content = <AdminResourcesTab resources={resources} />;
      break;
    default:
      content = null;
  }

  return (
    <AdminShell
      email={admin.email}
      activeSection={activeSection}
      counts={{
        submissions: assignmentSubmissions.length,
        openQuestions,
      }}
    >
      {content}
    </AdminShell>
  );
}

export default function Admin(props: {
  searchParams: Promise<{ section?: string; q?: string }>;
}) {
  return (
    <Suspense
      fallback={<div className="portal-root portal-login">Loading admin…</div>}
    >
      <AdminPage searchParams={props.searchParams} />
    </Suspense>
  );
}
