import {
  CvGeneratorPreferenceControllerService,
  type base_service_CvGeneratorPreference,
} from "@/api";

type CvGeneratorPreferencesPayload = Record<string, unknown>;

const toPreferencePayload = (
  preference: Record<string, any> | null | undefined,
): CvGeneratorPreferencesPayload | null => {
  const preferencesJson = preference?.preferencesJson;
  if (!preferencesJson || typeof preferencesJson !== "object") {
    return null;
  }

  return preferencesJson as CvGeneratorPreferencesPayload;
};

export const loadCvGeneratorPreferences =
  async (): Promise<CvGeneratorPreferencesPayload | null> => {
    try {
      const preference =
        await CvGeneratorPreferenceControllerService.listAdminCvGeneratorPreferences();
      return toPreferencePayload(preference);
    } catch {
      return null;
    }
  };

export const saveCvGeneratorPreferences = async (
  payload: CvGeneratorPreferencesPayload,
): Promise<void> => {
  const preference =
    await CvGeneratorPreferenceControllerService.listAdminCvGeneratorPreferences();

  const requestBody: base_service_CvGeneratorPreference = {
    ...(preference?.id ? { id: preference.id } : {}),
    preferencesJson: payload as any,
  };

  await CvGeneratorPreferenceControllerService.updateAdminCvGeneratorPreferences(
    requestBody,
  );
};
