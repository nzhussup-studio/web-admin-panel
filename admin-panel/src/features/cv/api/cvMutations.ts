import {
  CertificateControllerService,
  EducationControllerService,
  SkillControllerService,
  WorkExperienceControllerService,
  type base_service_Certificate,
  type base_service_Education,
  type base_service_Skill,
  type base_service_WorkExperience,
} from "@/api";

export const createWorkExperience = (value: base_service_WorkExperience) =>
  WorkExperienceControllerService.createWorkExperience(value);
export const updateWorkExperience = (value: base_service_WorkExperience) =>
  WorkExperienceControllerService.updateWorkExperience(value);
export const deleteWorkExperience = (id: number) =>
  WorkExperienceControllerService.deleteWorkExperience({ id });
export const createEducation = (value: base_service_Education) =>
  EducationControllerService.createEducation(value);
export const updateEducation = (value: base_service_Education) =>
  EducationControllerService.updateEducation(value);
export const deleteEducation = (id: number) =>
  EducationControllerService.deleteEducation({ id });
export const createSkill = (value: base_service_Skill) =>
  SkillControllerService.createSkill(value);
export const updateSkill = (value: base_service_Skill) =>
  SkillControllerService.updateSkill(value);
export const deleteSkill = (id: number) =>
  SkillControllerService.deleteSkill({ id });
export const createCertification = (value: base_service_Certificate) =>
  CertificateControllerService.createCertificate(value);
export const updateCertification = (value: base_service_Certificate) =>
  CertificateControllerService.updateCertificate(value);
export const deleteCertification = (id: number) =>
  CertificateControllerService.deleteCertificate({ id });
