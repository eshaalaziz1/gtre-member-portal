/**
 * Analyst program schedule — edit here and deploy to Vercel.
 * Member-specific data (profile, submissions, forum) stays in Wix CMS via the SDK.
 */

export const SCHEDULE_SEMESTER = "Spring 2026";

export type ScheduleEvent = {
  id: string;
  eventDate: string;
  title: string;
  location: string;
  eventType: "session" | "case-study";
};

/** Ordered list of Monday analyst sessions. */
export const ANALYST_SCHEDULE: ScheduleEvent[] = [
  {
    id: "feb-2",
    eventDate: "Mon, Feb 2nd",
    title: "CRE Overview",
    location: "Caddell",
    eventType: "session",
  },
  {
    id: "feb-9",
    eventDate: "Mon, Feb 9th",
    title: "Networking & Professionalism",
    location: "Caddell",
    eventType: "session",
  },
  {
    id: "feb-16",
    eventDate: "Mon, Feb 16th",
    title: "Introduction to Excel",
    location: "Caddell",
    eventType: "session",
  },
  {
    id: "feb-23",
    eventDate: "Mon, Feb 23rd",
    title: "Capital Markets & Financing",
    location: "Caddell",
    eventType: "session",
  },
  {
    id: "mar-2",
    eventDate: "Mon, Mar 2nd",
    title: "Leasing / Brokerage",
    location: "Caddell",
    eventType: "session",
  },
  {
    id: "mar-16",
    eventDate: "Mon, Mar 16th",
    title: "Development & Construction",
    location: "Caddell",
    eventType: "session",
  },
  {
    id: "mar-30",
    eventDate: "Mon, Mar 30th",
    title: "Financial Modeling & Underwriting",
    location: "Caddell",
    eventType: "session",
  },
  {
    id: "apr-6",
    eventDate: "Mon, Apr 6th",
    title: "Case Study Breakout Session",
    location: "Caddell",
    eventType: "case-study",
  },
  {
    id: "apr-13",
    eventDate: "Mon, Apr 13th",
    title: "Case Study Office Hours",
    location: "Caddell",
    eventType: "case-study",
  },
  {
    id: "apr-27",
    eventDate: "Mon, Apr 27th",
    title: "Analyst Case Study Presentations",
    location: "Caddell",
    eventType: "case-study",
  },
];

export type ScheduleResult = {
  events: ScheduleEvent[];
  semester: string;
};

export function getSchedule(): ScheduleResult {
  return {
    events: ANALYST_SCHEDULE,
    semester: SCHEDULE_SEMESTER,
  };
}
