import type { MemberActivity } from "./memberActivity";
import {
  formatDisplayDate,
  formatShortDate,
  isPastDate,
  PROGRAM_MODULES,
  PROGRAM_WEEKS,
  findCurrentWeek,
  type ProgramAssignment,
  type ProgramModule,
  type ProgramWeek,
} from "./programConfig";

export type UpcomingItem = {
  dot: "gold" | "red" | "green";
  title: string;
  meta: string;
  tag: string;
  tagClass: "gold" | "red" | "green";
};

export type GradeRow = {
  name: string;
  score: string;
  scoreClass: "green" | "missing";
  status: "done" | "missing" | "submitted";
  label: string;
};

export type DashboardSummary = {
  avgQuizLabel: string;
  checkinCount: number;
  assignmentsDoneCount: number;
  dueSoonCount: number;
  completionPct: number;
  upcoming: UpcomingItem[];
  modules: ProgramModule[];
};

function allAssignments(): ProgramAssignment[] {
  return PROGRAM_WEEKS.flatMap((w) => w.assignments);
}

export function buildDashboard(activity: MemberActivity): DashboardSummary {
  const currentWeek = findCurrentWeek();
  const assignments = allAssignments();
  const quizScoreValues = Object.values(activity.quizScores);
  const avgQuizLabel =
    quizScoreValues.length > 0
      ? `${Math.round(
          quizScoreValues.reduce((s, v) => s + v, 0) / quizScoreValues.length,
        )}%`
      : "—";

  const dueSoonCount = assignments.filter(
    (a) =>
      !activity.submittedAssignmentIds.includes(a.id) && !isPastDate(a.due),
  ).length;

  const totalActivities = PROGRAM_WEEKS.length + assignments.length;
  const doneCount =
    activity.checkinWeekIds.length +
    activity.submittedAssignmentIds.length +
    Object.keys(activity.quizScores).length;
  const completionPct =
    totalActivities > 0
      ? Math.round((doneCount / totalActivities) * 100)
      : 0;

  const upcoming: UpcomingItem[] = [];

  if (!activity.checkinWeekIds.includes(String(currentWeek.id))) {
    upcoming.push({
      dot: "green",
      title: currentWeek.event.name,
      meta: `${formatDisplayDate(currentWeek.event.date)} · ${currentWeek.event.time} · ${currentWeek.event.location}`,
      tag: "Check in",
      tagClass: "green",
    });
  }

  if (
    currentWeek.hasQuiz &&
    currentWeek.quizModuleId &&
    activity.quizScores[currentWeek.quizModuleId] === undefined
  ) {
    upcoming.push({
      dot: "gold",
      title: currentWeek.quizLabel ?? "Module quiz",
      meta: "Due this week · 7 questions",
      tag: "Quiz",
      tagClass: "gold",
    });
  }

  for (const week of PROGRAM_WEEKS) {
    for (const a of week.assignments) {
      if (
        !activity.submittedAssignmentIds.includes(a.id) &&
        !isPastDate(a.due)
      ) {
        upcoming.push({
          dot: "red",
          title: a.title,
          meta: `Due ${formatDisplayDate(a.due)}`,
          tag: `Due ${formatShortDate(a.due)}`,
          tagClass: "red",
        });
      }
    }
  }

  return {
    avgQuizLabel,
    checkinCount: activity.checkinWeekIds.length,
    assignmentsDoneCount: activity.submittedAssignmentIds.length,
    dueSoonCount,
    completionPct,
    upcoming: upcoming.slice(0, 4),
    modules: PROGRAM_MODULES,
  };
}

export function buildGradeRows(activity: MemberActivity): GradeRow[] {
  const rows: GradeRow[] = [];

  for (const mod of PROGRAM_MODULES) {
    if (mod.hasQuiz && mod.quizModuleId) {
      const score = activity.quizScores[mod.quizModuleId];
      rows.push({
        name: `Module ${mod.num} Quiz`,
        score: score !== undefined ? `${score}%` : "—",
        scoreClass: score !== undefined ? "green" : "missing",
        status: score !== undefined ? "done" : "missing",
        label: score !== undefined ? "Graded" : "Not started",
      });
    }
  }

  for (const week of PROGRAM_WEEKS) {
    for (const a of week.assignments) {
      const done = activity.submittedAssignmentIds.includes(a.id);
      rows.push({
        name: a.title,
        score: "—",
        scoreClass: "missing",
        status: done ? "submitted" : "missing",
        label: done ? "Submitted" : "Not started",
      });
    }
  }

  return rows;
}

export type AssignmentListItem =
  | {
      kind: "assignment";
      assignment: ProgramAssignment;
      week: ProgramWeek;
      submitted: boolean;
    }
  | {
      kind: "quiz";
      week: ProgramWeek;
      submitted: boolean;
    };

export function buildAssignmentLists(activity: MemberActivity): {
  due: AssignmentListItem[];
  done: AssignmentListItem[];
} {
  const due: AssignmentListItem[] = [];
  const done: AssignmentListItem[] = [];

  for (const week of PROGRAM_WEEKS) {
    for (const a of week.assignments) {
      const item: AssignmentListItem = {
        kind: "assignment",
        assignment: a,
        week,
        submitted: activity.submittedAssignmentIds.includes(a.id),
      };
      if (item.submitted) done.push(item);
      else due.push(item);
    }
    if (
      week.hasQuiz &&
      week.quizModuleId &&
      activity.quizScores[week.quizModuleId] === undefined
    ) {
      due.push({
        kind: "quiz",
        week,
        submitted: false,
      });
    }
  }

  return { due, done };
}
