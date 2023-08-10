import App from "./App/App";

import { PublicViewer } from "@s0rt/3d-viewer";

const viewer = new PublicViewer('earth-viewer');
const app = new App(viewer);

var scripts = document.getElementsByTagName("script");
var script = Array.from(scripts).find(script => script.hasAttribute("app-callback"));

if (!script) {
  throw new Error('Couldn\'t find script with attribute `app-callback`');
}

(window as any)[script.getAttribute("app-callback") as string](app);

