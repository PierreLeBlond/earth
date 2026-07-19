import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";
import prompts from "prompts";

const ROOT = new URL("..", import.meta.url).pathname;
const PKG_PATH = join(ROOT, "package.json");
const pkg = JSON.parse(readFileSync(PKG_PATH, "utf-8"));

const [major, minor, patch] = pkg.version.split(".").map(Number);

const { bump } = await prompts({
  type: "select",
  name: "bump",
  message: `Current version: ${pkg.version}  —  select bump`,
  choices: [
    { title: `patch   → ${major}.${minor}.${patch + 1}`, value: "patch" },
    { title: `minor   → ${major}.${minor + 1}.0`,        value: "minor" },
    { title: `major   → ${major + 1}.0.0`,               value: "major" },
  ],
}, { onCancel: () => process.exit(1) });

const next =
  bump === "patch" ? `${major}.${minor}.${patch + 1}` :
  bump === "minor" ? `${major}.${minor + 1}.0` :
                     `${major + 1}.0.0`;

pkg.version = next;
writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + "\n", "utf-8");

const run = (cmd: string) => execSync(cmd, { cwd: ROOT, stdio: "inherit" });

run(`git add package.json`);
run(`git commit -m "chore: Update to v${next}"`);
run(`git tag v${next}`);
run(`git push origin main --tags`);

console.log(`\nReleased v${next}`);
