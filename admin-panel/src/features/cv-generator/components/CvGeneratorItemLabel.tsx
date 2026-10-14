import {
  formatLabel,
  getItemDateRange,
  getItemSubtitle,
  getItemTitle,
  getLongDescription,
  getMetadataEntries,
} from "./cvGeneratorUtils";

type Props = {
  sectionName: string;
  item: Record<string, unknown>;
};

const CvGeneratorItemLabel = ({ sectionName, item }: Props) => {
  const title = getItemTitle(item, `${formatLabel(sectionName)} entry`);
  const subtitle = getItemSubtitle(item);
  const description = getLongDescription(item);
  const metadata = getMetadataEntries(item).filter(
    (entry) => entry.label !== "Start Date" && entry.label !== "End Date",
  );
  const dateRange = getItemDateRange(item);

  return (
    <div className="d-block w-100">
      <div className="cv-generator-item-content">
        <div className="cv-generator-item-heading">
          <div className="cv-generator-item-identity">
            <div className="cv-generator-item-title">{title}</div>
            {subtitle ? (
              <div className="cv-generator-item-subtitle">{subtitle}</div>
            ) : null}
          </div>
          {dateRange ? (
            <time className="cv-generator-item-date">{dateRange}</time>
          ) : null}
        </div>

        {metadata.length > 0 ? (
          <div className="cv-generator-metadata">
            {metadata.map((entry) => (
              <span key={entry.label} className="cv-generator-metadata-pill">
                <span>{entry.label}</span> {entry.value}
              </span>
            ))}
          </div>
        ) : null}

        {description ? (
          <p className="cv-generator-item-description">{description}</p>
        ) : null}
      </div>
    </div>
  );
};

export default CvGeneratorItemLabel;
