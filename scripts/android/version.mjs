/**
 * Syncs the Android TWA version with the npm package version.
 *
 * `appVersionName` mirrors package.json (semantic-release owns that number),
 * and `appVersionCode` is a monotonically increasing integer derived from it —
 * Play rejects any upload whose version code is not strictly greater than the
 * last one, and it can never be lowered again.
 *
 * The code is `major * 1e6 + minor * 1e3 + patch`, which keeps every release
 * ordered as long as minor and patch stay under 1000. A build counter (the CI
 * run number) can be added with `--build <n>` for re-uploads of the same
 * version, and occupies the bottom two digits.
 *
 * Run with `bun run android:version` (add `-- --build $GITHUB_RUN_NUMBER` in CI).
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PACKAGE_JSON = new URL("../../package.json", import.meta.url);

const TWA_MANIFEST = new URL("../../android/twa-manifest.json", import.meta.url);

const parseArgs = argv => {

   const build = argv.indexOf("--build");

   return {
      build: build === -1 ? 0 : Number.parseInt(argv[build + 1] ?? "0", 10),
      dryRun: argv.includes("--dry-run"),
   };

};

/**
 * @param {string} version Semver string, e.g. "1.4.2".
 * @param {number} build   Optional build counter (0-99).
 * @returns {number} A Play-compatible, monotonically increasing version code.
 */
export const toVersionCode = (version, build = 0) => {

   const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version);

   if (!match) {

      throw new Error(`"${version}" is not a semantic version`);

   }

   const [, major, minor, patch] = match.map(Number);

   if (minor > 999 || patch > 999) {

      throw new Error(`Version ${version} overflows the version-code scheme (minor/patch must stay below 1000)`);

   }

   // Play caps versionCode at 2100000000, which this scheme reaches at major 21.
   if (major > 20) {

      throw new Error(`Major version ${major} overflows Play's maximum version code`);

   }

   if (build > 99) {

      throw new Error(`Build counter ${build} overflows the version-code scheme (must stay below 100)`);

   }

   return (((major * 1_000_000) + (minor * 1_000) + patch) * 100) + build;

};

const main = async () => {

   const { build, dryRun } = parseArgs(process.argv.slice(2));

   const pkg = JSON.parse(await readFile(fileURLToPath(PACKAGE_JSON), "utf8"));

   const manifest = JSON.parse(await readFile(fileURLToPath(TWA_MANIFEST), "utf8"));

   const versionName = pkg.version;

   const versionCode = toVersionCode(versionName, build);

   if (versionCode <= manifest.appVersionCode && !dryRun) {

      console.warn(
         `! The computed version code (${versionCode}) is not greater than the one on record `
         + `(${manifest.appVersionCode}). Play will reject this upload — release a new version first.`,
      );

   }

   manifest.appVersionName = versionName;
   manifest.appVersion = versionName;
   manifest.appVersionCode = versionCode;

   if (dryRun) {

      console.info(`${versionName} → versionCode ${versionCode} (dry run, nothing written)`);

      return;

   }

   await writeFile(fileURLToPath(TWA_MANIFEST), `${JSON.stringify(manifest, null, 3)}\n`);

   console.info(`✓ android/twa-manifest.json → ${versionName} (versionCode ${versionCode})`);

};

if (import.meta.main ?? process.argv[1]?.endsWith("version.mjs")) {

   await main();

}
