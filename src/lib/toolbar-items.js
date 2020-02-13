import { defaultToolbarItems } from "pspdfkit";

export default function makeToolbarItems(getInstance, callback) {
  if (typeof callback !== "function") {
    callback = () => {};
  }

  const exportButton = {
    type: "custom",
    id: "export-pdf",
    title: "Export",
    icon: "./assets/download.svg",
    onPress: () => {
      getInstance()
        .exportPDF()
        .then(buffer => {
          const supportsDownloadAttribute = HTMLAnchorElement.prototype.hasOwnProperty(
            "download"
          );
          const blob = new Blob([buffer], { type: "application/pdf" });
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, "download.pdf");
            callback();
          } else if (!supportsDownloadAttribute) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result;
              downloadPdf(dataUrl);
              callback();
            };

            reader.readAsDataURL(blob);
          } else {
            const objectUrl = window.URL.createObjectURL(blob);
            downloadPdf(objectUrl);
            window.URL.revokeObjectURL(objectUrl);
            callback();
          }
        });
    }
  };

  return defaultToolbarItems.concat([exportButton]);
}

function downloadPdf(blob) {
  const a = document.createElement("a");
  a.href = blob;
  a.style.display = "none";
  a.download = "download.pdf";
  a.setAttribute("download", "download.pdf");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
