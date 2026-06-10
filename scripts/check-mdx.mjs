// Compileert alle MDX-bestanden in content/pages om parsefouten te vangen
// zonder de dev-server te draaien. Gebruik: node scripts/check-mdx.mjs
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";

const dir = path.join(process.cwd(), "content", "pages");
let failed = false;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const { content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
  try {
    await compile(content, { outputFormat: "function-body" });
    console.log(`OK   ${file}`);
  } catch (err) {
    failed = true;
    console.error(`FAIL ${file}: ${err.message}`);
  }
}

process.exit(failed ? 1 : 0);
