import Header from "@/components/layout/Header";
import PageState from "@/components/pages/PageState";
import GlobalAlert from "@/components/layout/GlobalAlert";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import {
  CertificateControllerService,
  EducationControllerService,
  ProjectControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
} from "@/lib/api/client";
import { getApiErrorMessage, normalizeApiError } from "@/lib/api/errors";
import config from "@/config/app-config";
import { generateCV, previewCV } from "@/lib/cv/generateCv";
import { BackCircleIcon, DownloadIcon, FunnelIcon } from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import CvGeneratorBasicInfoCard from "@/components/cv/generator/CvGeneratorBasicInfoCard";
import CvGeneratorSectionCard from "@/components/cv/generator/CvGeneratorSectionCard";
import {
  applyDescriptionOverride,
  buildOverrideKey,
  canOverrideDescription,
  parseSkillNames,
  SKILLS_SECTION_NAME,
} from "@/components/cv/generator/cvGeneratorUtils";

type BasicInfo = Record<string, string>;
type DescriptionOverrides = Record<string, string>;
type SelectedItems = Record<string, Set<string | number>>;
type SelectedSkillEntries = Record<string, Set<string>>;
type CvSection = {
  sectionName: string;
  items: Record<string, any>[];
};

const DEFAULT_BASIC_INFO: BasicInfo = {
  name: "Nurzhanat Zhussup",
  address: "123 Main St, Vienna, Austria",
  email: "john.doe@example.com",
  phone: "+7 777 777 7777",
  website: "https://nzhussup.dev",
  linkedin: "https://www.linkedin.com/in/nurzhanat-zhussup/",
  github: "https://github.com/nzhussup",
  image_url: "",
  about:
    "A passionate software engineer with a focus on backend and infrastructure.",
};

const parseSavedSetMap = <T extends string | number>(
  savedValue: Record<string, T[]> | undefined,
): Record<string, Set<T>> => {
  const withSets: Record<string, Set<T>> = {};
  for (const key in savedValue || {}) {
    withSets[key] = new Set(savedValue?.[key] || []);
  }
  return withSets;
};

const CvGeneratorPage = () => {
  const navigate = useNavigate();
  const { triggerAlert } = useOptionalGlobalAlert();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [sections, setSections] = useState<CvSection[]>([]);
  const [isAscending, setIsAscending] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const [basicInfo, setBasicInfo] = useState<BasicInfo>(() => {
    try {
      const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_BASIC_INFO,
          ...(parsed.basicInfo || {}),
        };
      }
    } catch (e) {
      console.error("Failed to parse basic info from localStorage", e);
    }

    return DEFAULT_BASIC_INFO;
  });

  const [descriptionOverrides, setDescriptionOverrides] =
    useState<DescriptionOverrides>(() => {
      try {
        const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.descriptionOverrides || {};
        }
      } catch (e) {
        console.error(
          "Failed to parse description overrides from localStorage",
          e,
        );
      }

      return {};
    });

  const [selectedItems, setSelectedItems] = useState<SelectedItems>(() => {
    try {
      const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parseSavedSetMap(parsed.selectedItems);
      }
    } catch (e) {
      console.error("Failed to parse selected items from localStorage", e);
    }

    return {};
  });

  const [selectedSkillEntries, setSelectedSkillEntries] =
    useState<SelectedSkillEntries>(() => {
      try {
        const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parseSavedSetMap(parsed.selectedSkillEntries);
        }
      } catch (e) {
        console.error("Failed to parse selected skill entries from localStorage", e);
      }

      return {};
    });

  const fetchData = useCallback(async () => {
    setShowLoading(true);
    setError(null);

    try {
      const [work_experience, education, skills, projects, certificates] =
        await Promise.all([
          WorkExperienceControllerService.listWorkExperience(),
          EducationControllerService.listEducation(),
          SkillControllerService.listSkill(),
          ProjectControllerService.listProject(),
          CertificateControllerService.listCertificate(),
        ]);

      const sortItems = (items: Record<string, any>[]) =>
        [...items].sort((a, b) =>
          isAscending
            ? Number(a.displayOrder) - Number(b.displayOrder)
            : Number(b.displayOrder) - Number(a.displayOrder),
        );

      setSections([
        { sectionName: "work_experience", items: sortItems(work_experience) },
        { sectionName: "education", items: sortItems(education) },
        { sectionName: SKILLS_SECTION_NAME, items: sortItems(skills) },
        { sectionName: "projects", items: sortItems(projects) },
        { sectionName: "certificates", items: sortItems(certificates) },
      ]);
    } catch (fetchError) {
      const normalizedError = normalizeApiError(fetchError);
      setError(normalizedError);
      triggerAlert(
        getApiErrorMessage(fetchError, "Failed to load CV data"),
        "danger",
      );
    } finally {
      setShowLoading(false);
    }
  }, [isAscending, triggerAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const serializableSelectedItems: Record<string, Array<string | number>> = {};
    for (const sectionName in selectedItems) {
      serializableSelectedItems[sectionName] = Array.from(selectedItems[sectionName]);
    }

    const serializableSelectedSkillEntries: Record<string, string[]> = {};
    for (const itemId in selectedSkillEntries) {
      serializableSelectedSkillEntries[itemId] = Array.from(
        selectedSkillEntries[itemId],
      );
    }

    localStorage.setItem(
      config.cvGeneratorLocalStorageKey,
      JSON.stringify({
        basicInfo,
        selectedItems: serializableSelectedItems,
        descriptionOverrides,
        selectedSkillEntries: serializableSelectedSkillEntries,
      }),
    );
  }, [basicInfo, selectedItems, descriptionOverrides, selectedSkillEntries]);

  const hasOverrides = useMemo(
    () =>
      Object.values(descriptionOverrides).some(
        (value) => String(value || "").trim().length > 0,
      ),
    [descriptionOverrides],
  );

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

  const toggleSectionAll = (sectionName: string, items: Record<string, any>[]) => {
    const allSelected =
      items.length > 0 && items.every((item) => selectedItems[sectionName]?.has(item.id));

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
          if (sectionName === SKILLS_SECTION_NAME) {
            const allSkillNames = parseSkillNames(item.skillNames);
            if (allSkillNames.length === 0) {
              return item;
            }

            const selectedForItem = selectedSkillEntries[String(item.id)];
            const activeSkillNames = selectedForItem?.size
              ? allSkillNames.filter((skillName) => selectedForItem.has(skillName))
              : allSkillNames;

            if (activeSkillNames.length === 0) {
              return null;
            }

            return {
              ...item,
              skillNames: activeSkillNames.join(", "),
            };
          }

          if (!canOverrideDescription(item)) {
            return item;
          }

          return applyDescriptionOverride(
            item,
            descriptionOverrides[buildOverrideKey(sectionName, item.id)] || "",
          );
        })
        .filter(Boolean);
    }

    return selectedData;
  };

  const handleGenerateCV = (output: "pdf") => {
    const selectedData = buildSelectedData();

    if (Object.keys(selectedData).length === 0) {
      setAlertMessage("Please select at least one item to generate CV.");
      setAlertVisible(true);
    } else {
      setAlertMessage("CV generated successfully (mock)!");
      setAlertVisible(true);
    }

    generateCV(selectedData, output);
  };

  const handlePreviewCV = () => {
    const selectedData = buildSelectedData();
    previewCV(selectedData);
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  return (
    <>
      <Header text={"CV Generator"} />
      <GlobalAlert
        message={alertMessage}
        show={alertVisible}
        onClose={() => setAlertVisible(false)}
        type="danger"
      />

      <Container className="my-5">
        <Stack
          direction="horizontal"
          gap={3}
          className="align-items-center justify-content-between flex-wrap mb-4"
        >
          <Button
            variant="outline-secondary"
            className="d-inline-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <BackCircleIcon width={16} height={16} />
            Back
          </Button>

          <div className="d-flex align-items-center gap-2 flex-wrap ms-auto">
            <Button
              variant="outline-primary"
              className="d-inline-flex align-items-center gap-2"
              onClick={toggleSort}
            >
              <FunnelIcon width={16} height={16} />
              Sort
            </Button>
            <Button
              variant="outline-secondary"
              className="d-inline-flex align-items-center gap-2"
              onClick={handlePreviewCV}
            >
              Preview
            </Button>
            <Button
              variant="outline-danger"
              className="d-inline-flex align-items-center gap-2"
              onClick={() => setDescriptionOverrides({})}
              disabled={!hasOverrides}
            >
              Clear Overrides
            </Button>
            <Button
              variant="outline-primary"
              className="d-inline-flex align-items-center gap-2"
              onClick={() => handleGenerateCV("pdf")}
            >
              <DownloadIcon width={16} height={16} />
              Export to PDF
            </Button>
          </div>
        </Stack>

        <PageState isEmpty={sections.length === 0} loading={showLoading} error={error}>
          <CvGeneratorBasicInfoCard
            basicInfo={basicInfo}
            onBasicInfoChange={handleBasicInfoChange}
          />

          {sections.map((section) => (
            <CvGeneratorSectionCard
              key={section.sectionName}
              sectionName={section.sectionName}
              items={section.items}
              selectedItems={selectedItems[section.sectionName] || new Set()}
              descriptionOverrides={descriptionOverrides}
              selectedSkillEntries={selectedSkillEntries}
              onToggleAll={() => toggleSectionAll(section.sectionName, section.items)}
              onToggleItem={toggleSelect}
              onSetDescriptionOverride={setDescriptionOverride}
              onToggleSkillCategory={toggleSkillCategory}
              onToggleSkillEntry={toggleSkillEntry}
            />
          ))}
        </PageState>
      </Container>
    </>
  );
};

export default CvGeneratorPage;
