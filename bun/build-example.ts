import { mkdir } from "node:fs/promises";
import glslLoader from "./glsl-loader-plugin";

const exampleDirectory = './build/example';

const copy = async (filePath: string, outputPath: string) => {
  const fileName = filePath.substring(filePath.lastIndexOf("/"))
  const file = Bun.file(filePath);
  await Bun.write(outputPath + fileName, file);
}

await Bun.build({
  entrypoints: ['./src/index.html'],
  outdir: exampleDirectory,
  plugins: [glslLoader]
});

await mkdir(`${exampleDirectory}/assets`, { recursive: true });

await copy("./public/assets/room_rgbd_radiance.dds", `${exampleDirectory}/assets`);
await copy("./public/assets/room_rgbd_irradiance.dds", `${exampleDirectory}/assets`);

