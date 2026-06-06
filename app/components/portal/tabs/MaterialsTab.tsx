import type { StudySlide, ExternalTool } from "@/lib/materials";

export default function MaterialsTab({
  slides,
  tools,
  placeholders,
}: {
  slides: StudySlide[];
  tools: ExternalTool[];
  placeholders: string[];
}) {
  return (
    <div>
      <div className="portal-section-label">Session slides</div>
      <div className="portal-resource-grid">
        {slides.map((s) => (
          <a
            key={`${s.title}-${s.url}`}
            className="portal-res-card"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="portal-res-icon navy">
              <span>📄</span>
            </div>
            <div>
              <div className="portal-res-name">{s.title}</div>
              <div className="portal-res-type">{s.week} · PowerPoint</div>
            </div>
          </a>
        ))}
        {placeholders.map((title) => (
          <div key={title} className="portal-res-card disabled">
            <div className="portal-res-icon gray">
              <span>📄</span>
            </div>
            <div>
              <div className="portal-res-name">{title}</div>
              <div className="portal-res-type">Not uploaded yet</div>
            </div>
          </div>
        ))}
      </div>
      <div className="portal-section-label" style={{ marginTop: 20 }}>
        External tools
      </div>
      <div className="portal-resource-grid">
        {tools.map((tool) => (
          <a
            key={`${tool.title}-${tool.url}`}
            className="portal-res-card"
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className="portal-res-icon"
              style={{ background: tool.iconBg }}
            >
              <span>↗</span>
            </div>
            <div>
              <div className="portal-res-name">{tool.title}</div>
              <div className="portal-res-type">{tool.type}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
