export type StudySlide = {
  title: string;
  week: string;
  url: string;
};

export type ExternalTool = {
  title: string;
  type: string;
  url: string;
  iconBg: string;
};

export const STUDY_SLIDES: StudySlide[] = [
  { title: "Leasing & Brokerage", week: "Week 5", url: "#" },
];

export const EXTERNAL_TOOLS: ExternalTool[] = [
  {
    title: "CoStar",
    type: "Market data",
    url: "https://www.costar.com",
    iconBg: "#1a6b3a",
  },
  {
    title: "ARGUS",
    type: "Financial modeling",
    url: "https://www.altusgroup.com/argus/",
    iconBg: "#c0392b",
  },
  {
    title: "REFM",
    type: "Excel courses",
    url: "https://courses.getrefm.com",
    iconBg: "#1a5276",
  },
  {
    title: "Alumni network",
    type: "250+ members",
    url: "https://www.linkedin.com/groups/14629021/",
    iconBg: "#0a66c2",
  },
];

export const PLACEHOLDER_SLIDES = [
  "CRE Fundamentals",
  "Excel for Real Estate",
  "Capital Markets",
];
