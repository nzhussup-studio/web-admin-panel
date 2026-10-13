import { useQueries } from "@tanstack/react-query";
import {
  AlbumService,
  CertificateControllerService,
  EducationControllerService,
  HealthControllerService,
  HealthService,
  ProjectControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
  queryKeys,
} from "@/api";
import { keycloakHealthUrl } from "@/providers/auth/keycloak";

const checkKeycloakHealth = async () => {
  const response = await fetch(keycloakHealthUrl, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Keycloak health check failed with status ${response.status}`,
    );
  }

  return response.json();
};

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
        queryKey: ["health", "base"],
        queryFn: () => HealthControllerService.baseServiceHealth(),
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
        queryFn: () => HealthService.getV1AccountHealth(),
      },
      {
        queryKey: ["health", "keycloak"],
        queryFn: checkKeycloakHealth,
      },
    ],
  });
