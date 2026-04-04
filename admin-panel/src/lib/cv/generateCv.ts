import { renderToStaticMarkup } from "react-dom/server";
import html2pdf from "html2pdf.js";
import CVTemplate from "@/components/cv/CvTemplate";
import {
  buildPreviewWindowHtml,
  buildPrintWindowHtml,
} from "@/lib/cv/cvExportHtmlTemplates";

const POPUP_BLOCKED_MESSAGE =
  "Preview window was blocked. Please allow pop-ups for this site.";

function renderCvMarkup(data: unknown): string {
  return renderToStaticMarkup(CVTemplate({ data }));
}

function openWindowWithHtml(documentHtml: string): Window | null {
  const popup = window.open("", "_blank");
  if (!popup) {
    return null;
  }

  popup.document.open();
  popup.document.write(documentHtml);
  popup.document.close();
  return popup;
}

function waitForImagesToLoad(container: HTMLElement, timeoutMs = 8000) {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) {
    return Promise.resolve();
  }

  const imageLoadPromises = images.map(
    (image) =>
      new Promise<void>((resolve) => {
        if (image.complete) {
          resolve();
          return;
        }

        const resolveOnDone = () => {
          image.removeEventListener("load", resolveOnDone);
          image.removeEventListener("error", resolveOnDone);
          resolve();
        };

        image.addEventListener("load", resolveOnDone, { once: true });
        image.addEventListener("error", resolveOnDone, { once: true });
      }),
  );

  return Promise.race([
    Promise.all(imageLoadPromises).then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

function downloadPdfWithCanvasFallback(cvMarkup: string) {
  const scratchContainer = document.createElement("div");
  scratchContainer.innerHTML = cvMarkup;
  document.body.appendChild(scratchContainer);

  const pdfOptions = {
    margin: 0.25,
    filename: "cv.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: false,
    },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  waitForImagesToLoad(scratchContainer)
    .then(() => html2pdf().set(pdfOptions).from(scratchContainer).save())
    .finally(() => {
      document.body.removeChild(scratchContainer);
    });
}

export function previewCV(data: unknown) {
  const cvMarkup = renderCvMarkup(data);
  const popup = openWindowWithHtml(buildPreviewWindowHtml(cvMarkup));
  if (!popup) {
    alert(POPUP_BLOCKED_MESSAGE);
  }
}

export function generateCV(data: unknown, output = "pdf") {
  const cvMarkup = renderCvMarkup(data);

  if (output === "pdf") {
    const popup = openWindowWithHtml(buildPrintWindowHtml(cvMarkup));
    if (!popup) {
      downloadPdfWithCanvasFallback(cvMarkup);
    }
    return;
  }

  alert(`Unsupported output format: ${output}`);
}
