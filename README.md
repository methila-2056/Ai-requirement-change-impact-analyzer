# Strategic Requirement Change Impact Analyzer

## Setup & Run

### 1. Install dependencies
```
pip install flask xmltodict
```

### 2. Run the app
```
python app.py
```

### 3. Open browser
```
http://127.0.0.1:5000
```

### 4. Upload any XML file → Get instant impact analysis report

---

## Project Structure
```
Strategic_Impact_Analyzer/
├── app.py                        ← Flask server (main entry)
├── requirements.txt              ← Install list
├── uploads/                      ← Uploaded XML files stored here
├── reports/                      ← chunk.json + impact reports saved here
├── analyzer/
│   ├── xml_parser.py             ← XML → JSON converter
│   ├── impact_engine.py          ← Risk scoring engine
│   └── report_generator.py      ← Report builder
└── templates/
    └── index.html                ← Web UI
```
