import json
import re
from analyzer.xml_parser import flatten_keys


# ─────────────────────────────────────────────
#  Dynamic keyword groups (domain-agnostic)
# ─────────────────────────────────────────────

COMPONENT_RULES = {
    # ETL / Data Engineering
    "SOURCE":           {"label": "Source System",              "risk": 3, "effort_days": 2, "effort_hrs": 16},
    "TARGET":           {"label": "Target System",              "risk": 3, "effort_days": 3, "effort_hrs": 24},
    "TRANSFORMATION":   {"label": "Transformation Logic",       "risk": 2, "effort_days": 2, "effort_hrs": 16},
    "LOOKUP":           {"label": "Lookup Component",           "risk": 3, "effort_days": 2, "effort_hrs": 16},
    "JOIN":             {"label": "Join Logic",                 "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "MAPPING":          {"label": "ETL Mapping",                "risk": 2, "effort_days": 2, "effort_hrs": 16},
    "WORKFLOW":         {"label": "Workflow / Job Schedule",    "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "SESSION":          {"label": "Session Config",             "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "EXPRESSION":       {"label": "Expression / Formula",      "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "AGGREGATOR":       {"label": "Aggregator Logic",           "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "FILTER":           {"label": "Filter Condition",           "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "SORTER":           {"label": "Sort Logic",                 "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "ROUTER":           {"label": "Router / Conditional Flow",  "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "SEQUENCE":         {"label": "Sequence Generator",         "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "NORMALIZER":       {"label": "Normalizer",                 "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "RANK":             {"label": "Rank Transformation",        "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "UPDATESTRATEGY":   {"label": "Update Strategy",            "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "JOINER":           {"label": "Joiner Transformation",      "risk": 2, "effort_days": 2, "effort_hrs": 12},
    "COLUMN":           {"label": "Schema / Column Definition", "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "SCHEMA":           {"label": "Data Schema",                "risk": 3, "effort_days": 2, "effort_hrs": 16},
    "PIPELINE":         {"label": "Data Pipeline",              "risk": 3, "effort_days": 3, "effort_hrs": 24},
    "CONNECTOR":        {"label": "Connector / Connection",     "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "REPOSITORY":       {"label": "Repository / Metadata",     "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "DATABASE":         {"label": "Database Layer",             "risk": 3, "effort_days": 2, "effort_hrs": 16},
    "TABLE":            {"label": "Table Definition",           "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "FIELD":            {"label": "Field / Attribute",          "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "KEY":              {"label": "Key / Index",                "risk": 2, "effort_days": 1, "effort_hrs": 8},
    "CONSTRAINT":       {"label": "Data Constraint",            "risk": 2, "effort_days": 1, "effort_hrs": 8},
    # General software modules
    "SECURITY":         {"label": "Security Layer",             "risk": 3, "effort_days": 3, "effort_hrs": 24},
    "AUTH":             {"label": "Authentication",             "risk": 3, "effort_days": 2, "effort_hrs": 16},
    "API":              {"label": "API Layer",                  "risk": 2, "effort_days": 2, "effort_hrs": 16},
    "PAYMENT":          {"label": "Payment System",             "risk": 3, "effort_days": 3, "effort_hrs": 24},
    "NOTIFICATION":     {"label": "Notification Service",      "risk": 1, "effort_days": 1, "effort_hrs": 8},
    "REPORT":           {"label": "Reporting Module",           "risk": 2, "effort_days": 2, "effort_hrs": 12},
    "DASHBOARD":        {"label": "Dashboard / Analytics",     "risk": 2, "effort_days": 2, "effort_hrs": 12},
    "CACHE":            {"label": "Cache Layer",                "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "LOG":              {"label": "Logging / Audit",            "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "CONFIG":           {"label": "Configuration",              "risk": 1, "effort_days": 1, "effort_hrs": 4},
    "PARAMETER":        {"label": "Parameter / Variable",      "risk": 1, "effort_days": 1, "effort_hrs": 4},
}


def analyze_impact(data):
    """
    Analyze any XML-derived dict dynamically.
    Returns components found, risk level, total effort.
    """
    all_keys = flatten_keys(data)
    full_text = " ".join(all_keys)

    detected = {}

    for keyword, meta in COMPONENT_RULES.items():
        # Match as standalone word or part of key
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, full_text):
            detected[keyword] = meta

    # If nothing detected, try substring match (fallback for custom XML)
    if not detected:
        for keyword, meta in COMPONENT_RULES.items():
            if keyword in full_text:
                detected[keyword] = meta

    # Calculate totals
    total_risk_score = sum(v["risk"] for v in detected.values())
    total_effort_days = sum(v["effort_days"] for v in detected.values())
    total_effort_hrs  = sum(v["effort_hrs"]  for v in detected.values())

    # Risk classification
    if total_risk_score >= 10:
        risk_level = "HIGH"
    elif total_risk_score >= 5:
        risk_level = "MEDIUM"
    elif total_risk_score > 0:
        risk_level = "LOW"
    else:
        risk_level = "UNKNOWN"

    # Delivery speed estimate (team of 2)
    fast_delivery_days = max(1, total_effort_days // 2)
    normal_delivery_days = total_effort_days

    # Client impact summary
    if risk_level == "HIGH":
        client_note = "⚠️ This change has HIGH risk. Multiple critical components are affected. Regression testing is mandatory before deployment."
    elif risk_level == "MEDIUM":
        client_note = "🔶 Moderate risk detected. Some dependent modules need review. Plan for additional testing cycles."
    elif risk_level == "LOW":
        client_note = "✅ Low risk change. Impact is limited to minor components. Standard review process recommended."
    else:
        client_note = "ℹ️ Unable to detect standard components. Manual review recommended."

    components = [
        {
            "name": meta["label"],
            "keyword": kw,
            "risk": meta["risk"],
            "effort_days": meta["effort_days"],
            "effort_hrs": meta["effort_hrs"],
        }
        for kw, meta in detected.items()
    ]

    return {
        "components": components,
        "risk_level": risk_level,
        "risk_score": total_risk_score,
        "effort_days": normal_delivery_days,
        "effort_hrs": total_effort_hrs,
        "fast_delivery_days": fast_delivery_days,
        "client_note": client_note,
        "total_components": len(components),
    }
