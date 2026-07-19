import { serve } from "bun";
import index from "../src/index.html";

const server = serve({
  routes: {
    "/": index,
    "/assets/*": async req => {
      const filePath = "./public" + new URL(req.url).pathname;
      const file = Bun.file(filePath);
      return new Response(file);
    },
  },

  development: true
});

console.log(`Listening on ${server.url}`);
