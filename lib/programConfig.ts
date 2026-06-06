export const PROGRAM_SEMESTER = "Spring 2026";

export type ProgramAssignment = {
  id: string;
  title: string;
  description: string;
  due: string;
};

export type ProgramWeek = {
  id: number;
  date: string;
  event: {
    name: string;
    date: string;
    time: string;
    location: string;
  };
  assignments: ProgramAssignment[];
  hasQuiz: boolean;
  quizModuleId?: string;
  quizLabel?: string;
};

export type ProgramModule = {
  num: string;
  title: string;
  status: "done" | "active" | "locked";
  hasQuiz?: boolean;
  quizModuleId?: string;
};

export const PROGRAM_WEEKS: ProgramWeek[] = [
  {
    id: 1,
    date: "Jan 29",
    event: {
      name: "Spring Kickoff Event",
      date: "2026-01-29",
      time: "6:00 PM",
      location: "Star Metals Offices",
    },
    assignments: [],
    hasQuiz: false,
  },
  {
    id: 2,
    date: "Feb 3",
    event: {
      name: "Careers in CRE Finance",
      date: "2026-02-03",
      time: "6:30 PM",
      location: "Scheller",
    },
    assignments: [
      {
        id: "a1",
        title: "CRE Finance Reflection",
        description:
          "Write a 1-page reflection on the careers in CRE finance panel. What role interests you most and why?",
        due: "2026-02-10",
      },
    ],
    hasQuiz: false,
  },
  {
    id: 3,
    date: "Feb 5",
    event: {
      name: "Private Equity Panel",
      date: "2026-02-05",
      time: "5:00 PM",
      location: "Caddell",
    },
    assignments: [
      {
        id: "a2",
        title: "PE Case Study Analysis",
        description:
          "Analyze the provided PE deal case study. Submit your financial model and 1-page memo.",
        due: "2026-02-12",
      },
    ],
    hasQuiz: false,
  },
  {
    id: 4,
    date: "Feb 12",
    event: {
      name: "Affordable Housing Panel",
      date: "2026-02-12",
      time: "5:00 PM",
      location: "Caddell",
    },
    assignments: [],
    hasQuiz: false,
  },
  {
    id: 5,
    date: "Feb 19",
    event: {
      name: "Industrial Real Estate Panel",
      date: "2026-02-19",
      time: "5:00 PM",
      location: "Caddell",
    },
    assignments: [
      {
        id: "a3",
        title: "Industrial Market Report",
        description:
          "Research and submit a 2-page market report on an industrial submarket of your choice.",
        due: "2026-02-26",
      },
    ],
    hasQuiz: false,
  },
  {
    id: 6,
    date: "Feb 23",
    event: {
      name: "RangeWater Recruiting Presentation",
      date: "2026-02-23",
      time: "5:30 PM",
      location: "Caddell",
    },
    assignments: [],
    hasQuiz: false,
  },
  {
    id: 7,
    date: "Feb 26",
    event: {
      name: "Tech and AI in CRE",
      date: "2026-02-26",
      time: "5:00 PM",
      location: "Caddell",
    },
    assignments: [
      {
        id: "a4",
        title: "PropTech Analysis",
        description:
          "Identify a PropTech company and present how it disrupts traditional real estate. Submit a slide deck (5-8 slides).",
        due: "2026-03-05",
      },
    ],
    hasQuiz: false,
  },
  {
    id: 8,
    date: "Mar 5",
    event: {
      name: "Real Estate Capital Markets Panel",
      date: "2026-03-05",
      time: "5:00 PM",
      location: "Caddell",
    },
    assignments: [],
    hasQuiz: true,
    quizModuleId: "5436f522-b2ec-415d-896f-ccab9c45022c",
    quizLabel: "Capital Markets & Financing Quiz",
  },
  {
    id: 9,
    date: "Mar 9",
    event: {
      name: "Hospitality Panel",
      date: "2026-03-09",
      time: "6:30 PM",
      location: "Caddell",
    },
    assignments: [
      {
        id: "a5",
        title: "Hotel Underwriting Exercise",
        description:
          "Complete the hotel underwriting template provided. Submit your completed Excel model.",
        due: "2026-03-16",
      },
    ],
    hasQuiz: false,
  },
  {
    id: 10,
    date: "Mar 12",
    event: {
      name: "Joint Real Estate Conference",
      date: "2026-03-12",
      time: "1:00 PM",
      location: "The Foundry",
    },
    assignments: [],
    hasQuiz: false,
  },
  {
    id: 11,
    date: "Apr 2",
    event: {
      name: "Development Panel",
      date: "2026-04-02",
      time: "5:00 PM",
      location: "Caddell",
    },
    assignments: [
      {
        id: "a6",
        title: "Development Pro Forma",
        description:
          "Build a basic development pro forma for a hypothetical multifamily project.",
        due: "2026-04-09",
      },
    ],
    hasQuiz: false,
  },
  {
    id: 12,
    date: "Apr 9",
    event: {
      name: "Acquisitions Panel",
      date: "2026-04-09",
      time: "5:00 PM",
      location: "Caddell",
    },
    assignments: [],
    hasQuiz: false,
  },
  {
    id: 13,
    date: "Apr 16",
    event: {
      name: "Entrepreneurship & Personal RE Investing",
      date: "2026-04-16",
      time: "5:00 PM",
      location: "Caddell",
    },
    assignments: [
      {
        id: "a7",
        title: "Personal Investment Thesis",
        description: "Write a 2-page personal real estate investment thesis.",
        due: "2026-04-23",
      },
    ],
    hasQuiz: false,
  },
];

export const PROGRAM_MODULES: ProgramModule[] = [
  { num: "01", title: "CRE Fundamentals", status: "done" },
  { num: "02", title: "Networking & Professionalism", status: "done" },
  { num: "03", title: "Excel for Real Estate", status: "active" },
  {
    num: "04",
    title: "Capital Markets & Financing",
    status: "active",
    hasQuiz: true,
    quizModuleId: "5436f522-b2ec-415d-896f-ccab9c45022c",
  },
  { num: "05", title: "Leasing & Brokerage", status: "locked" },
  { num: "06", title: "Case Study", status: "locked" },
];

export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export function isPastDate(date: string): boolean {
  return date < todayIso();
}

export function findCurrentWeek(weeks: ProgramWeek[] = PROGRAM_WEEKS): ProgramWeek {
  const today = todayIso();
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].event.date <= today) return weeks[i];
  }
  return weeks[0];
}

export function getAssignmentById(
  id: string,
  weeks: ProgramWeek[] = PROGRAM_WEEKS,
): ProgramAssignment | undefined {
  for (const week of weeks) {
    const found = week.assignments.find((a) => a.id === id);
    if (found) return found;
  }
  return undefined;
}

export type AssignmentOverridePatch = {
  assignmentId: string;
  title?: string;
  description?: string;
  due?: string;
};

export function applyAssignmentOverrides(
  weeks: ProgramWeek[],
  overrides: AssignmentOverridePatch[],
): ProgramWeek[] {
  const byId = new Map(overrides.map((o) => [o.assignmentId, o]));
  if (byId.size === 0) return weeks;

  return weeks.map((week) => ({
    ...week,
    assignments: week.assignments.map((assignment) => {
      const patch = byId.get(assignment.id);
      if (!patch) return assignment;
      return {
        ...assignment,
        title: patch.title?.trim() || assignment.title,
        description: patch.description?.trim() || assignment.description,
        due: patch.due?.trim() || assignment.due,
      };
    }),
  }));
}

export function formatDisplayDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatShortDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
