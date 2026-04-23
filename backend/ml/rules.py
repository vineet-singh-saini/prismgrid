from __future__ import annotations

from typing import Any


def compute_risk_level(delay_probability: float, cost_overrun_pct: float) -> str:
    if delay_probability > 0.6 or cost_overrun_pct > 20:
        return "High"
    if delay_probability > 0.3:
        return "Medium"
    return "Low"


def compute_confidence(delay_probability: float) -> float:
    return max(delay_probability, 1 - delay_probability)


def generate_recommendations(payload: dict[str, Any], delay_probability: float, cost_overrun_pct: float) -> list[str]:
    recommendations: list[str] = []

    if delay_probability > 0.5:
        recommendations.append("Increase workforce allocation on critical path tasks.")
    if cost_overrun_pct > 15:
        recommendations.append("Optimize material procurement and reduce wastage variance.")
    if float(payload.get("Vendor_Rating", 0)) < 3:
        recommendations.append("Consider switching to higher-rated vendors for risk-heavy packages.")
    if str(payload.get("Rainfall_Level", "")).strip().lower() == "high":
        recommendations.append("Add schedule buffer for weather-sensitive activities.")
    if str(payload.get("Material_Availability", "")).strip().lower() == "low":
        recommendations.append("Secure material supply commitments before next execution window.")
    if str(payload.get("Labor_Availability", "")).strip().lower() == "low":
        recommendations.append("Mobilize backup labor crews and stagger shifts to recover schedule.")
    if float(payload.get("Compliance_Issues", 0)) > 2:
        recommendations.append("Run a focused compliance closure sprint before milestone gate.")

    if not recommendations:
        recommendations.append("Continue current execution plan and monitor weekly risk signals.")

    return recommendations
