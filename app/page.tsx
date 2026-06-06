import { cookies } from "next/headers";
import { Suspense } from "react";
import PortalLogin from "./components/portal/PortalLogin";
import PortalShell, { type PortalTabId } from "./components/portal/PortalShell";
import AssignmentsTab from "./components/portal/tabs/AssignmentsTab";
import CaseStudyTab from "./components/portal/tabs/CaseStudyTab";
import CheckInTab from "./components/portal/tabs/CheckInTab";
import ForumTab from "./components/portal/tabs/ForumTab";
import GradesTab from "./components/portal/tabs/GradesTab";
import HomeTab from "./components/portal/tabs/HomeTab";
import MaterialsTab from "./components/portal/tabs/MaterialsTab";
import ProfileTab from "./components/portal/tabs/ProfileTab";
import ScheduleTab from "./components/portal/tabs/ScheduleTab";
import { isAdminEmail } from "@/lib/admin";
import { loadMemberPortalContent } from "@/lib/adminContent";
import {
  getAnalystProfile,
  isExecutiveBoardRole,
} from "@/lib/analystMembers";
import {
  buildAssignmentLists,
  buildDashboard,
  buildGradeRows,
} from "@/lib/dashboard";
import {
  getForumQuestionDetail,
  getForumQuestionsForMember,
} from "@/lib/forum";
import { getMemberActivity } from "@/lib/memberActivity";
import { findCurrentWeek, PROGRAM_WEEKS } from "@/lib/programConfig";
import { getSchedule } from "@/lib/schedule";
import { getSessionStatus } from "@/lib/session";

export const dynamic = "force-dynamic";

const ALL_TABS: PortalTabId[] = [
  "home",
  "grades",
  "assignments",
  "materials",
  "checkin",
  "schedule",
  "casestudy",
  "forum",
  "profile",
];

function parseTab(value: string | undefined): PortalTabId {
  if (value && ALL_TABS.includes(value as PortalTabId)) {
    return value as PortalTabId;
  }
  return "home";
}

function totalActivityCount(weeks = PROGRAM_WEEKS): number {
  const assignmentCount = weeks.reduce((n, w) => n + w.assignments.length, 0);
  return weeks.length + assignmentCount;
}

function activityDoneCount(activity: Awaited<ReturnType<typeof getMemberActivity>>) {
  if (!activity) return 0;
  return (
    activity.checkinWeekIds.length +
    activity.submittedAssignmentIds.length +
    Object.keys(activity.quizScores).length
  );
}

async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; tab?: string; q?: string }>;
}) {
  const { error, tab: tabParam, q: questionId } = await searchParams;
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("session")?.value;
  const { loggedIn, email } = await getSessionStatus(sessionValue);

  if (!loggedIn) {
    return <PortalLogin errorMessage={error} />;
  }

  const activeTab = parseTab(tabParam);
  const portalContent = await loadMemberPortalContent(sessionValue);
  const programWeeks = portalContent.programWeeks;
  const activity = (await getMemberActivity(sessionValue))!;
  const profile = await getAnalystProfile(sessionValue);
  const isExecutiveBoard = isExecutiveBoardRole(profile?.role ?? "");
  const isAdmin = isAdminEmail(email);
  const dashboard = buildDashboard(activity, programWeeks);
  const authorName = email?.split("@")[0] ?? "Member";

  let tabContent: React.ReactNode;

  switch (activeTab) {
    case "home":
      tabContent = (
        <HomeTab email={email} dashboard={dashboard} activity={activity} />
      );
      break;
    case "grades": {
      const rows = buildGradeRows(activity, programWeeks);
      tabContent = (
        <GradesTab
          avgLabel={dashboard.avgQuizLabel}
          completionPct={dashboard.completionPct}
          doneCount={activityDoneCount(activity)}
          totalCount={totalActivityCount(programWeeks)}
          rows={rows}
        />
      );
      break;
    }
    case "assignments": {
      const lists = buildAssignmentLists(activity, programWeeks);
      tabContent = <AssignmentsTab due={lists.due} done={lists.done} />;
      break;
    }
    case "materials":
      tabContent = (
        <MaterialsTab
          slides={portalContent.materials.slides}
          tools={portalContent.materials.tools}
          placeholders={portalContent.materials.placeholders}
        />
      );
      break;
    case "checkin": {
      const week = findCurrentWeek(programWeeks);
      tabContent = (
        <CheckInTab
          week={week}
          alreadyCheckedIn={activity.checkinWeekIds.includes(String(week.id))}
        />
      );
      break;
    }
    case "schedule": {
      const schedule = getSchedule();
      tabContent = (
        <ScheduleTab events={schedule.events} semester={schedule.semester} />
      );
      break;
    }
    case "casestudy":
      tabContent = (
        <CaseStudyTab resources={portalContent.materials.caseStudy} />
      );
      break;
    case "forum": {
      const detail =
        questionId && !questionId.startsWith("local-")
          ? await getForumQuestionDetail(
              sessionValue,
              questionId,
              isExecutiveBoard,
            )
          : null;
      const questions = detail
        ? []
        : await getForumQuestionsForMember(sessionValue, isExecutiveBoard);
      tabContent = (
        <ForumTab
          initialQuestions={questions}
          authorName={authorName}
          detail={detail}
        />
      );
      break;
    }
    case "profile":
      tabContent = profile ? (
        <ProfileTab initialProfile={profile} />
      ) : (
        <p className="portal-empty">Could not load profile.</p>
      );
      break;
    default:
      tabContent = null;
  }

  return (
    <PortalShell
      email={email}
      activeTab={activeTab}
      dashboard={dashboard}
      isAdmin={isAdmin}
    >
      {tabContent}
    </PortalShell>
  );
}

export default function Home(props: {
  searchParams: Promise<{ error?: string; tab?: string; q?: string }>;
}) {
  return (
    <Suspense
      fallback={<div className="portal-root portal-login">Loading…</div>}
    >
      <PortalPage searchParams={props.searchParams} />
    </Suspense>
  );
}
