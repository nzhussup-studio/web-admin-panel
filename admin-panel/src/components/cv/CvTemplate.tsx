import { type CSSProperties } from "react";

const THEME = {
  text: "#1f2933",
  muted: "#52606d",
  subtle: "#9aa5b1",
  border: "#d9e2ec",
  accent: "#0b4f7a",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "12px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 700,
  color: THEME.accent,
  borderBottom: `1px solid ${THEME.border}`,
  paddingBottom: "4px",
  marginBottom: "8px",
};

const Section = ({ title, children }) => (
  <section
    style={{
      marginBottom: "12px",
      pageBreakInside: "avoid",
      breakInside: "avoid",
    }}
  >
    <div style={sectionTitleStyle}>{title}</div>
    {children}
  </section>
);

const Item = ({ title, subtitle, date, description, techStack = "" }) => (
  <div
    style={{
      marginBottom: "10px",
      pageBreakInside: "avoid",
      breakInside: "avoid",
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

    {subtitle && (
      <div style={{ marginTop: "2px", color: THEME.muted, fontSize: "10.8px" }}>
        {subtitle}
      </div>
    )}

    {description && (
      <div style={{ marginTop: "3px", lineHeight: 1.35, textAlign: "justify" }}>
        {description}
      </div>
    )}

    {techStack && (
      <div style={{ marginTop: "3px", lineHeight: 1.3, color: THEME.muted }}>
        <strong style={{ color: THEME.text }}>Tech Stack:</strong> {techStack}
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

    const compactPath = path.length > 26 ? `${path.slice(0, 25)}...` : path;
    return `${host}${compactPath}`;
  } catch {
    return value.length > 40 ? `${value.slice(0, 39)}...` : value;
  }
};

const CvTemplate = ({ data }) => {
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
        fontSize: "11.5px",
        lineHeight: 1.35,
        color: THEME.text,
        padding: "12px 18px",
        maxWidth: "840px",
        margin: "auto",
        backgroundColor: "#fff",
      }}
    >
      <header
        style={{
          display: "grid",
          gridTemplateColumns: photoUrl ? "1fr auto" : "1fr",
          gap: "14px",
          marginBottom: "12px",
          borderBottom: `2px solid ${THEME.border}`,
          paddingBottom: "9px",
        }}
      >
        <div>
          {basic_info.name && (
            <h1
              style={{
                margin: 0,
                fontSize: "21px",
                lineHeight: 1.08,
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
            <div style={{ marginTop: "5px", color: THEME.muted }}>
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
            <div style={{ marginTop: "3px", color: THEME.muted }}>
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
                marginTop: "7px",
                marginBottom: 0,
                textAlign: "justify",
                lineHeight: 1.28,
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
              width: "88px",
              height: "88px",
              objectFit: "cover",
              borderRadius: "6px",
              border: `1px solid ${THEME.border}`,
            }}
          />
        )}
      </header>

      {work_experience && (
        <Section title="Work Experience">
          {[...work_experience]
            .sort((a, b) => b.displayOrder - a.displayOrder)
            .map((exp) => (
              <Item
                key={exp.id}
                title={exp.position}
                subtitle={`${exp.company}, ${exp.location}`}
                date={`${exp.startDate} - ${exp.endDate || "Present"}`}
                description={exp.description}
                techStack={exp.techStack}
              />
            ))}
        </Section>
      )}

      {education && (
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
              if (edu.thesis) {
                descriptionParts.push(`Thesis: ${edu.thesis}`);
              }

              return (
                <Item
                  key={edu.id}
                  title={edu.degree}
                  subtitle={`${edu.institution}, ${edu.location}`}
                  date={date}
                  description={descriptionParts.join(". ")}
                />
              );
            })}
        </Section>
      )}

      {skills && (
        <Section title="Skills">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px 14px",
            }}
          >
            {[...skills]
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((skill) => (
                <div key={skill.id}>
                  <strong>{skill.category}:</strong> {skill.skillNames}
                </div>
              ))}
          </div>
        </Section>
      )}

      {projects && (
        <Section title="Projects">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 14px",
            }}
          >
            {[...projects]
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((project) => (
                <div
                  key={project.id}
                  style={{
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{project.name}</div>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={project.url}
                      style={{
                        display: "inline-block",
                        marginTop: "1px",
                        color: THEME.accent,
                        lineHeight: 1.25,
                        textDecoration: "none",
                      }}
                    >
                      {formatUrlLabel(project.url)}
                    </a>
                  )}
                  {project.description && (
                    <div style={{ marginTop: "2px", lineHeight: 1.3 }}>
                      {project.description}
                    </div>
                  )}
                  {project.techStack && (
                    <div
                      style={{
                        marginTop: "2px",
                        color: THEME.muted,
                        lineHeight: 1.25,
                      }}
                    >
                      Tech Stack: {project.techStack}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </Section>
      )}

      {certificates && (
        <Section title="Certificates">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px 14px",
            }}
          >
            {[...certificates]
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((cert) => (
                <a
                  key={cert.id}
                  href={cert.url}
                  style={{
                    color: THEME.accent,
                    textDecoration: "none",
                    lineHeight: 1.25,
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                  }}
                >
                  {cert.name}
                </a>
              ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default CvTemplate;
