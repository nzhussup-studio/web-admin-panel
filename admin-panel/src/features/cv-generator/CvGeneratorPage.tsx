import { PageHeader } from "@/components/layout/page-header";
import { AsyncState } from "@/components/feedback/error-state";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { normalizeApiError } from "@/api";
import { generateCV, previewCV } from "./export";
import { CloudDownload, CloudUpload, Eye } from "lucide-react";
import { useOptionalGlobalAlert } from "@/providers/alerts";
import {
  CvGeneratorBasicInfoCard,
  CvGeneratorSectionCard,
  ExportSummary,
} from "./components";
import { getCvGeneratorSourceData } from "./api";
import { useCvGeneratorPreferences } from "./hooks";
import {
  applyDescriptionOverride,
  buildScopedItemKey,
  buildOverrideKey,
  canOverrideDescription,
  parseTechStack,
  parseSkillNames,
  SKILLS_SECTION_NAME,
  TECH_STACK_SELECTABLE_SECTION_NAMES,
} from "./components/cvGeneratorUtils";

type CvSection = {
  sectionName: string;
  items: Record<string, any>[];
};

const CvGeneratorPage = () => {
  const { triggerAlert } = useOptionalGlobalAlert();

  const {
    basicInfo,
    setBasicInfo,
    descriptionOverrides,
    setDescriptionOverrides,
    selectedItems,
    setSelectedItems,
    selectedSkillEntries,
    setSelectedSkillEntries,
    selectedTechStackEntries,
    setSelectedTechStackEntries,
    isSyncingPreferences,
    syncToBackend,
    syncFromBackend,
  } = useCvGeneratorPreferences();

  const sourceData = useQuery({
    queryKey: ["cv-generator", "source-data"],
    queryFn: getCvGeneratorSourceData,
  });
  const sections = useMemo<CvSection[]>(() => {
    if (!sourceData.data) return [];
    const sortItems = (items: Record<string, any>[]) =>
      [...items].sort(
        (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
      );
    return [
      {
        sectionName: "work_experience",
        items: sortItems(sourceData.data.workExperience),
      },
      { sectionName: "education", items: sortItems(sourceData.data.education) },
      {
        sectionName: SKILLS_SECTION_NAME,
        items: sortItems(sourceData.data.skills),
      },
      { sectionName: "projects", items: sortItems(sourceData.data.projects) },
      {
        sectionName: "certificates",
        items: sortItems(sourceData.data.certificates),
      },
    ];
  }, [sourceData.data]);

  const handleBasicInfoChange = (key: string, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSelect = (sectionName: string, itemId: string | number) => {
    setSelectedItems((prev) => {
      const nextSectionSet = new Set(prev[sectionName] || []);
      if (nextSectionSet.has(itemId)) {
        nextSectionSet.delete(itemId);
      } else {
        nextSectionSet.add(itemId);
      }

      return { ...prev, [sectionName]: nextSectionSet };
    });
  };

  const toggleSectionAll = (
    sectionName: string,
    items: Record<string, any>[],
  ) => {
    const allSelected =
      items.length > 0 &&
      items.every((item) => selectedItems[sectionName]?.has(item.id));

    setSelectedItems((prev) => {
      const nextSectionSet = new Set<string | number>();
      if (!allSelected) {
        for (const item of items) {
          nextSectionSet.add(item.id);
        }
      }

      return { ...prev, [sectionName]: nextSectionSet };
    });

    if (sectionName === SKILLS_SECTION_NAME && !allSelected) {
      setSelectedSkillEntries((prev) => {
        const next = { ...prev };
        for (const item of items) {
          const itemId = item.id;
          const itemKey = String(itemId);
          if (!next[itemKey]?.size) {
            next[itemKey] = new Set(parseSkillNames(item.skillNames));
          }
        }

        return next;
      });
    }

    if (TECH_STACK_SELECTABLE_SECTION_NAMES.has(sectionName) && !allSelected) {
      setSelectedTechStackEntries((prev) => {
        const next = { ...prev };
        for (const item of items) {
          const itemKey = buildScopedItemKey(sectionName, item.id);
          if (!next[itemKey]?.size) {
            next[itemKey] = new Set(parseTechStack(item.techStack));
          }
        }

        return next;
      });
    }
  };

  const setDescriptionOverride = (
    sectionName: string,
    itemId: string | number,
    value: string,
  ) => {
    const overrideKey = buildOverrideKey(sectionName, itemId);
    setDescriptionOverrides((prev) => {
      if (!value.trim()) {
        const { [overrideKey]: _removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [overrideKey]: value,
      };
    });
  };

  const toggleSkillCategory = (
    itemId: string | number,
    allSkillNames: string[],
    isSelected: boolean,
  ) => {
    setSelectedItems((prev) => {
      const nextSectionSet = new Set(prev[SKILLS_SECTION_NAME] || []);
      if (isSelected) {
        nextSectionSet.delete(itemId);
      } else {
        nextSectionSet.add(itemId);
      }

      return { ...prev, [SKILLS_SECTION_NAME]: nextSectionSet };
    });

    if (!isSelected && allSkillNames.length > 0) {
      setSelectedSkillEntries((prev) => {
        const itemKey = String(itemId);
        if (prev[itemKey]?.size) {
          return prev;
        }

        return { ...prev, [itemKey]: new Set(allSkillNames) };
      });
    }
  };

  const toggleSkillEntry = (
    itemId: string | number,
    skillName: string,
    selectedSkillNames: string[],
  ) => {
    const itemKey = String(itemId);
    const nextSkillSet = new Set(selectedSkillNames);

    if (nextSkillSet.has(skillName)) {
      nextSkillSet.delete(skillName);
    } else {
      nextSkillSet.add(skillName);
    }

    setSelectedSkillEntries((prev) => ({
      ...prev,
      [itemKey]: nextSkillSet,
    }));

    setSelectedItems((prev) => {
      const nextSectionSet = new Set(prev[SKILLS_SECTION_NAME] || []);
      if (nextSkillSet.size > 0) {
        nextSectionSet.add(itemId);
      } else {
        nextSectionSet.delete(itemId);
      }

      return { ...prev, [SKILLS_SECTION_NAME]: nextSectionSet };
    });
  };

  const toggleTechStackCategory = (
    sectionName: string,
    itemId: string | number,
    allTechStackEntries: string[],
    isSelected: boolean,
  ) => {
    setSelectedItems((prev) => {
      const nextSectionSet = new Set(prev[sectionName] || []);
      if (isSelected) {
        nextSectionSet.delete(itemId);
      } else {
        nextSectionSet.add(itemId);
      }

      return { ...prev, [sectionName]: nextSectionSet };
    });

    if (!isSelected && allTechStackEntries.length > 0) {
      setSelectedTechStackEntries((prev) => {
        const itemKey = buildScopedItemKey(sectionName, itemId);
        if (prev[itemKey]?.size) {
          return prev;
        }

        return { ...prev, [itemKey]: new Set(allTechStackEntries) };
      });
    }
  };

  const toggleTechStackEntry = (
    sectionName: string,
    itemId: string | number,
    techStackEntry: string,
    selectedEntries: string[],
  ) => {
    const itemKey = buildScopedItemKey(sectionName, itemId);
    const nextTechStackSet = new Set(selectedEntries);

    if (nextTechStackSet.has(techStackEntry)) {
      nextTechStackSet.delete(techStackEntry);
    } else {
      nextTechStackSet.add(techStackEntry);
    }

    setSelectedTechStackEntries((prev) => ({
      ...prev,
      [itemKey]: nextTechStackSet,
    }));

    setSelectedItems((prev) => {
      const nextSectionSet = new Set(prev[sectionName] || []);
      if (nextTechStackSet.size > 0) {
        nextSectionSet.add(itemId);
      } else {
        nextSectionSet.delete(itemId);
      }

      return { ...prev, [sectionName]: nextSectionSet };
    });
  };

  const buildSelectedData = () => {
    const selectedData: Record<string, any> = { basic_info: basicInfo };

    for (const section of sections) {
      const { sectionName, items } = section;
      const selectedIds = selectedItems[sectionName];
      if (!selectedIds?.size) {
        continue;
      }

      selectedData[sectionName] = items
        .filter((item) => selectedIds.has(item.id))
        .map((item) => {
          let currentItem = item;

          if (sectionName === SKILLS_SECTION_NAME) {
            const allSkillNames = parseSkillNames(currentItem.skillNames);
            if (allSkillNames.length === 0) {
              return currentItem;
            }

            const selectedForItem =
              selectedSkillEntries[String(currentItem.id)];
            const activeSkillNames = selectedForItem?.size
              ? allSkillNames.filter((skillName) =>
                  selectedForItem.has(skillName),
                )
              : allSkillNames;

            if (activeSkillNames.length === 0) {
              return null;
            }

            return {
              ...currentItem,
              skillNames: activeSkillNames.join(", "),
            };
          }

          if (TECH_STACK_SELECTABLE_SECTION_NAMES.has(sectionName)) {
            const allTechStackEntries = parseTechStack(currentItem.techStack);
            if (allTechStackEntries.length > 0) {
              const selectedForItem =
                selectedTechStackEntries[
                  buildScopedItemKey(sectionName, currentItem.id)
                ];
              const activeTechStackEntries = selectedForItem?.size
                ? allTechStackEntries.filter((entry) =>
                    selectedForItem.has(entry),
                  )
                : allTechStackEntries;

              if (activeTechStackEntries.length === 0) {
                return null;
              }

              currentItem = {
                ...currentItem,
                techStack: activeTechStackEntries.join(", "),
              };
            }
          }

          if (!canOverrideDescription(currentItem)) {
            if (sectionName === "projects") {
              const projectOverride =
                descriptionOverrides[
                  buildOverrideKey(sectionName, currentItem.id)
                ] || "";

              if (!projectOverride.trim()) {
                return currentItem;
              }

              return {
                ...currentItem,
                purpose: projectOverride.trim(),
              };
            }

            return currentItem;
          }

          if (sectionName === "projects") {
            const projectOverride =
              descriptionOverrides[
                buildOverrideKey(sectionName, currentItem.id)
              ] || "";
            if (!projectOverride.trim()) {
              return currentItem;
            }

            return {
              ...currentItem,
              purpose: projectOverride.trim(),
            };
          }

          return applyDescriptionOverride(
            currentItem,
            descriptionOverrides[
              buildOverrideKey(sectionName, currentItem.id)
            ] || "",
          );
        })
        .filter(Boolean);
    }

    return selectedData;
  };

  const handleGenerateCV = (output: "pdf") => {
    const selectedData = buildSelectedData();

    if (Object.keys(selectedData).length === 0) {
      triggerAlert(
        "Please select at least one item to generate CV.",
        "warning",
      );
    } else {
      triggerAlert("CV generated successfully (mock)!", "success");
    }

    generateCV(selectedData, output);
  };

  const handlePreviewCV = () => {
    const selectedData = buildSelectedData();
    previewCV(selectedData);
  };

  const summaryCounts = useMemo(() => {
    const counts: Record<string, number> = { basic_info: 1 };
    sections.forEach(({ sectionName }) => {
      counts[sectionName] = selectedItems[sectionName]?.size ?? 0;
    });
    return counts;
  }, [sections, selectedItems]);

  return (
    <>
      <PageHeader
        text="CV Generator"
        description="Choose content, customize details and export your CV."
        actions={
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={handlePreviewCV}>
              <Eye size={17} /> Preview
            </Button>
            <Button
              variant="outline-secondary"
              onClick={syncFromBackend}
              disabled={isSyncingPreferences}
            >
              <CloudDownload size={17} /> Sync from backend
            </Button>
            <Button
              variant="outline-secondary"
              onClick={syncToBackend}
              disabled={isSyncingPreferences}
            >
              <CloudUpload size={17} /> Sync to backend
            </Button>
          </div>
        }
      />

      <Container fluid="xl" className="page-content">
        <AsyncState
          isEmpty={sections.length === 0}
          loading={sourceData.isPending}
          error={sourceData.error ? normalizeApiError(sourceData.error) : null}
        >
          <Row className="g-4 cv-generator-layout">
            <Col xl={9}>
              <CvGeneratorBasicInfoCard
                basicInfo={basicInfo}
                onBasicInfoChange={handleBasicInfoChange}
              />
              {sections.map((section) => (
                <CvGeneratorSectionCard
                  key={section.sectionName}
                  sectionName={section.sectionName}
                  items={section.items}
                  selectedItems={
                    selectedItems[section.sectionName] || new Set()
                  }
                  descriptionOverrides={descriptionOverrides}
                  selectedSkillEntries={selectedSkillEntries}
                  selectedTechStackEntries={selectedTechStackEntries}
                  onToggleAll={() =>
                    toggleSectionAll(section.sectionName, section.items)
                  }
                  onToggleItem={toggleSelect}
                  onSetDescriptionOverride={setDescriptionOverride}
                  onToggleSkillCategory={toggleSkillCategory}
                  onToggleSkillEntry={toggleSkillEntry}
                  onToggleTechStackCategory={toggleTechStackCategory}
                  onToggleTechStackEntry={toggleTechStackEntry}
                />
              ))}
            </Col>
            <Col xl={3}>
              <ExportSummary
                counts={summaryCounts}
                onGenerate={() => handleGenerateCV("pdf")}
              />
            </Col>
          </Row>
        </AsyncState>
      </Container>
    </>
  );
};

export default CvGeneratorPage;
