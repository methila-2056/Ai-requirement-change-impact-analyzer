import xmltodict
import json
import os


def parse_xml(file_path):
    """Parse any XML file and return as Python dict."""
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        raw = f.read()
    data = xmltodict.parse(raw)
    return data


def xml_to_json(file_path, output_path):
    """Convert XML to chunk.json and save it."""
    data = parse_xml(file_path)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    return data


def flatten_keys(data, parent="", result=None):
    """Recursively flatten all keys from nested dict/list."""
    if result is None:
        result = set()
    if isinstance(data, dict):
        for k, v in data.items():
            full_key = f"{parent}.{k}" if parent else k
            result.add(full_key.upper())
            flatten_keys(v, full_key, result)
    elif isinstance(data, list):
        for item in data:
            flatten_keys(item, parent, result)
    elif isinstance(data, str):
        result.add(data.upper())
    return result
