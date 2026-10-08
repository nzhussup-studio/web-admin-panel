import {
  CertificateControllerService,
  EducationControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
} from "@/api";

export const listWorkExperience = () =>
  WorkExperienceControllerService.listWorkExperience();
export const listEducation = () => EducationControllerService.listEducation();
export const listSkills = () => SkillControllerService.listSkill();
export const listCertifications = () =>
  CertificateControllerService.listCertificate();
