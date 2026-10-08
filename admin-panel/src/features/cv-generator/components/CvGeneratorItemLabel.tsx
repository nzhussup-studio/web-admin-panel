import Badge from "react-bootstrap/Badge";
import {
  formatLabel,
  getItemSubtitle,
  getItemTitle,
  getLongDescription,
  getMetadataEntries,
} from "./cvGeneratorUtils";

type Props = {
  sectionName: string;
  item: Record<string, unknown>;
  isChecked: boolean;
};

const CvGeneratorItemLabel = ({ sectionName, item, isChecked }: Props) => {
  const title = getItemTitle(item, `${formatLabel(sectionName)} entry`);
  const subtitle = getItemSubtitle(item);
  const description = getLongDescription(item);
  const metadata = getMetadataEntries(item);

  return (
    <div className="d-block w-100">
      <div className="cv-generator-item-content">
        <Badge
          bg={isChecked ? "primary-subtle" : "secondary-subtle"}
          text={isChecked ? "primary" : "secondary-emphasis"}
          pill
          className="cv-generator-status-pill"
        >
          {isChecked ? "Selected" : "Available"}
        </Badge>

        <div className="d-flex align-items-start gap-3 w-100">
          <div className="pe-2 flex-grow-1 min-w-0">
            <div className="fw-semibold">{title}</div>
            {subtitle ? (
              <div className="text-body-secondary small mt-1">{subtitle}</div>
            ) : null}
          </div>
        </div>

        {metadata.length > 0 ? (
          <div className="cv-generator-metadata">
            {metadata.map((entry) => (
              <Badge
                key={entry.label}
                bg="secondary-subtle"
                text="secondary-emphasis"
                className="cv-generator-metadata-pill"
              >
                <span className="opacity-75">{entry.label}:</span> {entry.value}
              </Badge>
            ))}
          </div>
        ) : null}

        {description ? (
          <div className="small text-body-secondary">{description}</div>
        ) : null}
      </div>
    </div>
  );
};

export default CvGeneratorItemLabel;
