const BASE_PRINT_STYLE = `
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body {
    font-family: Helvetica, Arial, sans-serif;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  a { color: inherit; text-decoration: none; }
`;

const PREVIEW_CONTAINER_STYLE = `
  .cv-preview {
    width: 8in;
    max-width: 8in;
    margin: 24px auto;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
  @media print {
    html, body { background: #ffffff; }
    .cv-preview { margin: 0; max-width: none; box-shadow: none; }
  }
`;

const PRINT_SCRIPT = `
  (function () {
    var printed = false;
    var triggerPrint = function () {
      if (printed) return;
      printed = true;
      window.focus();
      window.print();
      setTimeout(function () { window.close(); }, 250);
    };
    var waitForFonts = function () {
      if (!document.fonts || !document.fonts.ready) {
        return Promise.resolve();
      }
      return document.fonts.ready.catch(function () {
        return undefined;
      });
    };
    var images = Array.prototype.slice.call(document.images || []);
    var waitForImages = function () {
      if (!images.length) {
        return Promise.resolve();
      }
      var remaining = images.length;
      return new Promise(function (resolve) {
        var onLoaded = function () {
          remaining -= 1;
          if (remaining <= 0) {
            resolve();
          }
        };
        images.forEach(function (img) {
          if (img.complete) {
            onLoaded();
            return;
          }
          img.addEventListener("load", onLoaded, { once: true });
          img.addEventListener("error", onLoaded, { once: true });
        });
      });
    };
    Promise.all([waitForFonts(), waitForImages()]).then(function () {
      setTimeout(triggerPrint, 120);
    });
    setTimeout(triggerPrint, 2500);
  })();
`;

export function buildPrintWindowHtml(cvMarkup: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CV</title>
    <style>
      @page { size: letter portrait; margin: 0.25in; }
      ${BASE_PRINT_STYLE}
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    </style>
  </head>
  <body>
    ${cvMarkup}
    <script>${PRINT_SCRIPT}</script>
  </body>
</html>`;
}

export function buildPreviewWindowHtml(cvMarkup: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CV Preview</title>
    <style>
      html, body { margin: 0; padding: 0; background: #f5f6f8; }
      body { font-family: Helvetica, Arial, sans-serif; }
      ${PREVIEW_CONTAINER_STYLE}
    </style>
  </head>
  <body>
    <div class="cv-preview">${cvMarkup}</div>
  </body>
</html>`;
}
