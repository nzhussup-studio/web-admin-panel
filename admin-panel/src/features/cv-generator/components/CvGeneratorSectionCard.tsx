import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "@/components/ui/button";
import Card from "react-bootstrap/Card";
import {
  Award,
  BriefcaseBusiness,
  ChevronDown,
  Folder,
  GraduationCap,
  Settings,
} from "lucide-react";
import CvGeneratorItemLabel from "./CvGeneratorItemLabel";
import { CvSelectableEntry } from "./CvSelectableEntry";
import { DescriptionOverrideField } from "./DescriptionOverrideField";
import {
  buildScopedItemKey,
  buildOverrideKey,
  canOverrideDescription,
  formatScalar,
  getLongDescription,
  parseTechStack,
  parseSkillNames,
  SKILLS_SECTION_NAME,
  TECH_STACK_SELECTABLE_SECTION_NAMES,
} from "./cvGeneratorUtils";

type DescriptionOverrides = Record<string, string>;
type SelectedSkillEntries = Record<string, Set<string>>;
type SelectedTechStackEntries = Record<string, Set<string>>;

type Props = {
  sectionName: string;
  items: Record<string, any>[];
  selectedItems: Set<string | number>;
  descriptionOverrides: DescriptionOverrides;
  selectedSkillEntries: SelectedSkillEntries;
  selectedTechStackEntries: SelectedTechStackEntries;
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
  onToggleTechStackCategory: (
    sectionName: string,
    itemId: string | number,
    allTechStackEntries: string[],
    isSelected: boolean,
  ) => void;
  onToggleTechStackEntry: (
    sectionName: string,
    itemId: string | number,
    techStackEntry: string,
    selectedTechStackEntries: string[],
  ) => void;
};

const PROJECTS_SECTION_NAME = "projects";
const sectionIcons = {
  work_experience: BriefcaseBusiness,
  education: GraduationCap,
  skills: Settings,
  projects: Folder,
  certificates: Award,
} as const;

const CvGeneratorSectionCard = ({
  sectionName,
  items,
  selectedItems,
  descriptionOverrides,
  selectedSkillEntries,
  selectedTechStackEntries,
  onToggleAll,
  onToggleItem,
  onSetDescriptionOverride,
  onToggleSkillCategory,
  onToggleSkillEntry,
  onToggleTechStackCategory,
  onToggleTechStackEntry,
}: Props) => {
  const [open, setOpen] = useState(sectionName === "work_experience");
  const allSelected =
    items.length > 0 && items.every((item) => selectedItems.has(item.id));
  const isSkillsSection = sectionName === SKILLS_SECTION_NAME;
  const isTechStackSelectableSection =
    TECH_STACK_SELECTABLE_SECTION_NAMES.has(sectionName);

  return (
    <Card className={`cv-generator-section${open ? " is-open" : ""}`}>
      <Card.Header
        as="button"
        type="button"
        className="cv-generator-section-header"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {(() => {
          const Icon =
            sectionIcons[sectionName as keyof typeof sectionIcons] ?? Folder;
          return (
            <span className="cv-generator-section-icon">
              <Icon size={19} />
            </span>
          );
        })()}
        <span className="cv-generator-section-heading">
          <Card.Title className="text-capitalize">
            {sectionName.replace(/_/g, " ")}
          </Card.Title>
          <small>
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </small>
        </span>
        <Badge bg="primary-subtle" text="primary">
          {selectedItems.size} selected
        </Badge>
        <ChevronDown className="cv-generator-chevron" size={18} />
      </Card.Header>
      {open ? (
        <Card.Body className="cv-generator-section-body app-card-body">
          <div className="cv-generator-section-toolbar">
            <span>
              Choose the entries to include in the generated document.
            </span>
            <Button
              onClick={onToggleAll}
              type="button"
              variant="outline-secondary"
              size="sm"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </Button>
          </div>

          {Array.isArray(items) && items.length > 0 ? (
            items.map((item) => {
              const itemId = item.id;
              const isChecked = selectedItems.has(itemId);

              if (isSkillsSection) {
                const categoryName =
                  formatScalar(item.category) || "Skill category";
                const allSkillNames = parseSkillNames(item.skillNames);
                const selectedSkillSet = selectedSkillEntries[String(itemId)];
                const savedSkillSelection = selectedSkillSet?.size
                  ? allSkillNames.filter((skillName) =>
                      selectedSkillSet.has(skillName),
                    )
                  : allSkillNames;
                const selectedSkillNames = isChecked ? savedSkillSelection : [];

                return (
                  <div key={itemId} className="mb-2">
                    <CvSelectableEntry
                      selected={isChecked}
                      onToggle={() =>
                        onToggleSkillCategory(itemId, allSkillNames, isChecked)
                      }
                      label={
                        <div>
                          <div className="fw-semibold">{categoryName}</div>
                          <div className="small text-body-secondary">
                            {selectedSkillNames.length} of{" "}
                            {allSkillNames.length} selected
                          </div>
                        </div>
                      }
                    >
                      {allSkillNames.length > 0 ? (
                        <div className="cv-generator-pill-list">
                          {allSkillNames.map((skillName) => {
                            const skillChecked =
                              isChecked &&
                              selectedSkillNames.includes(skillName);

                            return (
                              <Button
                                key={skillName}
                                type="button"
                                size="sm"
                                variant={
                                  skillChecked ? "primary" : "outline-secondary"
                                }
                                className="cv-generator-pill"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onToggleSkillEntry(
                                    itemId,
                                    skillName,
                                    selectedSkillNames,
                                  );
                                }}
                              >
                                {skillName}
                              </Button>
                            );
                          })}
                        </div>
                      ) : null}
                    </CvSelectableEntry>
                  </div>
                );
              }

              if (isTechStackSelectableSection) {
                const allTechStackEntries = parseTechStack(item.techStack);
                const selectedTechStackSet =
                  selectedTechStackEntries[
                    buildScopedItemKey(sectionName, itemId)
                  ];
                const savedTechStackSelection = selectedTechStackSet?.size
                  ? allTechStackEntries.filter((entry) =>
                      selectedTechStackSet.has(entry),
                    )
                  : allTechStackEntries;
                const activeTechStackEntries = isChecked
                  ? savedTechStackSelection
                  : [];
                const overrideKey = buildOverrideKey(sectionName, itemId);
                const overrideValue = descriptionOverrides[overrideKey] || "";
                const defaultDescription = getLongDescription(item);
                const isProjectsSection = sectionName === PROJECTS_SECTION_NAME;
                const showOverrideInput =
                  isChecked &&
                  (canOverrideDescription(item) || isProjectsSection);

                return (
                  <div key={itemId} className="mb-2">
                    <CvSelectableEntry
                      selected={isChecked}
                      onToggle={() =>
                        onToggleTechStackCategory(
                          sectionName,
                          itemId,
                          allTechStackEntries,
                          isChecked,
                        )
                      }
                      label={
                        <div>
                          <CvGeneratorItemLabel
                            sectionName={sectionName}
                            item={item}
                            isChecked={isChecked}
                          />
                          {allTechStackEntries.length > 0 ? (
                            <div className="small text-body-secondary">
                              {activeTechStackEntries.length} of{" "}
                              {allTechStackEntries.length} tech stack entries
                              selected
                            </div>
                          ) : null}
                        </div>
                      }
                    >
                      {allTechStackEntries.length > 0 ? (
                        <div className="cv-generator-pill-list">
                          {allTechStackEntries.map((techStackEntry) => {
                            const techEntryChecked =
                              isChecked &&
                              activeTechStackEntries.includes(techStackEntry);

                            return (
                              <Button
                                key={techStackEntry}
                                type="button"
                                size="sm"
                                variant={
                                  techEntryChecked
                                    ? "primary"
                                    : "outline-secondary"
                                }
                                className="cv-generator-pill"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onToggleTechStackEntry(
                                    sectionName,
                                    itemId,
                                    techStackEntry,
                                    activeTechStackEntries,
                                  );
                                }}
                              >
                                {techStackEntry}
                              </Button>
                            );
                          })}
                        </div>
                      ) : null}
                    </CvSelectableEntry>

                    {showOverrideInput ? (
                      <DescriptionOverrideField
                        sectionName={sectionName}
                        value={overrideValue}
                        defaultDescription={defaultDescription}
                        onChange={(value) =>
                          onSetDescriptionOverride(sectionName, itemId, value)
                        }
                      />
                    ) : null}
                  </div>
                );
              }

              const overrideKey = buildOverrideKey(sectionName, itemId);
              const overrideValue = descriptionOverrides[overrideKey] || "";
              const defaultDescription = getLongDescription(item);
              const isProjectsSection = sectionName === PROJECTS_SECTION_NAME;
              const showOverrideInput =
                isChecked &&
                (canOverrideDescription(item) || isProjectsSection);

              return (
                <div key={itemId} className="mb-2">
                  <CvSelectableEntry
                    selected={isChecked}
                    onToggle={() => onToggleItem(sectionName, itemId)}
                    label={
                      <CvGeneratorItemLabel
                        sectionName={sectionName}
                        item={item}
                        isChecked={isChecked}
                      />
                    }
                  />

                  {showOverrideInput ? (
                    <DescriptionOverrideField
                      sectionName={sectionName}
                      value={overrideValue}
                      defaultDescription={defaultDescription}
                      onChange={(value) =>
                        onSetDescriptionOverride(sectionName, itemId, value)
                      }
                    />
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="text-secondary">No items</div>
          )}
        </Card.Body>
      ) : null}
    </Card>
  );
};

export default CvGeneratorSectionCard;
