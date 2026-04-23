import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const nodeCommand = process.execPath;
const viteCliPath = path.resolve(
  rootDir,
  "frontend",
  "node_modules",
  "vite",
  "bin",
  "vite.js"
);

const workspaces = [
  {
    name: "backend",
    cwd: path.resolve(rootDir, "backend"),
    command: nodeCommand,
    args: ["src/server.js"],
  },
  {
    name: "frontend",
    cwd: path.resolve(rootDir, "frontend"),
    command: nodeCommand,
    args: [viteCliPath],
  },
];

const children = [];
let isShuttingDown = false;
let activeChildren = 0;
let exitCode = 0;

function shutdown(signal = "SIGTERM") {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

for (const workspace of workspaces) {
  if (workspace.name === "frontend" && !fs.existsSync(viteCliPath)) {
    throw new Error(
      "Missing frontend dependencies. Run `D:\\NODEJS\\npm.cmd install` in the root folder first."
    );
  }

  const child = spawn(workspace.command, workspace.args, {
    cwd: workspace.cwd,
    stdio: "inherit",
    windowsHide: false,
  });

  children.push(child);
  activeChildren += 1;

  child.on("exit", (code) => {
    activeChildren -= 1;

    if (typeof code === "number" && code !== 0 && exitCode === 0) {
      exitCode = code;
    }

    if (!isShuttingDown && code !== 0) {
      shutdown("SIGTERM");
    }

    if (activeChildren === 0) {
      process.exit(exitCode);
    }
  });

  child.on("error", () => {
    if (exitCode === 0) {
      exitCode = 1;
    }
    shutdown("SIGTERM");
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
