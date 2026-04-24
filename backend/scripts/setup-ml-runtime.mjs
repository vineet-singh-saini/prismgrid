import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });

    childProcess.on("error", reject);
    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

const currentFilePath = fileURLToPath(import.meta.url);
const backendRoot = path.resolve(path.dirname(currentFilePath), "..");
const mlRoot = path.resolve(backendRoot, "ml");
const requirementsPath = path.resolve(mlRoot, "requirements.txt");
const pythonDepsPath = path.resolve(mlRoot, ".pydeps");

const pythonBin =
  process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");

async function setupMlRuntime() {
  await mkdir(pythonDepsPath, { recursive: true });

  await runCommand(
    pythonBin,
    ["-m", "pip", "install", "--target", pythonDepsPath, "-r", requirementsPath],
    { cwd: backendRoot }
  );

  console.log("ML runtime dependencies installed successfully.");
}

setupMlRuntime().catch((error) => {
  console.error("ML runtime setup failed:", error.message);
  process.exit(1);
});
