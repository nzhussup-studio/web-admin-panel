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
      <div className="d-flex flex-column gap-2 w-100 pe-5">
        <Badge
          bg={isChecked ? "primary" : "secondary"}
          pill
          className="position-absolute top-0 end-0 mt-2 me-3"
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
          <div className="d-flex flex-wrap gap-2">
            {metadata.map((entry) => (
              <Badge
                key={entry.label}
                bg="secondary"
                className="fw-normal px-2 py-1 text-wrap"
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
