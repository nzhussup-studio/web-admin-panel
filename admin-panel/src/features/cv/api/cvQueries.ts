import {
  CertificateControllerService,
  EducationControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
} from "@/api";

export const listAdminWorkExperiences = () =>
  WorkExperienceControllerService.listAdminWorkExperiences();
export const listAdminEducationRecords = () => EducationControllerService.listAdminEducationRecords();
export const listAdminSkillss = () => SkillControllerService.listAdminSkills();
export const listCertifications = () =>
  CertificateControllerService.listAdminCertificates();
