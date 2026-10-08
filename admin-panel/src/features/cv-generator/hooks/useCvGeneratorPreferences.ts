import { useEffect, useState } from "react";
import { useOptionalGlobalAlert } from "@/providers/alerts";
import {
  loadCvGeneratorPreferences,
  saveCvGeneratorPreferences,
} from "../preferences";

export type BasicInfo = Record<string, string>;
export type DescriptionOverrides = Record<string, string>;
export type SelectedItems = Record<string, Set<string | number>>;
export type SelectedSkillEntries = Record<string, Set<string>>;
export type SelectedTechStackEntries = Record<string, Set<string>>;

type SerializablePreferences = {
  basicInfo?: Record<string, unknown>;
  selectedItems?: Record<string, (string | number)[]>;
  descriptionOverrides?: DescriptionOverrides;
  selectedSkillEntries?: Record<string, string[]>;
  selectedTechStackEntries?: Record<string, string[]>;
};

const STORAGE_KEY = "cvGeneratorSelectedItems";
const defaultBasicInfo: BasicInfo = {
  name: "Nurzhanat Zhussup",
  address: "123 Main St, Vienna, Austria",
  email: "john.doe@example.com",
  phone: "+7 777 777 7777",
  website: "https://nzhussup.dev",
  linkedin: "https://www.linkedin.com/in/nurzhanat-zhussup/",
  github: "https://github.com/nzhussup",
  image_url: "",
  about:
    "A passionate software engineer with a focus on backend and infrastructure.",
};

const readLocalPreferences = (): SerializablePreferences => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const toSetMap = <T extends string | number>(
  value?: Record<string, T[]>,
): Record<string, Set<T>> =>
  Object.fromEntries(
    Object.entries(value ?? {}).map(([key, entries]) => [
      key,
      new Set(entries),
    ]),
  );

const toArrayMap = <T extends string | number>(value: Record<string, Set<T>>) =>
  Object.fromEntries(
    Object.entries(value).map(([key, entries]) => [key, [...entries]]),
  );

export function useCvGeneratorPreferences() {
  const { triggerAlert } = useOptionalGlobalAlert();
  const [initialPreferences] = useState(readLocalPreferences);
  const [isSyncingPreferences, setIsSyncingPreferences] = useState(false);
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    ...defaultBasicInfo,
    ...(initialPreferences.basicInfo as BasicInfo | undefined),
  });
  const [descriptionOverrides, setDescriptionOverrides] =
    useState<DescriptionOverrides>(
      initialPreferences.descriptionOverrides ?? {},
    );
  const [selectedItems, setSelectedItems] = useState<SelectedItems>(() =>
    toSetMap(initialPreferences.selectedItems),
  );
  const [selectedSkillEntries, setSelectedSkillEntries] =
    useState<SelectedSkillEntries>(() =>
      toSetMap(initialPreferences.selectedSkillEntries),
    );
  const [selectedTechStackEntries, setSelectedTechStackEntries] =
    useState<SelectedTechStackEntries>(() =>
      toSetMap(initialPreferences.selectedTechStackEntries),
    );

  const serialize = () => ({
    basicInfo,
    selectedItems: toArrayMap(selectedItems),
    descriptionOverrides,
    selectedSkillEntries: toArrayMap(selectedSkillEntries),
    selectedTechStackEntries: toArrayMap(selectedTechStackEntries),
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        basicInfo,
        selectedItems: toArrayMap(selectedItems),
        descriptionOverrides,
        selectedSkillEntries: toArrayMap(selectedSkillEntries),
        selectedTechStackEntries: toArrayMap(selectedTechStackEntries),
      }),
    );
  }, [
    basicInfo,
    descriptionOverrides,
    selectedItems,
    selectedSkillEntries,
    selectedTechStackEntries,
  ]);

  const syncToBackend = async () => {
    setIsSyncingPreferences(true);
    try {
      await saveCvGeneratorPreferences(serialize());
      triggerAlert("Preferences synced to backend.", "success");
    } catch {
      triggerAlert("Failed to sync preferences.", "danger");
    } finally {
      setIsSyncingPreferences(false);
    }
  };

  const syncFromBackend = async () => {
    setIsSyncingPreferences(true);
    try {
      const loaded =
        (await loadCvGeneratorPreferences()) as SerializablePreferences | null;
      if (!loaded) {
        triggerAlert("No preferences are saved in the backend yet.", "warning");
        return;
      }

      const loadedBasicInfo = Object.fromEntries(
        Object.entries(loaded.basicInfo ?? {}).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string",
        ),
      );
      setBasicInfo((current) => ({ ...current, ...loadedBasicInfo }));
      setSelectedItems(toSetMap(loaded.selectedItems));
      setDescriptionOverrides(loaded.descriptionOverrides ?? {});
      setSelectedSkillEntries(toSetMap(loaded.selectedSkillEntries));
      setSelectedTechStackEntries(toSetMap(loaded.selectedTechStackEntries));
      triggerAlert("Preferences synced from backend.", "success");
    } catch {
      triggerAlert("Failed to sync preferences from backend.", "danger");
    } finally {
      setIsSyncingPreferences(false);
    }
  };

  return {
    basicInfo,
    setBasicInfo,
    descriptionOverrides,
    setDescriptionOverrides,
    selectedItems,
    setSelectedItems,
    selectedSkillEntries,
    setSelectedSkillEntries,
    selectedTechStackEntries,
    setSelectedTechStackEntries,
    isSyncingPreferences,
    syncToBackend,
    syncFromBackend,
  };
}
