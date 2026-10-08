import type { ReactNode } from "react";
import Container from "react-bootstrap/Container";

type HeaderProps = {
  text?: string;
  description?: string;
  eyebrow?: ReactNode;
  titleContent?: ReactNode;
  actions?: ReactNode;
};

const Header = ({
  text,
  description,
  eyebrow,
  titleContent,
  actions,
}: HeaderProps) => (
  <Container fluid="xl" className="page-header">
    {eyebrow ? <div className="page-eyebrow">{eyebrow}</div> : null}
    <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
      <div>
        {titleContent ?? <h1>{text}</h1>}
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </div>
  </Container>
);

export default Header;
