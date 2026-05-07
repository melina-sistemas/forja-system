let pdfJsRuntimePromise = null;

export async function extractPdfTextFromFile(file) {
  if (!globalThis.window) {
    throw new Error("A importacao de PDF so pode ser feita no navegador.");
  }

  const pdfjs = await loadPdfJsRuntime();
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  const document = await loadingTask.promise;
  const lines = [];

  try {
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item) => (typeof item?.str === "string" ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (text) {
        lines.push(text);
      }
    }
  } finally {
    await document.destroy?.();
  }

  return lines.join("\n\n");
}

async function loadPdfJsRuntime() {
  if (!pdfJsRuntimePromise) {
    pdfJsRuntimePromise = Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.min.mjs?url")
    ]).then(([pdfjsModule, workerModule]) => {
      const workerUrl = workerModule?.default || workerModule;

      if (pdfjsModule?.GlobalWorkerOptions && workerUrl) {
        pdfjsModule.GlobalWorkerOptions.workerSrc = workerUrl;
      }

      return pdfjsModule;
    });
  }

  return pdfJsRuntimePromise;
}
