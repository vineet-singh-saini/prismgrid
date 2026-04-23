from __future__ import annotations

import argparse
import json
import pickle
import sys
from pathlib import Path

import bootstrap  # noqa: F401
import pandas as pd

from preprocess import align_features, preprocess_features
from rules import compute_confidence, compute_risk_level, generate_recommendations
from train_models import (
    COST_MODEL_PATH,
    DELAY_MODEL_PATH,
    FEATURE_COLUMNS_PATH,
    METRICS_PATH,
    train_models,
)

_MODEL_CACHE: dict[str, object] | None = None


def _load_artifacts() -> dict[str, object]:
    global _MODEL_CACHE
    if _MODEL_CACHE is not None:
        return _MODEL_CACHE

    if not DELAY_MODEL_PATH.exists() or not COST_MODEL_PATH.exists() or not FEATURE_COLUMNS_PATH.exists():
        train_models()

    with DELAY_MODEL_PATH.open("rb") as model_file:
        delay_model = pickle.load(model_file)

    with COST_MODEL_PATH.open("rb") as model_file:
        cost_model = pickle.load(model_file)

    with FEATURE_COLUMNS_PATH.open("rb") as feature_file:
        feature_columns = pickle.load(feature_file)

    metrics = {}
    if METRICS_PATH.exists():
        metrics = json.loads(METRICS_PATH.read_text(encoding="utf-8"))

    _MODEL_CACHE = {
        "delay_model": delay_model,
        "cost_model": cost_model,
        "feature_columns": feature_columns,
        "metrics": metrics,
    }
    return _MODEL_CACHE


def predict(payload: dict[str, object]) -> dict[str, object]:
    artifacts = _load_artifacts()
    feature_frame = pd.DataFrame([payload])
    encoded_frame = preprocess_features(feature_frame)
    aligned_frame = align_features(encoded_frame, artifacts["feature_columns"])

    delay_probability = float(artifacts["delay_model"].predict_proba(aligned_frame)[0][1])
    cost_overrun_pct = float(artifacts["cost_model"].predict(aligned_frame)[0])
    risk_level = compute_risk_level(delay_probability, cost_overrun_pct)
    confidence = compute_confidence(delay_probability)
    recommendations = generate_recommendations(payload, delay_probability, cost_overrun_pct)

    return {
        "delay_probability": round(delay_probability, 4),
        "predicted_cost_overrun_pct": round(max(0.0, cost_overrun_pct), 2),
        "risk_level": risk_level,
        "confidence": round(confidence, 4),
        "recommendations": recommendations,
        "model_metrics": artifacts["metrics"],
    }


def _main() -> None:
    parser = argparse.ArgumentParser(description="PRISM-GRID ML prediction CLI")
    parser.add_argument("--payload", help="JSON payload for prediction")
    parser.add_argument("--train-if-missing", action="store_true", default=True)
    args = parser.parse_args()

    if args.payload:
        payload_data = json.loads(args.payload)
    else:
        payload_data = json.loads(sys.stdin.read())

    result = predict(payload_data)
    print(json.dumps(result))


if __name__ == "__main__":
    _main()
