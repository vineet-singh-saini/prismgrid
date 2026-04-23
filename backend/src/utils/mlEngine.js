import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { env } from "../config/env.js";

const execFileAsync = promisify(execFile);

const currentFilePath = fileURLToPath(import.meta.url);
const backendRoot = path.resolve(path.dirname(currentFilePath), "..", "..");
const mlRoot = path.resolve(backendRoot, "ml");
const localPythonDependencies = path.resolve(mlRoot, ".pydeps");
const predictScriptPath = path.resolve(mlRoot, "predict_cli.py");
const trainScriptPath = path.resolve(mlRoot, "train_models.py");
const artifactsPath = path.resolve(mlRoot, "artifacts");

async function runPythonScript(scriptPath, args = []) {
  const pythonPathSegments = [
    localPythonDependencies,
    process.env.PYTHONPATH ?? "",
  ].filter(Boolean);

  const { stdout, stderr } = await execFileAsync(env.PYTHON_BIN, [scriptPath, ...args], {
    cwd: mlRoot,
    windowsHide: true,
    maxBuffer: 1024 * 1024 * 8,
    env: {
      ...process.env,
      PYTHONPATH: pythonPathSegments.join(path.delimiter),
    },
  });

  return {
    stdout: stdout.trim(),
    stderr: stderr.trim(),
  };
}

export async function runMlPrediction(payload) {
  const payloadJson = JSON.stringify(payload);
  const { stdout, stderr } = await runPythonScript(predictScriptPath, [
    "--payload",
    payloadJson,
  ]);

  if (!stdout) {
    throw new Error(stderr || "No prediction output returned by ML engine.");
  }

  try {
    return JSON.parse(stdout);
  } catch {
    throw new Error(`Invalid ML prediction output: ${stdout}`);
  }
}

export async function runMlTraining() {
  const { stdout, stderr } = await runPythonScript(trainScriptPath);

  if (!stdout) {
    throw new Error(stderr || "No training output returned by ML engine.");
  }

  try {
    return JSON.parse(stdout);
  } catch {
    throw new Error(`Invalid ML training output: ${stdout}`);
  }
}

export async function getMlStatus() {
  const fs = await import("node:fs/promises");
  const requiredArtifacts = [
    path.resolve(artifactsPath, "delay_model.pkl"),
    path.resolve(artifactsPath, "cost_model.pkl"),
    path.resolve(artifactsPath, "feature_columns.pkl"),
    path.resolve(artifactsPath, "training_metrics.json"),
  ];

  const checks = await Promise.all(
    requiredArtifacts.map(async (artifactPath) => ({
      file: path.basename(artifactPath),
      exists: Boolean(await fs.stat(artifactPath).catch(() => null)),
    }))
  );

  return {
    pythonBin: env.PYTHON_BIN,
    artifactsPath,
    artifactsReady: checks.every((entry) => entry.exists),
    artifacts: checks,
  };
}
