import { useQueries } from "@tanstack/react-query";
import {
  AlbumService,
  CertificateControllerService,
  EducationControllerService,
  HealthService,
  ProjectControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
  queryKeys,
} from "@/api";

export const useOverviewQueries = () =>
  useQueries({
    queries: [
      {
        queryKey: queryKeys.projects,
        queryFn: () => ProjectControllerService.listProject(),
      },
      {
        queryKey: queryKeys.cv.workExperience,
        queryFn: () => WorkExperienceControllerService.listWorkExperience(),
      },
      {
        queryKey: queryKeys.cv.education,
        queryFn: () => EducationControllerService.listEducation(),
      },
      {
        queryKey: queryKeys.cv.skills,
        queryFn: () => SkillControllerService.listSkill(),
      },
      {
        queryKey: queryKeys.cv.certifications,
        queryFn: () => CertificateControllerService.listCertificate(),
      },
      {
        queryKey: queryKeys.albums.list("all"),
        queryFn: async () => (await AlbumService.getV1Album("all")).data ?? [],
      },
      {
        queryKey: ["health", "images"],
        queryFn: () => HealthService.getV1AlbumHealth(),
      },
      {
        queryKey: ["health", "llm"],
        queryFn: () => HealthService.getV1LlmHealth(),
      },
      {
        queryKey: ["health", "account"],
        queryFn: () => HealthService.getHealth(),
      },
    ],
  });
