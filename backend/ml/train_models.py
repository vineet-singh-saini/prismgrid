from __future__ import annotations

import json
import pickle
from pathlib import Path

import bootstrap  # noqa: F401
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split

from generate_dataset import generate_dataset
from preprocess import preprocess_features

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "dataset" / "dataset.csv"
ARTIFACTS_DIR = BASE_DIR / "artifacts"
DELAY_MODEL_PATH = ARTIFACTS_DIR / "delay_model.pkl"
COST_MODEL_PATH = ARTIFACTS_DIR / "cost_model.pkl"
FEATURE_COLUMNS_PATH = ARTIFACTS_DIR / "feature_columns.pkl"
METRICS_PATH = ARTIFACTS_DIR / "training_metrics.json"


def train_models() -> dict[str, float | int | str]:
    if not DATASET_PATH.exists():
        generate_dataset(DATASET_PATH, rows=1600, seed=42)

    raw_df = pd.read_csv(DATASET_PATH)

    target_delay = raw_df["Delay"].astype(int)
    target_cost = pd.to_numeric(raw_df["Cost_Overrun_%"], errors="coerce").fillna(0.0)
    feature_df = raw_df.drop(columns=["Delay", "Cost_Overrun_%", "Risk_Level"], errors="ignore")
    encoded_features = preprocess_features(feature_df)

    (
        x_train,
        x_test,
        y_delay_train,
        y_delay_test,
        y_cost_train,
        y_cost_test,
    ) = train_test_split(
        encoded_features,
        target_delay,
        target_cost,
        test_size=0.2,
        random_state=42,
        stratify=target_delay,
    )

    delay_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=10,
        random_state=42,
        class_weight="balanced",
    )
    delay_model.fit(x_train, y_delay_train)

    cost_model = RandomForestRegressor(
        n_estimators=150,
        max_depth=10,
        random_state=42,
    )
    cost_model.fit(x_train, y_cost_train)

    delay_predictions = delay_model.predict(x_test)
    delay_probabilities = delay_model.predict_proba(x_test)[:, 1]
    cost_predictions = cost_model.predict(x_test)

    metrics = {
        "dataset_rows": int(len(raw_df)),
        "dataset_columns": int(raw_df.shape[1]),
        "delay_accuracy": float(round(accuracy_score(y_delay_test, delay_predictions), 4)),
        "delay_f1": float(round(f1_score(y_delay_test, delay_predictions), 4)),
        "delay_roc_auc": float(round(roc_auc_score(y_delay_test, delay_probabilities), 4)),
        "cost_mae": float(round(mean_absolute_error(y_cost_test, cost_predictions), 4)),
        "cost_rmse": float(round(mean_squared_error(y_cost_test, cost_predictions) ** 0.5, 4)),
        "cost_r2": float(round(r2_score(y_cost_test, cost_predictions), 4)),
    }

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    with DELAY_MODEL_PATH.open("wb") as model_file:
        pickle.dump(delay_model, model_file)

    with COST_MODEL_PATH.open("wb") as model_file:
        pickle.dump(cost_model, model_file)

    with FEATURE_COLUMNS_PATH.open("wb") as feature_file:
        pickle.dump(list(encoded_features.columns), feature_file)

    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics


if __name__ == "__main__":
    print(json.dumps(train_models(), indent=2))
