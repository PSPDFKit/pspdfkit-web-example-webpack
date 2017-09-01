import { defaultToolbarItems } from "pspdfkit";

export default function makeToolbarItems(getInstance, callback) {
  const exportButton = {
    type: "custom",
    id: "export-pdf",
    title: "Export",
    onPress: () => {
      getInstance().exportPDF().then(buffer => {
        const a = document.createElement("a");
        let blob = new Blob([buffer], { type: "application/pdf" });
        let objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.style = "display: none";
        a.download = "download.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
        callback && callback();
      });
    }
  };

  return [exportButton].concat(defaultToolbarItems);
}
