import { professionalTemplate } from "./professional";
import { standardTemplate } from "./standard";

export type {
  BasicInfoFieldDefinition,
  CvData,
  CvSectionName,
  CvTemplateModule,
} from "./types";

export const CV_TEMPLATES = {
  modern: standardTemplate,
  professional: professionalTemplate,
} as const;

export type CvTemplateId = keyof typeof CV_TEMPLATES;

export const CV_TEMPLATE_IDS = Object.keys(CV_TEMPLATES) as CvTemplateId[];

export const getCvTemplate = (id: CvTemplateId) => CV_TEMPLATES[id];

export const isCvTemplateId = (value: unknown): value is CvTemplateId =>
  typeof value === "string" && value in CV_TEMPLATES;
