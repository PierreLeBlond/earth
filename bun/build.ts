import { mkdir } from "node:fs/promises";
import glslLoader from "./glsl-loader-plugin";

const libDirectory = './build/lib';

const copy = async (filePath: string, outputPath: string) => {
  const fileName = filePath.substring(filePath.lastIndexOf("/"))
  const file = Bun.file(filePath);
  await Bun.write(outputPath + fileName, file);
}

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: libDirectory,
  plugins: [glslLoader]
});

await mkdir(`${libDirectory}/assets`, { recursive: true });

await copy("./public/assets/room_rgbd_radiance.dds", `${libDirectory}/assets`);
await copy("./public/assets/room_rgbd_irradiance.dds", `${libDirectory}/assets`);
await copy("./package.json", `${libDirectory}`);

