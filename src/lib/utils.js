/**
 * Converts a file to an ArrayBuffer and resolves the promise with it.
 * It is used when we drop a file or use the file picker.
 */
export function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    if (file.type !== "application/pdf") {
      reject(new Error("Invalid file type, please load a PDF."));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", e => {
      resolve(e.target.result);
    });
    reader.addEventListener("error", err => {
      reject(new Error(err));
    });
    reader.readAsArrayBuffer(file);
  });
}

export function processFiles(files) {
  return new Promise((resolve, reject) => {
    Promise.all(files.map(fileToArrayBuffer)).then(resolve).catch(reject);
  });
}
