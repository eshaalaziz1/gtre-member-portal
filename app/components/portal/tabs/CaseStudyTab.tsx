import {
  RESOURCE_TYPE_LABELS,
  type CaseStudyResource,
} from "@/lib/caseStudy";

export default function CaseStudyTab({
  resources,
}: {
  resources: CaseStudyResource[];
}) {
  return (
    <div>
      <div className="portal-section-label">Case study resources</div>
      <div className="portal-resource-grid">
        {resources.map((r) => (
          <a
            key={r.id}
            className="portal-res-card"
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="portal-res-icon navy">
              <span>📎</span>
            </div>
            <div>
              <span className={`portal-res-tag ${r.resourceType}`}>
                {RESOURCE_TYPE_LABELS[r.resourceType]}
              </span>
              <div className="portal-res-name">{r.title}</div>
              <div className="portal-res-type">{r.description}</div>
            </div>
          </a>
        ))}
      </div>
      <div className="portal-section-label" style={{ marginTop: 20 }}>
        After case study presentations
      </div>
      <div className="portal-fund-coming-soon">
        <span className="portal-fund-badge">Coming soon</span>
        <div className="portal-fund-title">GTRE Investment Fund</div>
        <p>
          Following analyst case study presentations on{" "}
          <strong>April 27</strong>, selected members may be invited to
          participate in the GTRE Investment Fund — a hands-on opportunity
          that builds on your case study work. Stay tuned for details after
          presentations.
        </p>
      </div>
    </div>
  );
}
