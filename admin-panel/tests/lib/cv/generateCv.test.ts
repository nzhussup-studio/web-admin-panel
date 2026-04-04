import { act } from "@testing-library/react";
import { generateCV, previewCV } from "@/lib/cv/generateCv";

jest.mock("html2pdf.js", () => ({
  __esModule: true,
  ...(() => {
    const mockSave = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn(() => ({ save: mockSave }));
    const mockSet = jest.fn(() => ({ from: mockFrom }));
    const mockHtml2Pdf = jest.fn(() => ({ set: mockSet }));

    return {
      default: mockHtml2Pdf,
      mockSave,
      mockFrom,
      mockSet,
      mockHtml2Pdf,
    };
  })(),
}));

const mockedHtml2PdfModule = jest.requireMock("html2pdf.js") as {
  mockSave: jest.Mock;
  mockFrom: jest.Mock;
  mockSet: jest.Mock;
  mockHtml2Pdf: jest.Mock;
};

describe("lib/cv/generateCv.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("generates a pdf by rendering html and invoking html2pdf", async () => {
    const appendSpy = jest.spyOn(document.body, "appendChild");
    const removeSpy = jest.spyOn(document.body, "removeChild");

    generateCV({ basic_info: { name: "User" } }, "pdf");
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockedHtml2PdfModule.mockHtml2Pdf).toHaveBeenCalled();
    expect(mockedHtml2PdfModule.mockSet).toHaveBeenCalledWith(
      expect.objectContaining({ filename: "cv.pdf" })
    );
    expect(mockedHtml2PdfModule.mockFrom).toHaveBeenCalledWith(
      expect.any(HTMLDivElement)
    );
    expect(mockedHtml2PdfModule.mockSave).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  test("alerts on unsupported output formats", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

    generateCV({ basic_info: { name: "User" } }, "txt");

    expect(alertSpy).toHaveBeenCalledWith("Unsupported output format: txt");
  });

  test("opens preview window and writes html content", () => {
    const documentOpen = jest.fn();
    const documentWrite = jest.fn();
    const documentClose = jest.fn();
    const openSpy = jest
      .spyOn(window, "open")
      .mockImplementation(
        () =>
          ({
            document: {
              open: documentOpen,
              write: documentWrite,
              close: documentClose,
            },
          }) as unknown as Window
      );

    previewCV({ basic_info: { name: "Preview User" } });

    expect(openSpy).toHaveBeenCalledWith("", "_blank");
    expect(documentOpen).toHaveBeenCalled();
    expect(documentWrite).toHaveBeenCalledWith(expect.stringContaining("CV Preview"));
    expect(documentWrite).toHaveBeenCalledWith(expect.stringContaining("Preview User"));
    expect(documentClose).toHaveBeenCalled();
  });

  test("alerts when preview window is blocked", () => {
    jest.spyOn(window, "open").mockImplementation(() => null);
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

    previewCV({ basic_info: { name: "Preview User" } });

    expect(alertSpy).toHaveBeenCalledWith(
      "Preview window was blocked. Please allow pop-ups for this site."
    );
  });
});
