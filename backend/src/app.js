import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";
import { alertRoutes } from "./routes/alertRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/authRoutes.js";
import { mlRoutes } from "./routes/mlRoutes.js";
import { projectRoutes } from "./routes/projectRoutes.js";
import { reportRoutes } from "./routes/reportRoutes.js";
import { simulationRoutes } from "./routes/simulationRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { vendorRoutes } from "./routes/vendorRoutes.js";

function getAllowedOrigins() {
  const origins = new Set([env.CLIENT_ORIGIN]);
  const additionalOrigins = env.CLIENT_ORIGINS
    ? env.CLIENT_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

  for (const origin of additionalOrigins) {
    origins.add(origin);
  }

  for (const origin of Array.from(origins)) {
    try {
      const parsedOrigin = new URL(origin);

      if (parsedOrigin.hostname === "localhost") {
        const alternateOrigin = new URL(origin);
        alternateOrigin.hostname = "127.0.0.1";
        origins.add(alternateOrigin.origin);
      }

      if (parsedOrigin.hostname === "127.0.0.1") {
        const alternateOrigin = new URL(origin);
        alternateOrigin.hostname = "localhost";
        origins.add(alternateOrigin.origin);
      }
    } catch {
      // Ignore invalid values here; env validation enforces CLIENT_ORIGIN.
    }
  }

  return origins;
}

export function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      credentials: false,
    })
  );
  app.use(express.json());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/api/health", (request, response) => {
    response.json({
      status: "ok",
      service: "prism-grid-backend",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/alerts", alertRoutes);
  app.use("/api/vendors", vendorRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/simulations", simulationRoutes);
  app.use("/api/ml", mlRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
