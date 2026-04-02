export const SKILLS_SECTION_NAME = "skills";

const IGNORED_ITEM_FIELDS = new Set([
  "id",
  "createdAt",
  "updatedAt",
  "displayOrder",
]);

const LONG_TEXT_FIELDS = [
  "description",
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

export const parseSkillNames = (value: unknown): string[] =>
  formatScalar(value)
    .split(/[\n,;]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter((entry, index, all) => all.indexOf(entry) === index);

export const buildOverrideKey = (sectionName: string, itemId: string | number) =>
  `${sectionName}:${itemId}`;

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
      if (IGNORED_ITEM_FIELDS.has(key) || LONG_TEXT_FIELDS.includes(key)) {
        return false;
      }

      return Boolean(formatScalar(value));
    })
    .slice(0, 6)
    .map(([key, value]) => ({
      label: formatLabel(key),
      value: formatScalar(value),
    }));
