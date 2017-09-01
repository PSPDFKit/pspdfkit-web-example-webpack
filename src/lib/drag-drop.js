import dragDrop from "drag-drop";
import { processFiles } from "./utils";

export default function initialize(onSuccess, onFail, preventLoad) {
  const node = document.createElement("div");
  node.classList.add("DropTarget");
  node.textContent = "Drop your PDF here.";

  document.body.appendChild(node);

  const overlay = document.createElement("div");
  overlay.classList.add("DropTargetOverlay");

  document.body.appendChild(overlay);

  function onDragEnter(e) {
    e.preventDefault();
    node.classList.remove("is-hidden");
  }

  function onDragLeave(e) {
    e.preventDefault();
    node.classList.add("is-hidden");
  }

  // Manage the target visibility on drag.
  document.documentElement.addEventListener("dragenter", onDragEnter);
  node.addEventListener("dragleave", onDragLeave);

  dragDrop(node, files => {
    node.classList.add("is-hidden");
    if (preventLoad && preventLoad()) {
      return;
    }

    processFiles(files).then(onSuccess).catch(onFail);
  });

  return {
    node,
    destroy: () => {
      document.documentElement.removeEventListener("dragenter", onDragEnter);
      node.removeEventListener("dragleave", onDragLeave);
      node.parentNode.removeChild(node);
      overlay.parentNode.removeChild(overlay);
    },
    show: () => node.classList.remove("is-hidden"),
    hide: () => node.classList.add("is-hidden")
  };
}
