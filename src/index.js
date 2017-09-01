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

import PSPDFKit from "pspdfkit";

import initializeDragAndDrop from "./lib/drag-drop";
import initializeFilePicker from "./lib/file-picker";
import makeToolbarItems from "./lib/toolbar-items";

let currentInstance = null;
let hasUnsavedAnnotations = false;

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
  if (currentInstance) {
    // eslint-disable-next-line no-console
    console.info("destroyed previous instance");
    currentInstance.destroy();
    hasUnsavedAnnotations = false;
    currentInstance = null;
  }

  const toolbarItems = makeToolbarItems(
    function getInstance() {
      return currentInstance;
    },
    function callback() {
      hasUnsavedAnnotations = false;
    }
  );

  const configuration = {
    container: ".App",
    pdf: pdfArrayBuffer,
    toolbarItems,
    licenseKey: process.env.PSPDFKIT_LICENSE_KEY
  };

  PSPDFKit.load(configuration)
    .then(instance => {
      currentInstance = instance;
      instance.addEventListener(
        "annotations.change",
        createOnAnnotationsChange()
      );
    })
    .catch(error => {
      throw new Error(error);
    });
}

function onFail({ message }) {
  alert(message);
}

function preventLoad() {
  return (
    hasUnsavedAnnotations &&
    !window.confirm(
      "You have unsaved changes by continuing you will lose those changes."
    )
  );
}

// Initialize the Drag and Drop area.
const { hide: hideDropTarget } = initializeDragAndDrop(
  load,
  onFail,
  preventLoad
);

// Initialize the File picker.
initializeFilePicker(
  function onSuccess(pdfArrayBuffers) {
    hideDropTarget();
    load(pdfArrayBuffers);
  },
  onFail,
  preventLoad
);
