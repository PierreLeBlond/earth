import { mkdir, cp, copyFile } from "node:fs/promises";
import glslLoader from "./glsl-loader-plugin";

const copyDirectory = async (directoryPath: string, outputPath: string) => {
  await cp(directoryPath, outputPath, { recursive: true });
}

const copy = async (filePath: string, outputPath: string) => {
  await copyFile(filePath, outputPath);
}

export const build = async (entrypoints: string[], outdir: string) => {

  await Bun.build({
    entrypoints: entrypoints,
    outdir,
    plugins: [glslLoader],
    publicPath: process.env.PUBLIC_PATH ?? "/",
    env: "PUBLIC_*"
  });

  await mkdir(`${outdir}/assets`, { recursive: true });
  await copyDirectory("./public/assets/", `${outdir}/assets`);
  await copy("package.json", `${outdir}/package.json`);
}
