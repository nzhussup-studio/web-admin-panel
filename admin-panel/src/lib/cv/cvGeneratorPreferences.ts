import {
  CvGeneratorPreferenceControllerService,
  type base_service_CvGeneratorPreference,
} from "@/lib/api/client";

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

export const loadCvGeneratorPreferences = async (): Promise<CvGeneratorPreferencesPayload | null> => {
  try {
    const list = await CvGeneratorPreferenceControllerService.listCvGeneratorPreference();
    const first = Array.isArray(list) ? list[0] : null;
    return toPreferencePayload(first);
  } catch {
    return null;
  }
};

export const saveCvGeneratorPreferences = async (
  payload: CvGeneratorPreferencesPayload,
): Promise<void> => {
  const list = await CvGeneratorPreferenceControllerService.listCvGeneratorPreference();
  const first = Array.isArray(list) ? list[0] : null;

  const requestBody: base_service_CvGeneratorPreference = {
    ...(first?.id ? { id: first.id } : {}),
    preferencesJson: payload as any,
  };

  if (first?.id) {
    await CvGeneratorPreferenceControllerService.updateCvGeneratorPreference(
      requestBody,
    );
  } else {
    await CvGeneratorPreferenceControllerService.createCvGeneratorPreference(
      requestBody,
    );
  }
};
