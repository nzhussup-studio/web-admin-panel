import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

const sections = [
  ["Experience", "/cv/work-experience"],
  ["Education", "/cv/education"],
  ["Skills", "/cv/skills"],
  ["Certificates", "/cv/certifications"],
] as const;

export function CvSectionNav() {
  return (
    <Nav
      variant="pills"
      className="cv-section-nav d-lg-none flex-nowrap"
      aria-label="CV sections"
    >
      {sections.map(([label, path]) => (
        <Nav.Link key={path} as={NavLink} to={path}>
          {label}
        </Nav.Link>
      ))}
    </Nav>
  );
}
