/**
 * Application entry file.
 *
 * We create a drag and drop area and a file picker that are used to load PDFs.
 * Once a PDF is dropped or selected we read it from disk as an ArrayBuffer
 * which we can then pass to PSPDFKit.load() to initialize the viewer with the given PDF.
 *
 * We also add an `Export PDF` button to the main toolbar and monitor changes to
 * inform the users when they are about to leave the page or open a new document
 * and there is unsaved(exported) work.
 */

import PSPDFKit from "@nutrient-sdk/viewer";
import { processFiles } from "./lib/utils";
import dragDrop from "drag-drop";

let hasUnsavedAnnotations = false;
let isAlreadyLoaded = false;

/**
 * Creates an onAnnotationsChange handler that
 * keeps track of changes.
 *
 * We skip the first call since `annotations.change` fires
 * when the PDF viewer is initialized and populated with annotations.
 */
const createOnAnnotationsChange = () => {
  let initialized = false;

  return () => {
    if (initialized) {
      hasUnsavedAnnotations = true;
    } else {
      initialized = true;
    }
  };
};

/**
 * Main load function invoked when a dropped or selected file (PDF)
 * has been successfully read as ArrayBuffer.
 *
 * If there is an existing running instance of PSPDFKit it is destroyed
 * before a creating a new one.
 */
function load(pdfArrayBuffers) {
  const pdfArrayBuffer = pdfArrayBuffers[0];

  if (isAlreadyLoaded) {
    console.info("Destroyed previous instance");
    PSPDFKit.unload(".App");
    hasUnsavedAnnotations = false;
  }

  isAlreadyLoaded = true;

  const configuration = {
    container: ".App",
    document: pdfArrayBuffer,
  };

  PSPDFKit.load(configuration)
    .then((instance) => {
      instance.addEventListener(
        "annotations.change",
        createOnAnnotationsChange()
      );
    })
    .catch(console.error);
}

/**
 * The code present below is not required to make PSPDFKit work. They just provide the file picking
 * and drag n drop functionality.
 */

function onFail({ message }) {
  alert(message);
}

function shouldPreventLoad() {
  return (
    hasUnsavedAnnotations &&
    !window.confirm(
      "You have unsaved changes. By continuing, you will lose those changes."
    )
  );
}

/**
 * This code handles drag and drop behaviour. Once you have selected a PDF, the drag and
 * drop instance is destroyed. This means this only works for the first PDF. If you
 * want to load more PDFs, please use file picker.
 */
let destroyListener = dragDrop("#body", {
  onDrop: (files) => {
    if (shouldPreventLoad()) {
      return;
    }

    processFiles(files)
      .then((arrayBuffers) => {
        destroyDragAndDrop();
        load(arrayBuffers);
      })
      .catch(onFail);
  },
});

function destroyDragAndDrop() {
  if (destroyListener) {
    destroyListener();
    document.querySelector(".drag-text").classList.add("is-hidden");
    destroyListener = null;
  }
}

/**
 * The code below handles the file picket via the systems's default File Picker.
 */
function onFileSelectSuccess(pdfArrayBuffers) {
  destroyDragAndDrop();
  load(pdfArrayBuffers);
}

document.querySelector("#selectFile").addEventListener("change", (event) => {
  if (!event.target.files.length || shouldPreventLoad()) {
    event.target.value = null;

    return;
  }

  processFiles([...event.target.files])
    .then(onFileSelectSuccess)
    .catch(onFail);

  event.target.value = null;
});
