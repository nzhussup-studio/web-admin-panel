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
      WorkExperienceControllerService.listWorkExperience(),
      EducationControllerService.listEducation(),
      SkillControllerService.listSkill(),
      ProjectControllerService.listProject(),
      CertificateControllerService.listCertificate(),
    ]);
  return { workExperience, education, skills, projects, certificates };
}
