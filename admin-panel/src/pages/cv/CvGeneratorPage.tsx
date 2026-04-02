import Header from "@/components/layout/Header";
import PageState from "@/components/pages/PageState";
import GlobalAlert from "@/components/layout/GlobalAlert";
import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
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

type BasicInfo = Record<string, string>;
type SelectedItems = Record<string, Set<string | number>>;
type DescriptionOverrides = Record<string, string>;

const IGNORED_ITEM_FIELDS = new Set([
  "id",
  "createdAt",
  "updatedAt",
  "displayOrder",
]);

const LONG_TEXT_FIELDS = [
  "description",
  "summary",
  "about",
  "responsibilities",
  "achievement",
  "achievements",
  "details",
];

const TITLE_FIELDS = [
  "title",
  "name",
  "position",
  "role",
  "company",
  "school",
  "institution",
  "organization",
  "issuer",
];

const SUBTITLE_FIELDS = [
  "company",
  "organization",
  "school",
  "institution",
  "location",
  "type",
  "level",
];

const formatLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

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

const formatScalar = (value: unknown): string => {
  if (value == null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => formatScalar(entry))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return "";
  }

  return String(value);
};

const pickFirstValue = (item: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = formatScalar(item[key]);
    if (value) {
      return value;
    }
  }

  return "";
};

const getItemTitle = (item: Record<string, unknown>, fallback: string) =>
  pickFirstValue(item, TITLE_FIELDS) || fallback;

const getItemSubtitle = (item: Record<string, unknown>) => {
  const values = SUBTITLE_FIELDS.map((key) => formatScalar(item[key])).filter(
    Boolean,
  );

  return [...new Set(values)].slice(0, 2).join(" • ");
};

const getLongDescription = (item: Record<string, unknown>) => {
  for (const key of LONG_TEXT_FIELDS) {
    const value = formatScalar(item[key]);
    if (value) {
      return value;
    }
  }

  return "";
};

const buildOverrideKey = (sectionName: string, itemId: string | number) =>
  `${sectionName}:${itemId}`;

const applyDescriptionOverride = (
  item: Record<string, unknown>,
  overrideText: string,
) => {
  const trimmedOverride = overrideText.trim();
  if (!trimmedOverride) {
    return item;
  }

  const updatedItem = { ...item };
  const existingField = LONG_TEXT_FIELDS.find((field) => {
    const value = updatedItem[field];
    return typeof value === "string";
  });

  if (existingField) {
    updatedItem[existingField] = trimmedOverride;
  } else {
    updatedItem.description = trimmedOverride;
  }

  return updatedItem;
};

const canOverrideDescription = (item: Record<string, unknown>) =>
  Boolean(getLongDescription(item));

const getMetadataEntries = (item: Record<string, unknown>) =>
  Object.entries(item)
    .filter(([key, value]) => {
      if (IGNORED_ITEM_FIELDS.has(key) || LONG_TEXT_FIELDS.includes(key)) {
        return false;
      }

      return Boolean(formatScalar(value));
    })
    .slice(0, 6)
    .map(([key, value]) => ({
      label: formatLabel(key),
      value: formatScalar(value),
    }));

const renderItemLabel = (
  sectionName: string,
  item: Record<string, unknown>,
  isChecked: boolean,
) => {
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

const CvGeneratorPage = () => {
  const navigate = useNavigate();
  const { triggerAlert } = useOptionalGlobalAlert();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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

  const [data, setData] = useState<any[]>([]);
  const [isAscending, setIsAscending] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [descriptionOverrides, setDescriptionOverrides] =
    useState<DescriptionOverrides>(() => {
      try {
        const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.descriptionOverrides || {};
        }
      } catch (e) {
        console.error("Failed to parse description overrides from localStorage", e);
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

      setData([
        { work_experience: sortItems(work_experience) },
        { education: sortItems(education) },
        { skills: sortItems(skills) },
        { projects: sortItems(projects) },
        { certificates: sortItems(certificates) },
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

  const [selectedItems, setSelectedItems] = useState<SelectedItems>(() => {
    try {
      const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const withSets: SelectedItems = {};
        for (const section in parsed.selectedItems || {}) {
          withSets[section] = new Set(parsed.selectedItems[section]);
        }
        return withSets;
      }
    } catch (e) {
      console.error("Failed to parse selected items from localStorage", e);
    }
    return {};
  });

  useEffect(() => {
    const serializableSelected: Record<string, Array<string | number>> = {};
    for (const section in selectedItems) {
      serializableSelected[section] = Array.from(selectedItems[section]);
    }

    const fullState = {
      basicInfo,
      selectedItems: serializableSelected,
      descriptionOverrides,
    };

    localStorage.setItem(
      config.cvGeneratorLocalStorageKey,
      JSON.stringify(fullState),
    );
  }, [selectedItems, basicInfo, descriptionOverrides]);

  const hasOverrides = Object.values(descriptionOverrides).some((value) =>
    String(value || "").trim().length > 0,
  );

  const toggleSelect = (sectionName: string, itemId: string | number) => {
    setSelectedItems((prev) => {
      const sectionSet = new Set(prev[sectionName] || []);
      if (sectionSet.has(itemId)) {
        sectionSet.delete(itemId);
      } else {
        sectionSet.add(itemId);
      }
      return { ...prev, [sectionName]: sectionSet };
    });
  };

  const buildSelectedData = () => {
    const selectedData = { basic_info: basicInfo };
    for (const sectionObj of data) {
      const sectionName = Object.keys(sectionObj)[0];
      const items = sectionObj[sectionName];
      const selectedIndices = selectedItems[sectionName];
      if (selectedIndices && selectedIndices.size > 0) {
        selectedData[sectionName] = items
          .filter((item) => selectedIndices.has(item.id))
          .map((item) => {
            if (!canOverrideDescription(item)) {
              return item;
            }
            return applyDescriptionOverride(
              item,
              descriptionOverrides[buildOverrideKey(sectionName, item.id)] || "",
            );
          });
      }
    }
    return selectedData;
  };

  const handleGenerateCV = (output) => {
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
  const generatorPage = (
    <div>
      <Card className="rounded-4 app-interactive-card mt-4">
        <Card.Body className="p-4 app-card-body">
          <Card.Title className="fw-semibold mb-4 app-card-title">
            Basic Information
          </Card.Title>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row className="g-3">
              {Object.entries(basicInfo).map(([key, value]) => (
                <Col key={key} md={key === "about" ? 12 : 6}>
                  <Form.Group controlId={`basic-info-${key}`}>
                    <Form.Label className="text-capitalize fw-semibold">
                      {key.replace(/_/g, " ")}
                    </Form.Label>
                    {key === "about" ? (
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={String(value ?? "")}
                        onChange={(e) =>
                          setBasicInfo((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={String(value ?? "")}
                        onChange={(e) =>
                          setBasicInfo((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {data.map((sectionObj, index) => {
        const sectionName = Object.keys(sectionObj)[0];
        const items = sectionObj[sectionName];

        const allSelected = items.every((item) =>
          selectedItems[sectionName]?.has(item.id),
        );

        const handleToggleAll = () => {
          setSelectedItems((prev) => {
            const updatedSet = new Set<string | number>();
            if (!allSelected) {
              for (const item of items) {
                updatedSet.add(item.id);
              }
            }
            return { ...prev, [sectionName]: updatedSet };
          });
        };

        return (
          <Card key={index} className="rounded-4 app-interactive-card mt-4">
            <Card.Body className="p-4 app-card-body">
              <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                <div>
                  <Card.Title className="mb-1 text-capitalize fw-semibold app-card-title">
                    {sectionName.replace(/_/g, " ")}
                  </Card.Title>
                  <div className="text-body-secondary small">
                    {selectedItems[sectionName]?.size || 0} selected
                  </div>
                </div>
                <Button
                  onClick={handleToggleAll}
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </Button>
              </div>
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item) => {
                  const itemId = item.id;
                  const isChecked =
                    selectedItems[sectionName]?.has(itemId) || false;
                  const overrideKey = buildOverrideKey(sectionName, itemId);
                  const overrideValue = descriptionOverrides[overrideKey] || "";
                  const defaultDescription = getLongDescription(item);
                  const showOverrideInput =
                    isChecked && canOverrideDescription(item);

                  return (
                    <div key={itemId} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        className={`position-relative rounded-4 border px-3 py-2 shadow-sm ${
                          isChecked
                            ? "bg-primary-subtle border-primary-subtle"
                            : "bg-body-tertiary border-secondary-subtle"
                        }`}
                        checked={isChecked}
                        onChange={() => toggleSelect(sectionName, itemId)}
                        label={renderItemLabel(sectionName, item, isChecked)}
                      />
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
                                : "Type a custom compressed description..."
                            }
                            onChange={(e) =>
                              setDescriptionOverrides((prev) => {
                                const nextValue = e.target.value;
                                if (!nextValue.trim()) {
                                  const { [overrideKey]: _removed, ...rest } = prev;
                                  return rest;
                                }
                                return {
                                  ...prev,
                                  [overrideKey]: nextValue,
                                };
                              })
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
      })}
    </div>
  );

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

        <PageState
          isEmpty={data.length === 0}
          loading={showLoading}
          error={error}
        >
          {generatorPage}
        </PageState>
      </Container>
    </>
  );
};

export default CvGeneratorPage;
