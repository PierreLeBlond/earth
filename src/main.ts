import App from "./App/App";

import { createViewer } from "@3dvf/create-viewer/create-viewer";

const element = document.getElementById("earth-viewer");
if (!element) {
  throw new Error('Couldn\'t find viewer element');
}

const viewer = createViewer(element);
const app = new App(viewer, element);

var scripts = document.getElementsByTagName("script");
var script = Array.from(scripts).find(script => script.hasAttribute("app-callback"));

if (!script) {
  throw new Error('Couldn\'t find script with attribute `app-callback`');
}

(window as any)[script.getAttribute("app-callback") as string](app);

