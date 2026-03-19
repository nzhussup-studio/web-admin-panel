import Header from "@/components/layout/Header";
import PageState from "@/components/pages/PageState";
import GlobalAlert from "@/components/layout/GlobalAlert";
import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
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
import { normalizeApiError } from "@/lib/api/errors";
import config from "@/config/app-config";
import { generateCV } from "@/lib/cv/generateCv";
import { BackCircleIcon, DownloadIcon, FunnelIcon } from "@/assets/icons";
import { useNavigate } from "react-router-dom";

type BasicInfo = Record<string, string>;
type SelectedItems = Record<string, Set<string | number>>;

const CvGeneratorPage = () => {
  const navigate = useNavigate();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [basicInfo, setBasicInfo] = useState<BasicInfo>(() => {
    try {
      const saved = localStorage.getItem(config.cvGeneratorLocalStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return (
          parsed.basicInfo || {
            name: "Nurzhanat Zhussup",
            address: "123 Main St, Vienna, Austria",
            email: "john.doe@example.com",
            phone: "+7 777 777 7777",
            website: "https://nzhussup.com",
            linkedin: "https://www.linkedin.com/in/nurzhanat-zhussup/",
            github: "https://github.com/nzhussup",
            about:
              "A passionate software engineer with a focus on cloud and ML.",
          }
        );
      }
    } catch (e) {
      console.error("Failed to parse basic info from localStorage", e);
    }
    return {
      name: "Nurzhanat Zhussup",
      address: "123 Main St, Vienna, Austria",
      email: "john.doe@example.com",
      phone: "+7 777 777 7777",
      website: "https://nzhussup.com",
      linkedin: "https://www.linkedin.com/in/nurzhanat-zhussup/",
      github: "https://github.com/nzhussup",
      about:
        "A passionate software engineer with a focus on backend and infrastructure.",
    };
  });

  const [data, setData] = useState<any[]>([]);
  const [isAscending, setIsAscending] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setShowLoading(true);
    setError(null);
    try {
      const [
        work_experience,
        education,
        skills,
        projects,
        certificates,
      ] = await Promise.all([
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
            : Number(b.displayOrder) - Number(a.displayOrder)
        );

      setData([
        { work_experience: sortItems(work_experience) },
        { education: sortItems(education) },
        { skills: sortItems(skills) },
        { projects: sortItems(projects) },
        { certificates: sortItems(certificates) },
      ]);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  }, [isAscending]);

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
    };

    localStorage.setItem(
      config.cvGeneratorLocalStorageKey,
      JSON.stringify(fullState)
    );
  }, [selectedItems, basicInfo]);

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

  const handleGenerateCV = (output) => {
    const selectedData = { basic_info: basicInfo };
    for (const sectionObj of data) {
      const sectionName = Object.keys(sectionObj)[0];
      const items = sectionObj[sectionName];
      const selectedIndices = selectedItems[sectionName];
      if (selectedIndices && selectedIndices.size > 0) {
        selectedData[sectionName] = items.filter((item) =>
          selectedIndices.has(item.id)
        );
      }
    }
    if (Object.keys(selectedData).length === 0) {
      setAlertMessage("Please select at least one item to generate CV.");
      setAlertVisible(true);
    } else {
      setAlertMessage("CV generated successfully (mock)!");
      setAlertVisible(true);
      console.log("Selected data for CV:", selectedData);
    }
    generateCV(selectedData, output);
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };
  const generatorPage = (
    <div>
      <Card className='rounded-4 app-interactive-card mt-4'>
        <Card.Body className='p-4 app-card-body'>
          <Card.Title className='fw-semibold mb-4 app-card-title'>Basic Information</Card.Title>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row className='g-3'>
              {Object.entries(basicInfo).map(([key, value]) => (
                <Col key={key} md={key === "about" ? 12 : 6}>
                  <Form.Group controlId={`basic-info-${key}`}>
                    <Form.Label className='text-capitalize fw-semibold'>
                      {key.replace(/_/g, " ")}
                    </Form.Label>
                    {key === "about" ? (
                      <Form.Control
                        as='textarea'
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
                        type='text'
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
          selectedItems[sectionName]?.has(item.id)
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
          <Card key={index} className='rounded-4 app-interactive-card mt-4'>
            <Card.Body className='p-4 app-card-body'>
              <div className='d-flex justify-content-between align-items-center gap-3 mb-3'>
                <Card.Title className='mb-0 text-capitalize fw-semibold app-card-title'>
                  {sectionName.replace(/_/g, " ")}
                </Card.Title>
                <Button
                  onClick={handleToggleAll}
                  type='button'
                  variant='outline-secondary'
                  size='sm'
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </Button>
              </div>
            {Array.isArray(items) && items.length > 0 ? (
              items.map((item) => {
                const itemId = item.id;
                const isChecked =
                  selectedItems[sectionName]?.has(itemId) || false;

                return (
                  <Form.Check
                    key={itemId}
                    type='checkbox'
                    className={`rounded-3 border p-3 mb-2 ${isChecked ? "bg-primary-subtle" : "bg-body-tertiary"}`}
                    checked={isChecked}
                    onChange={() => toggleSelect(sectionName, itemId)}
                    label={
                      <pre className='mb-0 text-wrap' style={{ whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    }
                  />
                );
              })
            ) : (
              <div className='text-secondary'>No items</div>
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
        type='danger'
      />
      <Container className='my-5'>
        <Stack
          direction='horizontal'
          gap={3}
          className='align-items-center justify-content-between flex-wrap mb-4'
        >
          <Button
            variant='outline-secondary'
            className='d-inline-flex align-items-center gap-2'
            onClick={() => navigate(-1)}
          >
            <BackCircleIcon width={16} height={16} />
            Back
          </Button>
          <div className='d-flex align-items-center gap-2 flex-wrap ms-auto'>
            <Button
              variant='outline-primary'
              className='d-inline-flex align-items-center gap-2'
              onClick={toggleSort}
            >
              <FunnelIcon width={16} height={16} />
              Sort
            </Button>
            <ButtonGroup>
              <Button
                variant='outline-primary'
                className='d-inline-flex align-items-center gap-2'
                onClick={() => handleGenerateCV("pdf")}
              >
                <DownloadIcon width={16} height={16} />
                Export to PDF
              </Button>
              <Button
                variant='primary'
                className='d-inline-flex align-items-center gap-2'
                onClick={() => handleGenerateCV("word")}
              >
                <DownloadIcon width={16} height={16} />
                Export to Word
              </Button>
            </ButtonGroup>
          </div>
        </Stack>

        <PageState isEmpty={data.length === 0} loading={showLoading} error={error}>
          {generatorPage}
        </PageState>
      </Container>
    </>
  );
};

export default CvGeneratorPage;
