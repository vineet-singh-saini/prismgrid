import { ZodError } from "zod";

export function notFoundHandler(request, response) {
  response.status(404).json({
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation failed.",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error?.code === 11000) {
    return response.status(409).json({
      message: "A record with that unique value already exists.",
    });
  }

  if (error?.name === "CastError") {
    return response.status(400).json({
      message: "One of the provided identifiers is invalid.",
    });
  }

  const statusCode = error.statusCode ?? 500;

  return response.status(statusCode).json({
    message:
      statusCode >= 500
        ? "An unexpected server error occurred."
        : error.message || "Request failed.",
  });
}
