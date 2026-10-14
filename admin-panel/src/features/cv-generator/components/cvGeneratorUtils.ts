export const SKILLS_SECTION_NAME = "skills";
export const TECH_STACK_SELECTABLE_SECTION_NAMES = new Set([
  "work_experience",
  "projects",
]);

const IGNORED_ITEM_FIELDS = new Set([
  "id",
  "createdAt",
  "updatedAt",
  "displayOrder",
  "techStack",
  "skillNames",
]);

const LONG_TEXT_FIELDS = [
  "description",
  "purpose",
  "summary",
  "about",
  "responsibilities",
  "achievement",
  "achievements",
  "details",
];

const TITLE_FIELDS = [
  "title",
  "name",
  "position",
  "role",
  "company",
  "school",
  "institution",
  "organization",
  "issuer",
];

const SUBTITLE_FIELDS = [
  "company",
  "organization",
  "school",
  "institution",
  "location",
  "type",
  "level",
];

export const formatLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const formatScalar = (value: unknown): string => {
  if (value == null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => formatScalar(entry))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return "";
  }

  return String(value);
};

const pickFirstValue = (item: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = formatScalar(item[key]);
    if (value) {
      return value;
    }
  }

  return "";
};

export const getItemTitle = (item: Record<string, unknown>, fallback: string) =>
  pickFirstValue(item, TITLE_FIELDS) || fallback;

export const getItemSubtitle = (item: Record<string, unknown>) => {
  const values = SUBTITLE_FIELDS.map((key) => formatScalar(item[key])).filter(
    Boolean,
  );

  return [...new Set(values)].slice(0, 2).join(" • ");
};

export const getLongDescription = (item: Record<string, unknown>) => {
  for (const key of LONG_TEXT_FIELDS) {
    const value = formatScalar(item[key]);
    if (value) {
      return value;
    }
  }

  return "";
};

const formatDate = (value: unknown) => {
  const rawValue = formatScalar(value);
  if (!rawValue) return "";

  const isoDate = /^\d{4}-\d{2}/.exec(rawValue)?.[0];
  if (!isoDate) return rawValue;

  const [year, month] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
};

export const getItemDateRange = (item: Record<string, unknown>) => {
  const startDate = formatDate(item.startDate);
  if (!startDate) return "";

  const endDate = formatDate(item.endDate) || "Present";
  return `${startDate} – ${endDate}`;
};

const parseDelimitedValues = (value: unknown): string[] =>
  formatScalar(value)
    .split(/[\n,;]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry, index, all) => all.indexOf(entry) === index);

export const parseSkillNames = (value: unknown): string[] =>
  parseDelimitedValues(value);

export const parseTechStack = (value: unknown): string[] =>
  parseDelimitedValues(value);

export type CustomSkillCategory = {
  id: string;
  name: string;
  skills: string[];
};

export const parseCustomSkillsText = (value: string): CustomSkillCategory[] =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex < 1) return null;

      const name = line.slice(0, separatorIndex).trim();
      const skills = parseDelimitedValues(line.slice(separatorIndex + 1));
      if (!name || skills.length === 0) return null;

      return {
        id: `custom-skill-category-${index}`,
        name,
        skills,
      };
    })
    .filter((category): category is CustomSkillCategory => category !== null);

export const serializeCustomSkillCategories = (
  categories: CustomSkillCategory[],
) =>
  categories
    .filter((category) => category.name.trim() || category.skills.length > 0)
    .map((category) => `${category.name.trim()}: ${category.skills.join(", ")}`)
    .join("\n");

const dateSortValue = (item: Record<string, unknown>) => {
  for (const key of ["startDate", "date", "issuedAt", "createdAt"]) {
    const value = formatScalar(item[key]);
    if (!value) continue;
    const timestamp = Date.parse(value);
    if (!Number.isNaN(timestamp)) return timestamp;
  }
  return Number.NEGATIVE_INFINITY;
};

export const sortCvItemsLatestFirst = <T extends object>(items: T[]) =>
  [...items].sort((a, b) => {
    const first = a as Record<string, unknown>;
    const second = b as Record<string, unknown>;
    const firstDate = dateSortValue(first);
    const secondDate = dateSortValue(second);
    if (firstDate !== secondDate) {
      return secondDate > firstDate ? 1 : -1;
    }

    return Number(second.displayOrder ?? 0) - Number(first.displayOrder ?? 0);
  });

export const buildOverrideKey = (
  sectionName: string,
  itemId: string | number,
) => `${sectionName}:${itemId}`;

export const buildScopedItemKey = (
  sectionName: string,
  itemId: string | number,
) => `${sectionName}:${itemId}`;

export const applyDescriptionOverride = (
  item: Record<string, unknown>,
  overrideText: string,
) => {
  const trimmedOverride = overrideText.trim();
  if (!trimmedOverride) {
    return item;
  }

  const updatedItem = { ...item };
  const existingField = LONG_TEXT_FIELDS.find((field) => {
    const value = updatedItem[field];
    return typeof value === "string";
  });

  if (existingField) {
    updatedItem[existingField] = trimmedOverride;
  } else {
    updatedItem.description = trimmedOverride;
  }

  return updatedItem;
};

export const canOverrideDescription = (item: Record<string, unknown>) =>
  Boolean(getLongDescription(item));

export const getMetadataEntries = (item: Record<string, unknown>) =>
  Object.entries(item)
    .filter(([key, value]) => {
      if (
        IGNORED_ITEM_FIELDS.has(key) ||
        LONG_TEXT_FIELDS.includes(key) ||
        TITLE_FIELDS.includes(key) ||
        SUBTITLE_FIELDS.includes(key)
      ) {
        return false;
      }

      return Boolean(formatScalar(value));
    })
    .slice(0, 6)
    .map(([key, value]) => ({
      label: formatLabel(key),
      value: formatScalar(value),
    }));
