import {
  CertificateControllerService,
  EducationControllerService,
  ProjectControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
} from "@/api";

export async function getCvGeneratorSourceData() {
  const [workExperience, education, skills, projects, certificates] =
    await Promise.all([
      WorkExperienceControllerService.listAdminWorkExperiences(),
      EducationControllerService.listAdminEducationRecords(),
      SkillControllerService.listAdminSkills(),
      ProjectControllerService.listAdminProjects(),
      CertificateControllerService.listAdminCertificates(),
    ]);
  return { workExperience, education, skills, projects, certificates };
}
