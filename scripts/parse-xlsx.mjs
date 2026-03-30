import XLSX from "xlsx";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseBool(val) {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const v = val.trim().toLowerCase();
    return v === "yes" || v === "true";
  }
  return false;
}

function parseScore(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function splitList(val) {
  if (!val || typeof val !== "string") return [];
  // Split on semicolons or newlines
  return val
    .split(/[;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const wb = XLSX.readFile(join(ROOT, "floyo-model-compare-database.xlsx"));

// Parse workflows first, keyed by model name
const wfSheet = wb.Sheets["Floyo Workflows"];
const wfRows = XLSX.utils.sheet_to_json(wfSheet, { header: 1 });
const wfHeaders = wfRows[0]; // ["Model","Workflow Name","Type","URL","Description (paraphrased)","Runs","Status"]

const workflowsByModel = {};
for (const row of wfRows.slice(1)) {
  if (!row[0]) continue;
  const modelName = String(row[0]).trim();
  if (!workflowsByModel[modelName]) workflowsByModel[modelName] = [];
  workflowsByModel[modelName].push({
    name: String(row[1] || "").trim(),
    type: String(row[2] || "").trim(),
    url: String(row[3] || "").trim(),
    description: String(row[4] || "").trim(),
    runs: String(row[5] || "").trim(),
    status: String(row[6] || "").trim(),
  });
}

// Parse model database
const modelSheet = wb.Sheets["Model Database"];
const modelRows = XLSX.utils.sheet_to_json(modelSheet, { header: 1 });
// Headers at index 0, data starts at index 1

const models = [];

for (const row of modelRows.slice(1)) {
  if (!row[0]) continue; // skip empty rows

  const name = String(row[0]).trim();
  const version = String(row[1] || "").trim();
  const maker = String(row[2] || "").trim();
  const sourceType = String(row[3] || "").trim();
  const license = String(row[4] || "").trim();
  const released = String(row[5] || "").trim();
  const architecture = String(row[6] || "").trim();
  const parameters = String(row[7] || "").trim();
  const maxResolution = String(row[8] || "").trim();
  const maxDuration = String(row[9] || "").trim();
  const fps = String(row[10] || "").trim();
  const nativeAudio = parseBool(row[11]);
  const comfyUISupport = parseBool(row[12]);
  const finetuneable = parseBool(row[13]);
  const minVRAM = String(row[14] || "").trim();
  const costPerSecond = String(row[15] || "").trim();
  const inputsSupported = String(row[16] || "").trim();
  const tier = String(row[17] || "B").trim();
  const onFloyo = parseBool(row[18]);

  const scores = {
    quality: parseScore(row[20]),
    motion: parseScore(row[21]),
    speed: parseScore(row[22]),
    control: parseScore(row[23]),
    audio: parseScore(row[24]),
    value: parseScore(row[25]),
  };

  const strengths = splitList(String(row[26] || ""));
  const weaknesses = splitList(String(row[27] || ""));
  const bestFor = splitList(String(row[28] || ""));
  const verdict = String(row[29] || "").trim();

  const id = slugify(name);

  // Find workflows - try exact match first, then partial
  let workflows = workflowsByModel[name] || [];
  if (workflows.length === 0) {
    // Try partial match (e.g. "Kling 3.0" matching "Kling O1/O3")
    for (const [key, wfs] of Object.entries(workflowsByModel)) {
      if (key.includes(name) || name.includes(key.split("/")[0].trim())) {
        workflows = wfs;
        break;
      }
    }
  }

  models.push({
    id,
    name,
    version,
    maker,
    sourceType,
    license,
    released,
    architecture,
    parameters,
    maxResolution,
    maxDuration,
    fps,
    nativeAudio,
    comfyUISupport,
    finetuneable,
    minVRAM,
    costPerSecond,
    inputsSupported,
    tier,
    onFloyo,
    scores,
    strengths,
    weaknesses,
    bestFor,
    verdict,
    workflows,
  });
}

mkdirSync(join(ROOT, "data"), { recursive: true });
const outPath = join(ROOT, "data", "models.json");
writeFileSync(outPath, JSON.stringify(models, null, 2));
console.log(`Wrote ${models.length} models to ${outPath}`);
