import {
  loadCvGeneratorPreferences,
  saveCvGeneratorPreferences,
} from "@/lib/cv/cvGeneratorPreferences";
import { CvGeneratorPreferenceControllerService } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  CvGeneratorPreferenceControllerService: {
    listCvGeneratorPreference: jest.fn(),
    updateCvGeneratorPreference: jest.fn(),
    createCvGeneratorPreference: jest.fn(),
  },
}));

describe("lib/cv/cvGeneratorPreferences.ts", () => {
  beforeEach(() => {
    (CvGeneratorPreferenceControllerService.listCvGeneratorPreference as jest.Mock).mockResolvedValue(
      [],
    );
    (CvGeneratorPreferenceControllerService.updateCvGeneratorPreference as jest.Mock).mockResolvedValue(
      {},
    );
    (CvGeneratorPreferenceControllerService.createCvGeneratorPreference as jest.Mock).mockResolvedValue(
      {},
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns null when preferences endpoint returns empty list", async () => {
    (CvGeneratorPreferenceControllerService.listCvGeneratorPreference as jest.Mock).mockResolvedValue(
      [],
    );

    const result = await loadCvGeneratorPreferences();
    expect(result).toBeNull();
  });

  test("returns payload when preferences endpoint returns data", async () => {
    (CvGeneratorPreferenceControllerService.listCvGeneratorPreference as jest.Mock).mockResolvedValue(
      [{ id: 1, preferencesJson: { basicInfo: { name: "Remote" } } }],
    );

    const result = await loadCvGeneratorPreferences();
    expect(result).toEqual({ basicInfo: { name: "Remote" } });
  });

  test("saves payload via update when record exists", async () => {
    (CvGeneratorPreferenceControllerService.listCvGeneratorPreference as jest.Mock).mockResolvedValue(
      [{ id: 7, preferencesJson: {} }],
    );
    await saveCvGeneratorPreferences({ basicInfo: { name: "Remote" } });

    expect(
      CvGeneratorPreferenceControllerService.updateCvGeneratorPreference,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 7,
        preferencesJson: { basicInfo: { name: "Remote" } },
      }),
    );
  });

  test("saves payload via create when no record exists", async () => {
    (CvGeneratorPreferenceControllerService.listCvGeneratorPreference as jest.Mock).mockResolvedValue(
      [],
    );
    await saveCvGeneratorPreferences({ basicInfo: { name: "Remote" } });

    expect(
      CvGeneratorPreferenceControllerService.createCvGeneratorPreference,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        preferencesJson: { basicInfo: { name: "Remote" } },
      }),
    );
  });
});
