from __future__ import annotations

import bootstrap  # noqa: F401
from flask import Flask, request
from flask_cors import CORS

from predict_cli import predict
from train_models import train_models

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health() -> tuple[dict[str, str], int]:
    return {"status": "ok", "service": "prism-grid-ml"}, 200


@app.post("/train")
def train() -> tuple[dict[str, object], int]:
    metrics = train_models()
    return {"message": "ML models trained successfully.", "metrics": metrics}, 200


@app.post("/predict")
def run_prediction() -> tuple[dict[str, object], int]:
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return {"message": "Invalid JSON payload."}, 400

    result = predict(payload)
    return result, 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5055, debug=False)
