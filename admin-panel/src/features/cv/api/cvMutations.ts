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

export const createAdminWorkExperiences = (
  value: base_service_WorkExperience,
) => WorkExperienceControllerService.createAdminWorkExperiences(value);
export const updateAdminWorkExperiences = (
  value: base_service_WorkExperience,
) =>
  WorkExperienceControllerService.updateAdminWorkExperiences(
    Number(value.id),
    value,
  );
export const deleteAdminWorkExperiences = (id: number) =>
  WorkExperienceControllerService.deleteAdminWorkExperiences(id);
export const createAdminEducationRecords = (value: base_service_Education) =>
  EducationControllerService.createAdminEducationRecords(value);
export const updateAdminEducationRecords = (value: base_service_Education) =>
  EducationControllerService.updateAdminEducationRecords(
    Number(value.id),
    value,
  );
export const deleteAdminEducationRecords = (id: number) =>
  EducationControllerService.deleteAdminEducationRecords(id);
export const createAdminSkills = (value: base_service_Skill) =>
  SkillControllerService.createAdminSkills(value);
export const updateAdminSkills = (value: base_service_Skill) =>
  SkillControllerService.updateAdminSkills(Number(value.id), value);
export const deleteAdminSkills = (id: number) =>
  SkillControllerService.deleteAdminSkills(id);
export const createCertification = (value: base_service_Certificate) =>
  CertificateControllerService.createAdminCertificates(value);
export const updateCertification = (value: base_service_Certificate) =>
  CertificateControllerService.updateAdminCertificates(Number(value.id), value);
export const deleteCertification = (id: number) =>
  CertificateControllerService.deleteAdminCertificates(id);
