import { writeFileSync, mkdirSync } from "node:fs";
import { collectGitHub } from "./sources/github";

async function main() {
  const token = process.env.GITHUB_TOKEN || "";
  const gh = await collectGitHub(token);

  const out = {
    generatedAt: new Date().toISOString(),
    sources: { github: gh }
  };

  mkdirSync("../data", { recursive: true });
  writeFileSync("../data/github.json", JSON.stringify(gh, null, 2));
  writeFileSync("../data/latest.json", JSON.stringify(out, null, 2));

  console.log("Wrote ../data/latest.json");
}

main().catch(e => { console.error(e); process.exit(1); });
