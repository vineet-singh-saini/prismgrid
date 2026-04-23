from __future__ import annotations

import csv
import random
from pathlib import Path


def _pick_level(score: float) -> str:
    if score > 0.62:
        return "High"
    if score > 0.35:
        return "Medium"
    return "Low"


def _rain_penalty(level: str) -> float:
    return {"Low": 0.0, "Medium": 0.08, "High": 0.19}[level]


def _availability_penalty(level: str) -> float:
    return {"High": 0.0, "Medium": 0.07, "Low": 0.17}[level]


def _complexity_penalty(level: str) -> float:
    return {"Low": 0.02, "Medium": 0.09, "High": 0.2}[level]


def generate_dataset(output_path: Path, rows: int = 1400, seed: int = 42) -> None:
    random.seed(seed)

    fieldnames = [
        "Project_ID",
        "Project_Name",
        "Vendor_Rating",
        "Rainfall_Level",
        "Labor_Availability",
        "Material_Availability",
        "Project_Complexity",
        "Budget_Utilization",
        "Schedule_Variance_Days",
        "Compliance_Issues",
        "Team_Experience_Years",
        "Change_Request_Count",
        "Safety_Incidents",
        "Delay",
        "Cost_Overrun_%",
        "Risk_Level",
    ]

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", newline="", encoding="utf-8") as dataset_file:
        writer = csv.DictWriter(dataset_file, fieldnames=fieldnames)
        writer.writeheader()

        for index in range(rows):
            vendor_rating = random.randint(1, 5)
            rainfall_level = random.choices(["Low", "Medium", "High"], weights=[0.45, 0.37, 0.18])[0]
            labor_availability = random.choices(["Low", "Medium", "High"], weights=[0.22, 0.5, 0.28])[0]
            material_availability = random.choices(["Low", "Medium", "High"], weights=[0.2, 0.48, 0.32])[0]
            project_complexity = random.choices(["Low", "Medium", "High"], weights=[0.25, 0.5, 0.25])[0]
            budget_utilization = round(random.uniform(56, 99), 2)
            schedule_variance_days = round(random.uniform(-4, 34), 1)
            compliance_issues = random.randint(0, 5)
            team_experience_years = round(random.uniform(2.5, 16.0), 1)
            change_request_count = random.randint(0, 18)
            safety_incidents = random.randint(0, 4)

            delay_signal = 0.0
            delay_signal += _rain_penalty(rainfall_level)
            delay_signal += _availability_penalty(labor_availability)
            delay_signal += _availability_penalty(material_availability)
            delay_signal += _complexity_penalty(project_complexity)
            delay_signal += max(0.0, (budget_utilization - 78) / 75)
            delay_signal += max(0.0, schedule_variance_days / 40)
            delay_signal += compliance_issues * 0.024
            delay_signal += change_request_count * 0.012
            delay_signal += safety_incidents * 0.019
            delay_signal += max(0.0, (4 - vendor_rating) * 0.055)
            delay_signal += max(0.0, (8 - team_experience_years) * 0.014)
            delay_signal += random.uniform(-0.08, 0.08)
            delay_signal = max(0.0, min(1.0, delay_signal))

            delay = 1 if delay_signal > 0.5 else 0

            cost_overrun_pct = (
                2.8
                + delay_signal * 24.5
                + max(0.0, (budget_utilization - 70) * 0.13)
                + compliance_issues * 0.95
                + change_request_count * 0.35
                + safety_incidents * 0.55
                + (5 - vendor_rating) * 0.8
                + random.uniform(-2.1, 2.1)
            )
            cost_overrun_pct = round(max(0.0, min(45.0, cost_overrun_pct)), 2)
            risk_level = _pick_level(max(delay_signal, cost_overrun_pct / 32))

            writer.writerow(
                {
                    "Project_ID": f"PRJ-{index + 1:04d}",
                    "Project_Name": f"Synthetic Project {index + 1}",
                    "Vendor_Rating": vendor_rating,
                    "Rainfall_Level": rainfall_level,
                    "Labor_Availability": labor_availability,
                    "Material_Availability": material_availability,
                    "Project_Complexity": project_complexity,
                    "Budget_Utilization": budget_utilization,
                    "Schedule_Variance_Days": schedule_variance_days,
                    "Compliance_Issues": compliance_issues,
                    "Team_Experience_Years": team_experience_years,
                    "Change_Request_Count": change_request_count,
                    "Safety_Incidents": safety_incidents,
                    "Delay": delay,
                    "Cost_Overrun_%": cost_overrun_pct,
                    "Risk_Level": risk_level,
                }
            )


if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent
    generate_dataset(base_dir / "dataset" / "dataset.csv")
