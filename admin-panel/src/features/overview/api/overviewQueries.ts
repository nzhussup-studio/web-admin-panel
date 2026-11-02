import { useQueries } from "@tanstack/react-query";
import {
  AlbumService,
  CertificateControllerService,
  ConfigurationService,
  EducationControllerService,
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
        queryFn: () => ProjectControllerService.listAdminProjects(),
      },
      {
        queryKey: queryKeys.cv.workExperience,
        queryFn: () =>
          WorkExperienceControllerService.listAdminWorkExperiences(),
      },
      {
        queryKey: queryKeys.cv.education,
        queryFn: () => EducationControllerService.listAdminEducationRecords(),
      },
      {
        queryKey: queryKeys.cv.skills,
        queryFn: () => SkillControllerService.listAdminSkills(),
      },
      {
        queryKey: queryKeys.cv.certifications,
        queryFn: () => CertificateControllerService.listAdminCertificates(),
      },
      {
        queryKey: queryKeys.albums.list("all"),
        queryFn: async () =>
          (await AlbumService.getV1AdminAlbums("all")).data ?? [],
      },
      {
        queryKey: ["configuration", "llm"],
        queryFn: () => ConfigurationService.getV1AdminLlmConfiguration(),
      },
      {
        queryKey: ["health", "keycloak"],
        queryFn: checkKeycloakHealth,
      },
    ],
  });
