"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  adminDeleteResourceAction,
  adminSaveResourceAction,
} from "@/app/actions/admin";
import type { PortalResource } from "@/lib/adminContent";

const SECTION_LABELS: Record<PortalResource["section"], string> = {
  "materials-slides": "Materials · Slides",
  "materials-tools": "Materials · Tools",
  casestudy: "Case study",
};

export default function AdminResourcesTab({
  resources,
}: {
  resources: PortalResource[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState("");
  const [title, setTitle] = useState("");
  const [section, setSection] =
    useState<PortalResource["section"]>("materials-slides");
  const [resourceType, setResourceType] = useState("link");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(100);

  return (
    <div>
      <p className="admin-lead">
        Add links to slides, tools, or case study files. Paste a URL from Wix
        Media, Google Drive, or Teams. Resources appear on the member portal
        alongside built-in defaults.
      </p>

      <form
        className="admin-card"
        onSubmit={(e) => {
          e.preventDefault();
          setFormError("");
          startTransition(async () => {
            const result = await adminSaveResourceAction({
              title,
              section,
              resourceType,
              description,
              url,
              sortOrder,
            });
            if (result.ok) {
              setTitle("");
              setDescription("");
              setUrl("");
              router.refresh();
            } else {
              setFormError(result.error);
            }
          });
        }}
      >
        <div className="admin-card-hdr">
          <strong>Add resource</strong>
        </div>
        <label className="portal-form-label">Title</label>
        <input
          className="portal-form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="portal-form-label">Section</label>
        <select
          className="portal-form-select"
          value={section}
          onChange={(e) =>
            setSection(e.target.value as PortalResource["section"])
          }
        >
          <option value="materials-slides">Materials · Session slides</option>
          <option value="materials-tools">Materials · External tools</option>
          <option value="casestudy">Case study resources</option>
        </select>
        <label className="portal-form-label">Type label</label>
        <input
          className="portal-form-input"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
          placeholder="link, guide, example, model…"
        />
        <label className="portal-form-label">Description / subtitle</label>
        <input
          className="portal-form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="portal-form-label">URL</label>
        <input
          className="portal-form-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <label className="portal-form-label">Sort order</label>
        <input
          className="portal-form-input"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
        />
        {formError && <div className="portal-form-error">{formError}</div>}
        <button type="submit" className="portal-btn-primary" disabled={pending}>
          Add resource
        </button>
      </form>

      <div className="portal-section-label" style={{ marginTop: 24 }}>
        Active resources ({resources.length})
      </div>
      {resources.length === 0 ? (
        <p className="portal-empty">No CMS resources yet — defaults still show on portal.</p>
      ) : (
        resources.map((r) => (
          <div key={r.id} className="admin-card admin-resource-row">
            <div>
              <strong>{r.title}</strong>
              <div className="admin-muted">
                {SECTION_LABELS[r.section]} · {r.resourceType}
              </div>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                {r.url}
              </a>
            </div>
            <button
              type="button"
              className="portal-btn-text admin-danger"
              disabled={pending}
              onClick={() => {
                if (!confirm(`Remove "${r.title}"?`)) return;
                startTransition(async () => {
                  await adminDeleteResourceAction(r.id);
                  router.refresh();
                });
              }}
            >
              Remove
            </button>
          </div>
        ))
      )}

      <div className="admin-note" style={{ marginTop: 24 }}>
        <strong>Wix setup:</strong> Create CMS collections{" "}
        <code>AssignmentOverrides</code> (fields: assignmentId, title, description,
        due, updatedAt, updatedBy) and <code>PortalResources</code> (fields: title,
        section, resourceType, description, url, sortOrder, isActive, updatedAt,
        updatedBy). Grant site members read/write access, or restrict writes to
        your admin account in Wix permissions.
      </div>
    </div>
  );
}
