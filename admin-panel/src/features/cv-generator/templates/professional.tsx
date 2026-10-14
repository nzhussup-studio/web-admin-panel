import type { CSSProperties, ReactNode } from "react";
import type { CvData, CvTemplateModule } from "./types";
import { sortCvItemsLatestFirst } from "../components/cvGeneratorUtils";

const ink = "#111111";
const divider = "#555555";

const sectionHeading: CSSProperties = {
  margin: "8px 0 5px",
  paddingBottom: "2px",
  borderBottom: `1px solid ${divider}`,
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.035em",
  lineHeight: 1.1,
  textTransform: "uppercase",
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section style={{ breakInside: "avoid-page" }}>
    <h2 style={sectionHeading}>{title}</h2>
    {children}
  </section>
);

const dateRange = (start?: string, end?: string) =>
  [start?.slice(0, 10), end?.slice(0, 10) || "Present"]
    .filter(Boolean)
    .join(" - ");

const linkLabel = (value?: string) => {
  if (!value) return "";
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return `${url.host.replace(/^www\./, "")}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return value;
  }
};

const contactLink = (label: string, value?: string) =>
  value ? (
    <a href={value} style={{ color: ink, textDecoration: "none" }}>
      {label}
    </a>
  ) : null;

const ProfessionalCvTemplate = ({ data }: { data: CvData }) => {
  const {
    basic_info = {},
    work_experience = [],
    education = [],
    skills = [],
    projects = [],
    certificates = [],
  } = data;

  const contacts = [
    basic_info.address,
    basic_info.phone,
    basic_info.email ? (
      <a
        href={`mailto:${basic_info.email}`}
        style={{ color: ink, textDecoration: "none" }}
      >
        {basic_info.email}
      </a>
    ) : null,
    contactLink(linkLabel(basic_info.website), basic_info.website),
    contactLink("LinkedIn", basic_info.linkedin),
    contactLink("GitHub", basic_info.github),
  ].filter(Boolean);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "840px",
        margin: "auto",
        padding: "22px 30px 18px",
        background: "#ffffff",
        color: ink,
        fontFamily: 'Arial, "Helvetica Neue", sans-serif',
        fontSize: "9.2px",
        lineHeight: 1.22,
      }}
    >
      <header style={{ marginBottom: "7px", textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "19px",
            fontWeight: 800,
            letterSpacing: "0.045em",
            lineHeight: 1.05,
            textTransform: "uppercase",
          }}
        >
          {basic_info.name}
        </h1>
        {basic_info.headline && (
          <div style={{ marginTop: "4px", fontSize: "12px", fontWeight: 700 }}>
            {basic_info.headline}
          </div>
        )}
        <div style={{ marginTop: "4px", fontSize: "9px" }}>
          {contacts.map((contact, index) => (
            <span key={index}>
              {index > 0 ? " | " : ""}
              {contact}
            </span>
          ))}
        </div>
      </header>

      {basic_info.about && (
        <Section title="Professional Summary">
          <p style={{ margin: 0, textAlign: "justify" }}>{basic_info.about}</p>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Core Skills">
          {sortCvItemsLatestFirst(skills).map((skill) => (
            <div key={skill.id} style={{ marginBottom: "1px" }}>
              <strong>{skill.category}:</strong> {skill.skillNames}
            </div>
          ))}
        </Section>
      )}

      {work_experience.length > 0 && (
        <Section title="Professional Experience">
          {sortCvItemsLatestFirst(work_experience).map((experience) => (
            <article
              key={experience.id}
              style={{ marginBottom: "6px", breakInside: "avoid" }}
            >
              <div style={{ fontSize: "10.2px", fontWeight: 700 }}>
                {experience.position}
                {experience.company ? ` | ${experience.company}` : ""}
                {experience.location ? `, ${experience.location}` : ""}
                {experience.startDate
                  ? `  ${dateRange(experience.startDate, experience.endDate)}`
                  : ""}
              </div>
              {experience.description && (
                <div
                  style={{
                    marginTop: "2px",
                    textAlign: "justify",
                    whiteSpace: "pre-line",
                  }}
                >
                  {experience.description}
                </div>
              )}
              {experience.techStack && (
                <div style={{ marginTop: "2px" }}>
                  <strong>Tech:</strong> {experience.techStack}
                </div>
              )}
            </article>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Selected Projects">
          {sortCvItemsLatestFirst(projects).map((project) => (
            <article
              key={project.id}
              style={{ marginBottom: "5px", breakInside: "avoid" }}
            >
              <div style={{ fontSize: "10px", fontWeight: 700 }}>
                {project.name}
                {project.url ? " | " : ""}
                {project.url && (
                  <a
                    href={project.url}
                    style={{
                      color: ink,
                      fontSize: "9px",
                      fontWeight: 400,
                      textDecoration: "none",
                    }}
                  >
                    {linkLabel(project.url)}
                  </a>
                )}
              </div>
              {(project.purpose || project.description) && (
                <div style={{ marginTop: "1px", whiteSpace: "pre-line" }}>
                  {project.purpose || project.description}
                </div>
              )}
              {project.techStack && (
                <div style={{ marginTop: "1px" }}>
                  <strong>Tech:</strong> {project.techStack}
                </div>
              )}
            </article>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {sortCvItemsLatestFirst(education).map((item) => (
            <article
              key={item.id}
              style={{ marginBottom: "5px", breakInside: "avoid" }}
            >
              <div style={{ fontSize: "10px", fontWeight: 700 }}>
                {item.degree}
                {item.institution ? ` | ${item.institution}` : ""}
                {item.location ? `, ${item.location}` : ""}
                {item.startDate
                  ? `  ${dateRange(item.startDate, item.endDate)}`
                  : ""}
              </div>
              {item.description && (
                <div style={{ marginTop: "1px" }}>{item.description}</div>
              )}
              {item.thesis && (
                <div style={{ marginTop: "1px" }}>Thesis: {item.thesis}</div>
              )}
            </article>
          ))}
        </Section>
      )}

      {(certificates.length > 0 || basic_info.languages) && (
        <Section title="Additional Information">
          {basic_info.languages && (
            <span>
              <strong>Languages:</strong> {basic_info.languages}
            </span>
          )}
          {certificates.length > 0 && (
            <span>
              {basic_info.languages ? "  |  " : ""}
              <strong>Certificates:</strong>{" "}
              {sortCvItemsLatestFirst(certificates).map(
                (certificate, index) => (
                  <span key={certificate.id}>
                    {index > 0 ? "; " : ""}
                    {certificate.url ? (
                      <a
                        href={certificate.url}
                        style={{ color: ink, textDecoration: "none" }}
                      >
                        {certificate.name}
                      </a>
                    ) : (
                      certificate.name
                    )}
                  </span>
                ),
              )}
            </span>
          )}
        </Section>
      )}

      <footer
        style={{ marginTop: "14px", textAlign: "center", fontSize: "8px" }}
      >
        {[basic_info.name, basic_info.headline].filter(Boolean).join(" | ")}
      </footer>
    </div>
  );
};

export default ProfessionalCvTemplate;

// Template files intentionally colocate their renderer and configuration.
// eslint-disable-next-line react-refresh/only-export-components
export const professionalTemplate = {
  id: "professional" as const,
  name: "Professional",
  eyebrow: "ATS-friendly",
  description:
    "A focused single-column résumé inspired by your Erste Digital application.",
  sectionOrder: [
    "skills",
    "work_experience",
    "projects",
    "education",
    "certificates",
  ],
  basicInfoTitle: "Professional header",
  basicInfoDescription: "Name, target role, contact line and summary",
  basicInfoFields: [
    { key: "name", label: "Full name", autoComplete: "name", wide: true },
    {
      key: "headline",
      label: "Professional title",
      placeholder: "Backend & Platform Software Engineer",
      wide: true,
    },
    { key: "email", label: "Email", type: "email", autoComplete: "email" },
    { key: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
    {
      key: "address",
      label: "Location",
      autoComplete: "address-level2",
      placeholder: "Vienna, Austria",
      wide: true,
    },
    { key: "website", label: "Website", type: "url" },
    { key: "linkedin", label: "LinkedIn", type: "url" },
    { key: "github", label: "GitHub", type: "url" },
    {
      key: "languages",
      label: "Languages",
      placeholder: "English, German, Kazakh, Russian",
      wide: true,
    },
  ],
  component: ProfessionalCvTemplate,
} satisfies CvTemplateModule;
