import os
import json
from flask import Flask, render_template, request, jsonify, send_file
from analyzer.xml_parser import parse_xml, xml_to_json
from analyzer.impact_engine import analyze_impact
from analyzer.report_generator import generate_report, save_report, save_json_report
from datetime import datetime

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
REPORT_FOLDER = "reports"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    if "xmlfile" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["xmlfile"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith(".xml"):
        return jsonify({"error": "Please upload a valid .xml file"}), 400

    # Save uploaded XML
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    xml_path = os.path.join(UPLOAD_FOLDER, f"{timestamp}_{file.filename}")
    file.save(xml_path)

    # Parse XML
    try:
        data = parse_xml(xml_path)
    except Exception as e:
        return jsonify({"error": f"Failed to parse XML: {str(e)}"}), 400

    # Save chunk.json
    chunk_path = os.path.join(REPORT_FOLDER, f"{timestamp}_chunk.json")
    xml_to_json(xml_path, chunk_path)

    # Analyze impact
    impact = analyze_impact(data)

    # Generate text report
    report_text = generate_report(impact, filename=file.filename)
    report_path = os.path.join(REPORT_FOLDER, f"{timestamp}_impact_report.txt")
    save_report(report_text, report_path)

    # Save JSON report
    json_report_path = os.path.join(REPORT_FOLDER, f"{timestamp}_impact_report.json")
    save_json_report(impact, json_report_path)

    return jsonify({
        "success": True,
        "filename": file.filename,
        "impact": impact,
        "report_text": report_text,
        "chunk_file": chunk_path,
        "report_file": report_path,
    })


@app.route("/download/<path:filename>")
def download(filename):
    return send_file(filename, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True)
