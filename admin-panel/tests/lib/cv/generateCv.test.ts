import { act } from "@testing-library/react";
import { generateCV } from "@/lib/cv/generateCv";

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

describe("lib/cv/generateCv.tsx", () => {
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

  test("generates a word document download link", () => {
    jest.useFakeTimers();
    const createObjectURLSpy = jest.fn(() => "blob:test");
    const revokeObjectURLSpy = jest.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: createObjectURLSpy,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: revokeObjectURLSpy,
    });
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    generateCV({ basic_info: { name: "User" } }, "word");

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:test");
    jest.useRealTimers();
  });

  test("alerts on unsupported output formats", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => undefined);

    generateCV({ basic_info: { name: "User" } }, "txt");

    expect(alertSpy).toHaveBeenCalledWith("Unsupported output format: txt");
  });
});
