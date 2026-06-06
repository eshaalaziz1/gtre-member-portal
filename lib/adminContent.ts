import { extractItemFields, fieldNumber, fieldString } from "./dataItems";
import {
  applyAssignmentOverrides,
  PROGRAM_WEEKS,
  type ProgramWeek,
} from "./programConfig";
import type { AuthenticatedClient } from "./wixSession";
import { getAuthenticatedClientWithEmail } from "./wixSession";
import type { CaseStudyResource } from "./caseStudy";
import { CASE_STUDY_RESOURCES } from "./caseStudy";
import type { ExternalTool, StudySlide } from "./materials";
import { EXTERNAL_TOOLS, PLACEHOLDER_SLIDES, STUDY_SLIDES } from "./materials";

const OVERRIDES_COLLECTION = "AssignmentOverrides";
const RESOURCES_COLLECTION = "PortalResources";

export type AssignmentOverride = {
  id: string;
  assignmentId: string;
  title: string;
  description: string;
  due: string;
};

export type PortalResource = {
  id: string;
  title: string;
  section: "materials-slides" | "materials-tools" | "casestudy";
  resourceType: string;
  description: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
};

function mapOverride(item: Record<string, unknown>): AssignmentOverride {
  const data = extractItemFields(item);
  return {
    id: String(item._id ?? ""),
    assignmentId: fieldString(data.assignmentId),
    title: fieldString(data.title),
    description: fieldString(data.description),
    due: fieldString(data.due),
  };
}

function mapResource(item: Record<string, unknown>): PortalResource {
  const data = extractItemFields(item);
  const section = fieldString(data.section);
  return {
    id: String(item._id ?? ""),
    title: fieldString(data.title),
    section:
      section === "materials-tools" || section === "casestudy"
        ? section
        : "materials-slides",
    resourceType: fieldString(data.resourceType) || "link",
    description: fieldString(data.description),
    url: fieldString(data.url),
    sortOrder: fieldNumber(data.sortOrder) ?? 999,
    isActive: data.isActive !== false,
  };
}

export async function loadAssignmentOverrides(
  auth: AuthenticatedClient,
): Promise<AssignmentOverride[]> {
  try {
    const results = await auth.client.items
      .query(OVERRIDES_COLLECTION)
      .limit(100)
      .find();
    return results.items.map((item) =>
      mapOverride(item as Record<string, unknown>),
    );
  } catch (error) {
    console.error("[AdminContent] Overrides load failed:", error);
    return [];
  }
}

export async function loadPortalResources(
  auth: AuthenticatedClient,
): Promise<PortalResource[]> {
  try {
    const results = await auth.client.items
      .query(RESOURCES_COLLECTION)
      .ascending("sortOrder")
      .limit(200)
      .find();
    return results.items
      .map((item) => mapResource(item as Record<string, unknown>))
      .filter((r) => r.isActive);
  } catch (error) {
    console.error("[AdminContent] Resources load failed:", error);
    return [];
  }
}

export function mergeProgramWeeks(overrides: AssignmentOverride[]): ProgramWeek[] {
  const patchById = new Map(
    overrides
      .filter((o) => o.assignmentId)
      .map((o) => [o.assignmentId, o]),
  );
  if (patchById.size === 0) return PROGRAM_WEEKS;

  return applyAssignmentOverrides(
    PROGRAM_WEEKS,
    [...patchById.values()].map((o) => ({
      assignmentId: o.assignmentId,
      title: o.title || undefined,
      description: o.description || undefined,
      due: o.due || undefined,
    })),
  );
}

export function mergeMaterialsResources(resources: PortalResource[]): {
  slides: StudySlide[];
  tools: ExternalTool[];
  placeholders: string[];
  caseStudy: CaseStudyResource[];
} {
  const cmsSlides = resources
    .filter((r) => r.section === "materials-slides")
    .map((r) => ({
      title: r.title,
      week: r.description || "Added by admin",
      url: r.url,
    }));

  const cmsTools = resources
    .filter((r) => r.section === "materials-tools")
    .map((r) => ({
      title: r.title,
      type: r.description || r.resourceType,
      url: r.url,
      iconBg: "#003057",
    }));

  const cmsCaseStudy = resources
    .filter((r) => r.section === "casestudy")
    .map((r, i) => ({
      id: r.id,
      sortOrder: r.sortOrder || i + 100,
      title: r.title,
      description: r.description,
      resourceType: (["guide", "example", "model", "link"].includes(r.resourceType)
        ? r.resourceType
        : "link") as CaseStudyResource["resourceType"],
      url: r.url,
    }));

  return {
    slides: [...STUDY_SLIDES, ...cmsSlides],
    tools: [...EXTERNAL_TOOLS, ...cmsTools],
    placeholders: PLACEHOLDER_SLIDES,
    caseStudy: [...CASE_STUDY_RESOURCES, ...cmsCaseStudy].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    ),
  };
}

export async function saveAssignmentOverride(
  auth: AuthenticatedClient,
  input: {
    assignmentId: string;
    title: string;
    description: string;
    due: string;
    existingId?: string;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const payload = {
      assignmentId: input.assignmentId,
      title: input.title.trim(),
      description: input.description.trim(),
      due: input.due.trim(),
      updatedAt: new Date().toISOString(),
      updatedBy: auth.email,
    };

    if (input.existingId) {
      await auth.client.items.update(OVERRIDES_COLLECTION, {
        _id: input.existingId,
        ...payload,
      });
    } else {
      const existing = await auth.client.items
        .query(OVERRIDES_COLLECTION)
        .eq("assignmentId", input.assignmentId)
        .limit(1)
        .find();

      if (existing.items.length > 0) {
        await auth.client.items.update(OVERRIDES_COLLECTION, {
          _id: String(existing.items[0]._id),
          ...payload,
        });
      } else {
        await auth.client.items.insert(OVERRIDES_COLLECTION, payload);
      }
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save assignment.",
    };
  }
}

export async function savePortalResource(
  auth: AuthenticatedClient,
  input: {
    id?: string;
    title: string;
    section: PortalResource["section"];
    resourceType: string;
    description: string;
    url: string;
    sortOrder: number;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const payload = {
      title: input.title.trim(),
      section: input.section,
      resourceType: input.resourceType.trim() || "link",
      description: input.description.trim(),
      url: input.url.trim(),
      sortOrder: input.sortOrder,
      isActive: true,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.email,
    };

    if (input.id) {
      await auth.client.items.update(RESOURCES_COLLECTION, {
        _id: input.id,
        ...payload,
      });
    } else {
      await auth.client.items.insert(RESOURCES_COLLECTION, payload);
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save resource.",
    };
  }
}

export async function deactivatePortalResource(
  auth: AuthenticatedClient,
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await auth.client.items.update(RESOURCES_COLLECTION, {
      _id: id,
      isActive: false,
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not remove resource.",
    };
  }
}

export async function loadMemberPortalContent(sessionValue: string | undefined): Promise<{
  programWeeks: ProgramWeek[];
  materials: ReturnType<typeof mergeMaterialsResources>;
}> {
  const auth = await getAuthenticatedClientWithEmail(sessionValue);
  if (!auth) {
    return {
      programWeeks: PROGRAM_WEEKS,
      materials: mergeMaterialsResources([]),
    };
  }

  const [overrides, resources] = await Promise.all([
    loadAssignmentOverrides(auth),
    loadPortalResources(auth),
  ]);

  return {
    programWeeks: mergeProgramWeeks(overrides),
    materials: mergeMaterialsResources(resources),
  };
}
