import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
await mkdir(resolve(root, "artifacts"), { recursive: true });
const archive = resolve(root, "artifacts/autosonglink-chrome-1.0.0.zip");
await Bun.file(archive)
  .delete()
  .catch(() => {});
const result = Bun.spawnSync(["zip", "-qr", archive, "."], {
  cwd: resolve(root, "dist"),
});
if (result.exitCode !== 0) throw new Error(result.stderr.toString());
console.log(`Extension prête : ${archive}`);
