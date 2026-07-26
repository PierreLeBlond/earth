import { build } from "./build";

const buildOutputs = await build(['./src/index.ts'], './build/lib');

// NOTE: Might certainly break if bun change its output syntax
await Promise.all(buildOutputs.outputs.filter(buildArtifact =>
  buildArtifact.loader == 'ts'
).map(async buildArtifact => {
  const content = await buildArtifact.text();
  const alteredContent = content.replace(
    /var (\w+)_default = ("[^"]+")/g,
    'var $1_default = new URL($2, import.meta.url).href'
  );
  await Bun.write(buildArtifact.path, alteredContent);
}));
