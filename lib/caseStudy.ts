export type CaseStudyResource = {
  id: string;
  sortOrder: number;
  title: string;
  description: string;
  resourceType: "guide" | "example" | "model" | "link";
  url: string;
};

const CASE_STUDY_URLS: Record<string, string> = {
  rubric:
    "https://c4871b33-d65c-4777-bdbf-dd0a126fa10e.usrfiles.com/ugd/c4871b_f00dbd380851490b90ca7036857ee53c.pdf",
  exampleExecutiveSummary:
    "https://c4871b33-d65c-4777-bdbf-dd0a126fa10e.usrfiles.com/ugd/c4871b_522d8c5943c044f68134f4421b4a4d97.pdf",
  exampleCaseStudy:
    "https://c4871b33-d65c-4777-bdbf-dd0a126fa10e.usrfiles.com/ugd/c4871b_57cfb47b76104660896f4bb7251d4e66.pptx",
  examplePresentation1:
    "https://c4871b33-d65c-4777-bdbf-dd0a126fa10e.usrfiles.com/ugd/c4871b_66767acb49f244d79bdb51c1cd4368af.pptx",
  executiveSummaryOption1:
    "https://c4871b33-d65c-4777-bdbf-dd0a126fa10e.usrfiles.com/ugd/c4871b_4f4a9e766988466cadfa68c1caba0385.pptx",
  modelCommercial:
    "https://c4871b33-d65c-4777-bdbf-dd0a126fa10e.usrfiles.com/ugd/c4871b_0693adf078c0445c96d32a3d5e11bc24.xlsx",
  modelIndustrial:
    "https://c4871b33-d65c-4777-bdbf-dd0a126fa10e.usrfiles.com/ugd/c4871b_fdd54b31499b461d95827ca663df263e.xlsx",
  modelMultifamily:
    "https://c4871b33-d65c-4777-bdbf-dd0a126fa10e.usrfiles.com/ugd/c4871b_57e79b3c63b04aa59144fe3cbe28d34c.xlsx",
  officeHoursTeams:
    "https://teams.microsoft.com/meet/24424379837266?p=rK0y1o973mUSorEtgB",
};

export const CASE_STUDY_RESOURCES: CaseStudyResource[] = [
  {
    id: "rubric",
    sortOrder: 1,
    title: "Case Study Rubric",
    description: "Grading criteria and expectations for your deliverables.",
    resourceType: "guide",
    url: CASE_STUDY_URLS.rubric,
  },
  {
    id: "example-exec",
    sortOrder: 2,
    title: "Example Executive Summary (PDF)",
    description: "Sample executive summary format and depth.",
    resourceType: "example",
    url: CASE_STUDY_URLS.exampleExecutiveSummary,
  },
  {
    id: "example-deck",
    sortOrder: 3,
    title: "Example Case Study (PowerPoint)",
    description: "Full example case study presentation deck.",
    resourceType: "example",
    url: CASE_STUDY_URLS.exampleCaseStudy,
  },
  {
    id: "example-pres",
    sortOrder: 4,
    title: "Example Presentation 1",
    description: "Additional reference presentation from a prior cohort.",
    resourceType: "example",
    url: CASE_STUDY_URLS.examplePresentation1,
  },
  {
    id: "exec-option",
    sortOrder: 5,
    title: "Executive Summary Option 1",
    description: "Alternate executive summary slide deck example.",
    resourceType: "example",
    url: CASE_STUDY_URLS.executiveSummaryOption1,
  },
  {
    id: "model-comm",
    sortOrder: 6,
    title: "Commercial Model (Excel)",
    description: "Fall 2024 commercial case study underwriting model.",
    resourceType: "model",
    url: CASE_STUDY_URLS.modelCommercial,
  },
  {
    id: "model-ind",
    sortOrder: 7,
    title: "Industrial Model (Excel)",
    description: "Industrial property case study model template.",
    resourceType: "model",
    url: CASE_STUDY_URLS.modelIndustrial,
  },
  {
    id: "model-mf",
    sortOrder: 8,
    title: "Multifamily Model (Excel)",
    description: "Multifamily case study model template.",
    resourceType: "model",
    url: CASE_STUDY_URLS.modelMultifamily,
  },
  {
    id: "office-hours",
    sortOrder: 9,
    title: "Case Study Office Hours (Teams)",
    description: "Join virtual office hours for case study questions.",
    resourceType: "link",
    url: CASE_STUDY_URLS.officeHoursTeams,
  },
];

export const RESOURCE_TYPE_LABELS: Record<
  CaseStudyResource["resourceType"],
  string
> = {
  guide: "Guide",
  example: "Example",
  model: "Excel model",
  link: "Live link",
};

export function getCaseStudyResources(): CaseStudyResource[] {
  return CASE_STUDY_RESOURCES;
}
