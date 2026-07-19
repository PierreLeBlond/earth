import type { BunPlugin } from "bun";

const glslLoader: BunPlugin = {
  name: ".glsl loader as plain text",
  setup(build) {
    build.onLoad({ filter: /\.(glsl|wgsl|vert|frag|vs|fs)$/ }, async args => {
      const source = await Bun.file(args.path).text();
      return {
        loader: "text",
        contents: source
      }
    })
  },
};

export default glslLoader;
