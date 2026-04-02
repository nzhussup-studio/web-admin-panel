import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CvGeneratorItemLabel from "./CvGeneratorItemLabel";
import {
  buildOverrideKey,
  canOverrideDescription,
  formatLabel,
  formatScalar,
  getLongDescription,
  parseSkillNames,
  SKILLS_SECTION_NAME,
} from "./cvGeneratorUtils";

type DescriptionOverrides = Record<string, string>;
type SelectedSkillEntries = Record<string, Set<string>>;

type Props = {
  sectionName: string;
  items: Record<string, any>[];
  selectedItems: Set<string | number>;
  descriptionOverrides: DescriptionOverrides;
  selectedSkillEntries: SelectedSkillEntries;
  onToggleAll: () => void;
  onToggleItem: (sectionName: string, itemId: string | number) => void;
  onSetDescriptionOverride: (
    sectionName: string,
    itemId: string | number,
    value: string,
  ) => void;
  onToggleSkillCategory: (
    itemId: string | number,
    allSkillNames: string[],
    isSelected: boolean,
  ) => void;
  onToggleSkillEntry: (
    itemId: string | number,
    skillName: string,
    selectedSkillNames: string[],
  ) => void;
};

const entryClassName = (isChecked: boolean) =>
  `position-relative rounded-4 border px-3 py-3 shadow-sm ${
    isChecked
      ? "bg-primary-subtle border-primary-subtle"
      : "bg-body-tertiary border-secondary-subtle"
  }`;

const CvGeneratorSectionCard = ({
  sectionName,
  items,
  selectedItems,
  descriptionOverrides,
  selectedSkillEntries,
  onToggleAll,
  onToggleItem,
  onSetDescriptionOverride,
  onToggleSkillCategory,
  onToggleSkillEntry,
}: Props) => {
  const allSelected = items.length > 0 && items.every((item) => selectedItems.has(item.id));
  const isSkillsSection = sectionName === SKILLS_SECTION_NAME;

  return (
    <Card className="rounded-4 app-interactive-card mt-4">
      <Card.Body className="p-4 app-card-body">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
          <div>
            <Card.Title className="mb-1 text-capitalize fw-semibold app-card-title">
              {sectionName.replace(/_/g, " ")}
            </Card.Title>
            <div className="text-body-secondary small">{selectedItems.size} selected</div>
          </div>
          <Button onClick={onToggleAll} type="button" variant="outline-secondary" size="sm">
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>

        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => {
            const itemId = item.id;
            const isChecked = selectedItems.has(itemId);

            if (isSkillsSection) {
              const categoryName = formatScalar(item.category) || "Skill category";
              const allSkillNames = parseSkillNames(item.skillNames);
              const selectedSkillSet = selectedSkillEntries[String(itemId)];
              const savedSkillSelection = selectedSkillSet?.size
                ? allSkillNames.filter((skillName) => selectedSkillSet.has(skillName))
                : allSkillNames;
              const selectedSkillNames = isChecked ? savedSkillSelection : [];

              return (
                <div key={itemId} className="mb-2">
                  <div className={entryClassName(isChecked)}>
                    <div className="d-flex align-items-start justify-content-between gap-3">
                      <Form.Check
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          onToggleSkillCategory(itemId, allSkillNames, isChecked)
                        }
                        label={
                          <div>
                            <div className="fw-semibold">{categoryName}</div>
                            <div className="small text-body-secondary">
                              {selectedSkillNames.length} of {allSkillNames.length} selected
                            </div>
                          </div>
                        }
                      />
                      <Badge bg={isChecked ? "primary" : "secondary"} pill>
                        {isChecked ? "Selected" : "Available"}
                      </Badge>
                    </div>

                    {allSkillNames.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        {allSkillNames.map((skillName) => {
                          const skillChecked =
                            isChecked && selectedSkillNames.includes(skillName);

                          return (
                            <Button
                              key={skillName}
                              type="button"
                              size="sm"
                              variant={skillChecked ? "primary" : "outline-secondary"}
                              className="rounded-pill"
                              onClick={() =>
                                onToggleSkillEntry(itemId, skillName, selectedSkillNames)
                              }
                            >
                              {skillName}
                            </Button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            }

            const overrideKey = buildOverrideKey(sectionName, itemId);
            const overrideValue = descriptionOverrides[overrideKey] || "";
            const defaultDescription = getLongDescription(item);
            const showOverrideInput = isChecked && canOverrideDescription(item);

            return (
              <div key={itemId} className="mb-2">
                <div className={entryClassName(isChecked)}>
                  <Form.Check
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleItem(sectionName, itemId)}
                    label={
                      <CvGeneratorItemLabel
                        sectionName={sectionName}
                        item={item}
                        isChecked={isChecked}
                      />
                    }
                  />
                </div>

                {showOverrideInput ? (
                  <Form.Group className="mt-2">
                    <Form.Label className="small text-body-secondary mb-1">
                      Custom description override (optional)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={overrideValue}
                      placeholder={
                        defaultDescription
                          ? `Current: ${defaultDescription.slice(0, 140)}${
                              defaultDescription.length > 140 ? "..." : ""
                            }`
                          : `Type a custom ${formatLabel(sectionName)} description...`
                      }
                      onChange={(e) =>
                        onSetDescriptionOverride(
                          sectionName,
                          itemId,
                          e.target.value,
                        )
                      }
                    />
                  </Form.Group>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="text-secondary">No items</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CvGeneratorSectionCard;
