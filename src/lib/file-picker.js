import { processFiles } from "./utils";

export default function initialize(onSuccess, onFail, preventLoad) {
  const node = document.createElement("label");
  node.classList.add("FilePicker");
  node.innerHTML = `
    <span>Select File</span>
    <input type="file" class="FilePicker-input" />
  `;
  document.body.appendChild(node);

  function listener(e) {
    if (!e.target.files.length || (preventLoad && preventLoad())) {
      e.target.value = null;
      return;
    }
    processFiles([...e.target.files]).then(onSuccess).catch(onFail);
    e.target.value = null;
  }
  node.addEventListener("change", listener);

  return {
    node,
    destroy: () => {
      node.removeEventListener("change", listener);
      node.parentNode.removeChild(node);
    }
  };
}
