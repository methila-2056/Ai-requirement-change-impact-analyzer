import json
from datetime import datetime


def generate_report(impact, filename=""):
    """Generate a plain text report from impact analysis."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = []
    lines.append("=" * 60)
    lines.append("   STRATEGIC REQUIREMENT CHANGE IMPACT ANALYSIS REPORT")
    lines.append("=" * 60)
    lines.append(f"  Generated     : {now}")
    if filename:
        lines.append(f"  Source File   : {filename}")
    lines.append("")

    lines.append("┌─────────────────────────────────────────────┐")
    lines.append(f"│  RISK LEVEL     :  {impact['risk_level']:^26}│")
    lines.append(f"│  RISK SCORE     :  {str(impact['risk_score']):^26}│")
    lines.append(f"│  COMPONENTS HIT :  {str(impact['total_components']):^26}│")
    lines.append("└─────────────────────────────────────────────┘")
    lines.append("")

    lines.append("AFFECTED COMPONENTS")
    lines.append("-" * 50)
    for c in impact["components"]:
        risk_tag = ["LOW", "MED", "HIGH"][min(c["risk"] - 1, 2)]
        lines.append(f"  [{risk_tag:4}]  {c['name']:<35} | +{c['effort_days']}d / {c['effort_hrs']}h")

    lines.append("")
    lines.append("EFFORT ESTIMATION")
    lines.append("-" * 50)
    lines.append(f"  Total Effort          : {impact['effort_days']} working days  ({impact['effort_hrs']} man-hours)")
    lines.append(f"  Fast Delivery (2 devs): {impact['fast_delivery_days']} working days")

    lines.append("")
    lines.append("CLIENT COMMUNICATION NOTE")
    lines.append("-" * 50)
    lines.append(f"  {impact['client_note']}")

    lines.append("")
    lines.append("=" * 60)
    lines.append("  END OF REPORT")
    lines.append("=" * 60)

    return "\n".join(lines)


def save_report(report_text, path):
    with open(path, "w", encoding="utf-8") as f:
        f.write(report_text)


def save_json_report(impact, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(impact, f, indent=4)
