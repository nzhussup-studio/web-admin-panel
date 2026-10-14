import type { ComponentType } from "react";

export type CvRecord = {
  id?: string | number;
  displayOrder?: number;
  name?: string;
  position?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  purpose?: string;
  techStack?: string;
  institution?: string;
  degree?: string;
  thesis?: string;
  category?: string;
  skillNames?: string;
  issuer?: string;
  url?: string;
};

export type CvData = {
  basic_info?: Record<string, string>;
  work_experience?: CvRecord[];
  education?: CvRecord[];
  skills?: CvRecord[];
  projects?: CvRecord[];
  certificates?: CvRecord[];
};

export type CvSectionName =
  | "work_experience"
  | "education"
  | "skills"
  | "projects"
  | "certificates";

export type BasicInfoFieldDefinition = {
  key: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  wide?: boolean;
};

export type CvTemplateModule = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  sectionOrder: CvSectionName[];
  basicInfoTitle: string;
  basicInfoDescription: string;
  basicInfoFields: BasicInfoFieldDefinition[];
  component: ComponentType<{ data: CvData }>;
};
