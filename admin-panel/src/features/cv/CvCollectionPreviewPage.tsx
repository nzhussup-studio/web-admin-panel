import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryKeys } from "@/api";
import { ColorPills } from "@/components/ui/color-pills";
import { PreviewPage, type PreviewGroup } from "@/components/ui/preview-page";
import { MarkdownContent } from "@/components/ui/markdown-field";
import { listEducation, listWorkExperience } from "./api";

type PreviewKind = "work-experience" | "education";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString() : "Present";

function CvCollectionPreviewPage({ kind }: { kind: PreviewKind }) {
  const navigate = useNavigate();
  const isWorkExperience = kind === "work-experience";
  const backPath = isWorkExperience ? "/cv/work-experience" : "/cv/education";
  const label = isWorkExperience ? "Work experience" : "Education";
  const query = useQuery({
    queryKey: isWorkExperience
      ? queryKeys.cv.workExperience
      : queryKeys.cv.education,
    queryFn: isWorkExperience ? listWorkExperience : listEducation,
  });
  const entries = [...(query.data ?? [])].sort(
    (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
  );

  const groups: PreviewGroup[] = entries.map((entry) =>
    isWorkExperience
      ? {
          key: entry.id ?? entry.position,
          title: entry.position || "Work experience",
          subtitle: entry.company,
          fields: [
            { label: "Company", value: entry.company },
            { label: "Location", value: entry.location },
            {
              label: "Period",
              value: `${formatDate(entry.startDate)} – ${formatDate(entry.endDate)}`,
            },
            { label: "Display order", value: entry.displayOrder },
            {
              label: "Tech stack",
              value: <ColorPills values={entry.techStack} />,
              wide: true,
            },
            {
              label: "Description",
              value: entry.description ? (
                <MarkdownContent>{entry.description}</MarkdownContent>
              ) : null,
              wide: true,
            },
          ],
        }
      : {
          key: entry.id ?? entry.degree,
          title: entry.degree || "Education",
          subtitle: entry.institution,
          fields: [
            { label: "Institution", value: entry.institution },
            { label: "Location", value: entry.location },
            {
              label: "Period",
              value: `${formatDate(entry.startDate)} – ${formatDate(entry.endDate)}`,
            },
            { label: "Display order", value: entry.displayOrder },
            { label: "Thesis", value: entry.thesis, wide: true },
            {
              label: "Description",
              value: entry.description ? (
                <MarkdownContent>{entry.description}</MarkdownContent>
              ) : null,
              wide: true,
            },
          ],
        },
  );

  return (
    <PreviewPage
      title={`${label} preview`}
      description={`Rendered preview of all ${label.toLowerCase()} entries.`}
      breadcrumbs={[
        { label: "Overview", to: "/" },
        { label: "CV", to: "/cv" },
        { label, to: backPath },
        { label: "Preview" },
      ]}
      groups={groups}
      loading={query.isPending}
      error={query.error}
      isEmpty={!query.isPending && groups.length === 0}
      onBack={() => navigate(backPath)}
    />
  );
}

export const WorkExperiencePreviewPage = () => (
  <CvCollectionPreviewPage kind="work-experience" />
);
export const EducationPreviewPage = () => (
  <CvCollectionPreviewPage kind="education" />
);
