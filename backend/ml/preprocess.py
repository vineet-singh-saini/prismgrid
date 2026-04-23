from __future__ import annotations

from typing import Iterable

import bootstrap  # noqa: F401
import pandas as pd

DROP_COLUMNS = ["Project_ID", "Project_Name"]
NUMERIC_COLUMNS = [
    "Vendor_Rating",
    "Budget_Utilization",
    "Schedule_Variance_Days",
    "Compliance_Issues",
    "Team_Experience_Years",
    "Change_Request_Count",
    "Safety_Incidents",
]


def preprocess_features(df: pd.DataFrame) -> pd.DataFrame:
    working_df = df.copy()

    for column in DROP_COLUMNS:
        if column in working_df.columns:
            working_df = working_df.drop(columns=[column])

    for column in NUMERIC_COLUMNS:
        if column in working_df.columns:
            working_df[column] = pd.to_numeric(working_df[column], errors="coerce")

    encoded_df = pd.get_dummies(working_df, dtype=float)
    encoded_df = encoded_df.fillna(0)
    return encoded_df


def align_features(df: pd.DataFrame, feature_columns: Iterable[str]) -> pd.DataFrame:
    return df.reindex(columns=list(feature_columns), fill_value=0)
