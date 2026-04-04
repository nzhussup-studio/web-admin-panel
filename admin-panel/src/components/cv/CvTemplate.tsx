import { type CSSProperties } from "react";

const THEME = {
  text: "#1f2933",
  muted: "#334e68",
  subtle: "#7b8794",
  border: "#d9e2ec",
  accent: "#0a558c",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "11.5px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 700,
  color: THEME.accent,
  borderBottom: `1px solid ${THEME.border}`,
  paddingBottom: "4px",
  marginBottom: "8px",
};

const twoColumnFlowStyle: CSSProperties = {
  columnCount: 2,
  columnGap: "12px",
};

const Section = ({ title, children }) => (
  <section
    style={{
      marginBottom: "9px",
    }}
  >
    <div style={sectionTitleStyle}>{title}</div>
    {children}
  </section>
);

const Item = ({
  title,
  subtitle = "",
  date,
  description,
  additionalInfo = "",
  techStack = "",
  subtitleInline = false,
}) => (
  <div
    style={{
      marginBottom: "8px",
      color: THEME.text,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "10px",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "11.5px" }}>{title}</div>
      <div
        style={{
          color: THEME.muted,
          fontSize: "10.5px",
          fontStyle: "italic",
          whiteSpace: "nowrap",
        }}
      >
        {date}
      </div>
    </div>

    {!subtitleInline && subtitle && (
      <div style={{ marginTop: "2px", color: THEME.muted, fontSize: "10.8px" }}>
        {subtitle}
      </div>
    )}

    {description && (
      <div
        style={{
          marginTop: "3px",
          lineHeight: 1.35,
          textAlign: "justify",
          whiteSpace: "pre-line",
        }}
      >
        {description}
      </div>
    )}

    {additionalInfo && (
      <div style={{ marginTop: "2px", lineHeight: 1.25, color: THEME.muted }}>
        {additionalInfo}
      </div>
    )}

    {techStack && (
      <div style={{ marginTop: "3px", lineHeight: 1.3, color: THEME.muted }}>
        <span
          style={{
            color: THEME.accent,
            fontWeight: 700,
            letterSpacing: "0.01em",
          }}
        >
          Tech Stack:
        </span>{" "}
        <span style={{ color: THEME.text, fontWeight: 600 }}>{techStack}</span>
      </div>
    )}
  </div>
);

const formatUrlLabel = (value) => {
  if (!value) {
    return "";
  }

  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsed = new URL(normalized);
    const host = parsed.host.replace(/^www\./i, "");
    const path = `${parsed.pathname || ""}${parsed.search || ""}${
      parsed.hash || ""
    }`.replace(/\/$/, "");

    if (!path || path === "/") {
      return host;
    }

    return `${host}${path}`;
  } catch {
    return value;
  }
};

const EXPORT_CONTENT_WIDTH = "8in";

const CvTemplate = ({ data, forExport = false }) => {
  const {
    basic_info = {},
    work_experience,
    education,
    skills,
    projects,
    certificates,
  } = data;

  const photoUrl =
    basic_info?.image_url ||
    basic_info?.imageUrl ||
    basic_info?.photoUrl ||
    basic_info?.photo ||
    basic_info?.avatarUrl ||
    "";

  return (
    <div
      style={{
        fontFamily: '"Segoe UI", Helvetica, Arial, sans-serif',
        fontSize: "10.8px",
        lineHeight: 1.24,
        color: THEME.text,
        padding: "7px 10px",
        width: forExport ? EXPORT_CONTENT_WIDTH : "100%",
        maxWidth: forExport ? EXPORT_CONTENT_WIDTH : "840px",
        margin: "auto",
        backgroundColor: "#fff",
      }}
    >
      <header
        style={{
          display: "grid",
          gridTemplateColumns: photoUrl ? "1fr 72px" : "1fr",
          gap: "4px",
          alignItems: "start",
          marginBottom: "6px",
          borderBottom: `2px solid ${THEME.border}`,
          paddingBottom: "5px",
        }}
      >
        <div>
          {basic_info.name && (
            <h1
              style={{
                margin: 0,
                fontSize: "18px",
                lineHeight: 1.04,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {basic_info.name}
            </h1>
          )}

          {(basic_info.address ||
            basic_info.phone ||
            basic_info.email ||
            basic_info.website) && (
            <div
              style={{
                marginTop: "2px",
                color: THEME.muted,
                fontSize: "10.1px",
                lineHeight: 1.18,
              }}
            >
              {basic_info.address}
              {basic_info.address && basic_info.phone && " | "}
              {basic_info.phone}
              {(basic_info.address || basic_info.phone) &&
                basic_info.email &&
                " | "}
              {basic_info.email && (
                <a
                  href={`mailto:${basic_info.email}`}
                  style={{ color: THEME.accent, textDecoration: "none" }}
                >
                  {basic_info.email}
                </a>
              )}
              {(basic_info.email || basic_info.phone || basic_info.address) &&
                basic_info.website &&
                " | "}
              {basic_info.website && (
                <a
                  href={basic_info.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: THEME.accent, textDecoration: "none" }}
                >
                  {basic_info.website}
                </a>
              )}
            </div>
          )}

          {(basic_info.linkedin || basic_info.github) && (
            <div
              style={{
                marginTop: "1px",
                color: THEME.muted,
                fontSize: "10px",
                lineHeight: 1.16,
              }}
            >
              {basic_info.linkedin && (
                <>
                  <a
                    href={basic_info.linkedin}
                    style={{ color: THEME.accent, textDecoration: "none" }}
                  >
                    LinkedIn: {basic_info.linkedin}
                  </a>
                  {basic_info.github && " | "}
                </>
              )}
              {basic_info.github && (
                <a
                  href={basic_info.github}
                  style={{ color: THEME.accent, textDecoration: "none" }}
                >
                  GitHub: {basic_info.github}
                </a>
              )}
            </div>
          )}

          {basic_info.about && (
            <p
              style={{
                marginTop: "4px",
                marginBottom: 0,
                textAlign: "justify",
                lineHeight: 1.16,
                fontSize: "10.2px",
              }}
            >
              {basic_info.about}
            </p>
          )}
        </div>

        {photoUrl && (
          <img
            src={photoUrl}
            alt={basic_info.name ? `${basic_info.name} profile` : "Profile"}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            style={{
              width: "72px",
              height: "72px",
              objectFit: "cover",
              borderRadius: "5px",
              border: `1px solid ${THEME.accent}`,
            }}
          />
        )}
      </header>

      {Array.isArray(work_experience) && work_experience.length > 0 && (
        <Section title="Work Experience">
          {[...work_experience]
            .sort((a, b) => b.displayOrder - a.displayOrder)
            .map((exp) => (
              <Item
                key={exp.id}
                title={
                  exp.company && exp.location
                    ? `${exp.position} • ${exp.company}, ${exp.location}`
                    : exp.position
                }
                date={`${exp.startDate} - ${exp.endDate || "Present"}`}
                description={exp.description}
                techStack={exp.techStack}
                subtitleInline
              />
            ))}
        </Section>
      )}

      {Array.isArray(education) && education.length > 0 && (
        <Section title="Education">
          {[...education]
            .sort((a, b) => b.displayOrder - a.displayOrder)
            .map((edu) => {
              const date = `${edu.startDate.slice(0, 10)} - ${
                edu.endDate ? edu.endDate.slice(0, 10) : "Present"
              }`;

              const descriptionParts = [];
              if (edu.description) {
                descriptionParts.push(edu.description);
              }

              return (
                <div key={edu.id} style={{ marginBottom: "2px" }}>
                  <Item
                    title={
                      edu.institution
                        ? `${edu.degree} • ${edu.institution}${
                            edu.location ? `, ${edu.location}` : ""
                          }`
                        : `${edu.degree}${edu.location ? ` • ${edu.location}` : ""}`
                    }
                    date={date}
                    description={descriptionParts.join(". ")}
                    additionalInfo={edu.thesis ? `Thesis: ${edu.thesis}` : ""}
                  />
                </div>
              );
            })}
        </Section>
      )}

      {Array.isArray(projects) && projects.length > 0 && (
        <Section title="Projects">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3px 10px",
            }}
          >
            {[...projects]
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((project) => (
                <div key={project.id}>
                  <div style={{ fontWeight: 700 }}>
                    {project.name}
                    {project.url ? " (" : ""}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={project.url}
                        style={{
                          color: THEME.accent,
                          lineHeight: 1.2,
                          textDecoration: "none",
                        }}
                      >
                        {formatUrlLabel(project.url)}
                      </a>
                    )}
                    {project.url ? ")" : ""}
                  </div>
                  {project.description && (
                    <div
                      style={{
                        marginTop: "1px",
                        lineHeight: 1.2,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {project.description}
                    </div>
                  )}
                  {project.purpose && (
                    <div
                      style={{
                        marginTop: "1px",
                        lineHeight: 1.2,
                        color: THEME.muted,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {project.purpose}
                    </div>
                  )}
                  {project.techStack && (
                    <div
                      style={{
                        marginTop: "1px",
                        color: THEME.text,
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      <span style={{ color: THEME.accent, fontWeight: 700 }}>
                        Tech Stack:
                      </span>{" "}
                      {project.techStack}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Section>
      )}

      {Array.isArray(skills) && skills.length > 0 && (
        <Section title="Skills">
          <div style={twoColumnFlowStyle}>
            {[...skills]
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((skill) => (
                <div
                  key={skill.id}
                  style={{ breakInside: "avoid", marginBottom: "4px" }}
                >
                  <strong>{skill.category}:</strong> {skill.skillNames}
                </div>
              ))}
          </div>
        </Section>
      )}

      {Array.isArray(certificates) && certificates.length > 0 && (
        <Section title="Certificates">
          <div style={{ lineHeight: 1.2 }}>
            {[...certificates]
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((cert, index) => (
                <span key={cert.id}>
                  <a
                    href={cert.url}
                    style={{
                      color: THEME.accent,
                      textDecoration: "none",
                      fontSize: "10.8px",
                    }}
                  >
                    {cert.name}
                  </a>
                  {cert.issuer ? ` (${cert.issuer})` : ""}
                  {index < certificates.length - 1 ? " • " : ""}
                </span>
              ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default CvTemplate;
