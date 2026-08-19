import os

basedir = os.path.abspath(os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv(os.path.join(basedir, ".env"))

import re
import json
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename

from models import db, User, AnalysisHistory, ResetToken
from analyzer.xml_parser import parse_xml, xml_to_json
from analyzer.impact_engine import analyze_impact
from analyzer.report_generator import generate_report, save_report, save_json_report


app = Flask(__name__)
CORS(app)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", secrets.token_hex(32))
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL",
    "sqlite:///" + os.path.join(basedir, "instance", "impact_analyzer.db"),
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
MAIL_FROM = os.environ.get("MAIL_FROM", SMTP_USER)

UPLOAD_FOLDER = os.path.join(basedir, "uploads")
REPORT_FOLDER = os.path.join(basedir, "reports")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)
os.makedirs(os.path.join(basedir, "instance"), exist_ok=True)

db.init_app(app)

with app.app_context():
    db.create_all()


JWT_EXPIRY_HOURS = 24


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            payload = jwt.decode(
                token, app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            user = User.query.get(payload["user_id"])
            if user is None:
                return jsonify({"error": "User not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(user, *args, **kwargs)

    return decorated


def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def safe_filename(filename):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean = re.sub(r"[^\w.\-]", "", filename)
    return f"{ts}_{clean}"


def send_reset_email(to_email, reset_url):
    if not SMTP_USER or not SMTP_PASS:
        app.logger.warning(
            "SMTP not configured. User=%s Pass_set=%s", SMTP_USER, bool(SMTP_PASS)
        )
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = MAIL_FROM
    msg["To"] = to_email
    msg["Subject"] = "Strategic Impact Analyzer — Password Reset"

    text_body = (
        f"You requested a password reset.\n\n"
        f"Click the link below to set a new password:\n\n"
        f"{reset_url}\n\n"
        f"This link expires in 1 hour.\n"
        f"If you did not request this, ignore this email."
    )

    html_body = f"""
    <div style="font-family:Inter,-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#5b6ef5,#a855f7);border-radius:12px;line-height:48px;font-size:22px;color:#fff;">&#9889;</div>
      </div>
      <h2 style="text-align:center;color:#1a1d2e;margin-bottom:8px;">Password Reset Request</h2>
      <p style="text-align:center;color:#4a5068;font-size:14px;">You requested to reset your password for <strong>Strategic Impact Analyzer</strong>.</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="{reset_url}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#5b6ef5,#a855f7);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">Reset Password</a>
      </div>
      <p style="color:#8890a8;font-size:12px;text-align:center;">This link expires in <strong>1 hour</strong>.</p>
      <p style="color:#8890a8;font-size:12px;text-align:center;">If you did not request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #e2e5ee;margin:24px 0;">
      <p style="color:#8890a8;font-size:11px;text-align:center;">Strategic Impact Analyzer &middot; Automated email — do not reply</p>
    </div>"""

    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(MAIL_FROM, [to_email], msg.as_string())
        return True
    except Exception as e:
        app.logger.error("Failed to send reset email to %s: %s", to_email, e)
        return False


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/")
def landing():
    return jsonify({"message": "Strategic Impact Analyzer API", "version": "1.0"})


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    full_name = data.get("full_name", "").strip()
    password = data.get("password", "")
    confirm = data.get("confirm_password", "")

    errors = []
    if not username or len(username) < 3:
        errors.append("Username must be at least 3 characters.")
    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        errors.append("Username can only contain letters, numbers, and underscores.")
    if not email or not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        errors.append("Please enter a valid email address.")
    if not password or len(password) < 6:
        errors.append("Password must be at least 6 characters.")
    if password != confirm:
        errors.append("Passwords do not match.")
    if User.query.filter_by(username=username).first():
        errors.append("Username already taken.")
    if User.query.filter_by(email=email).first():
        errors.append("Email already registered.")

    if errors:
        return jsonify({"errors": errors}), 400

    user = User(username=username, email=email, full_name=full_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = User.query.filter_by(username=username).first()
    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    token = generate_token(user.id)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
        },
    })


@app.route("/api/me")
@token_required
def me(current_user):
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    })


@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    user = User.query.filter_by(email=email).first()

    if user:
        ResetToken.query.filter_by(user_id=user.id, used=False).update({"used": True})
        reset_token = ResetToken(
            user_id=user.id,
            expires_at=datetime.utcnow() + timedelta(hours=1),
        )
        db.session.add(reset_token)
        db.session.commit()

        reset_link = f"{request.host_url}api/reset-password/{reset_token.token}"
        sent = send_reset_email(email, reset_link)

        if sent:
            return jsonify({"message": "Password reset link sent to your email"})
        return jsonify({"error": "Could not send email. Please try again later."}), 500

    return jsonify({"message": "If that email is registered, a reset link has been sent"})


@app.route("/api/reset-password/<token>", methods=["POST"])
def reset_password(token):
    reset_token = ResetToken.query.filter_by(token=token).first()
    if not reset_token or not reset_token.is_valid():
        return jsonify({"error": "Invalid or expired reset link"}), 400

    data = request.get_json(silent=True) or {}
    password = data.get("password", "")
    confirm = data.get("confirm_password", "")

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if password != confirm:
        return jsonify({"error": "Passwords do not match"}), 400

    user = User.query.get(reset_token.user_id)
    user.set_password(password)
    reset_token.used = True
    db.session.commit()

    return jsonify({"message": "Password reset successful"})


@app.route("/api/dashboard")
@token_required
def dashboard(current_user):
    total = AnalysisHistory.query.filter_by(user_id=current_user.id).count()
    high_risk = AnalysisHistory.query.filter_by(
        user_id=current_user.id, risk_level="HIGH"
    ).count()
    recent = (
        AnalysisHistory.query
        .filter_by(user_id=current_user.id)
        .order_by(AnalysisHistory.created_at.desc())
        .limit(5)
        .all()
    )

    return jsonify({
        "total_analyses": total,
        "high_risk_count": high_risk,
        "member_since": current_user.created_at.isoformat() if current_user.created_at else None,
        "recent": [
            {
                "id": a.id,
                "filename": a.filename,
                "risk_level": a.risk_level,
                "risk_score": a.risk_score,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in recent
        ],
    })


@app.route("/api/analyze", methods=["POST"])
@token_required
def analyze(current_user):
    if "xmlfile" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["xmlfile"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    if not file.filename.lower().endswith(".xml"):
        return jsonify({"error": "Please upload a valid .xml file"}), 400

    ts_name = safe_filename(file.filename)
    xml_path = os.path.join(UPLOAD_FOLDER, ts_name)
    file.save(xml_path)

    try:
        data = parse_xml(xml_path)
    except Exception as e:
        return jsonify({"error": f"Failed to parse XML: {str(e)}"}), 400

    chunk_path = os.path.join(REPORT_FOLDER, f"{ts_name}_chunk.json")
    xml_to_json(xml_path, chunk_path)

    impact = analyze_impact(data)

    report_text = generate_report(impact, filename=file.filename)
    report_path = os.path.join(REPORT_FOLDER, f"{ts_name}_impact_report.txt")
    save_report(report_text, report_path)

    json_report_path = os.path.join(REPORT_FOLDER, f"{ts_name}_impact_report.json")
    save_json_report(impact, json_report_path)

    history_entry = AnalysisHistory(
        user_id=current_user.id,
        filename=file.filename,
        risk_level=impact["risk_level"],
        risk_score=impact["risk_score"],
        total_components=impact["total_components"],
        effort_days=impact["effort_days"],
        effort_hrs=impact["effort_hrs"],
        fast_delivery_days=impact["fast_delivery_days"],
        client_note=impact["client_note"],
        report_text=report_text,
        impact_json=json.dumps(impact),
    )
    db.session.add(history_entry)
    db.session.commit()

    return jsonify({
        "success": True,
        "filename": file.filename,
        "impact": impact,
        "report_text": report_text,
        "chunk_file": chunk_path,
        "report_file": report_path,
    })


@app.route("/api/history")
@token_required
def history(current_user):
    page = request.args.get("page", 1, type=int)
    per_page = 10
    pagination = (
        AnalysisHistory.query
        .filter_by(user_id=current_user.id)
        .order_by(AnalysisHistory.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify({
        "items": [
            {
                "id": a.id,
                "filename": a.filename,
                "risk_level": a.risk_level,
                "risk_score": a.risk_score,
                "total_components": a.total_components,
                "effort_days": a.effort_days,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in pagination.items
        ],
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "pages": pagination.pages,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev,
    })


@app.route("/api/history/<int:analysis_id>")
@token_required
def view_analysis(current_user, analysis_id):
    entry = AnalysisHistory.query.get_or_404(analysis_id)
    if entry.user_id != current_user.id:
        return jsonify({"error": "Access denied"}), 403

    impact = json.loads(entry.impact_json) if entry.impact_json else {}
    return jsonify({
        "id": entry.id,
        "filename": entry.filename,
        "risk_level": entry.risk_level,
        "risk_score": entry.risk_score,
        "total_components": entry.total_components,
        "effort_days": entry.effort_days,
        "effort_hrs": entry.effort_hrs,
        "fast_delivery_days": entry.fast_delivery_days,
        "client_note": entry.client_note,
        "report_text": entry.report_text,
        "impact": impact,
        "created_at": entry.created_at.isoformat() if entry.created_at else None,
    })


@app.route("/api/history/<int:analysis_id>", methods=["DELETE"])
@token_required
def delete_analysis(current_user, analysis_id):
    entry = AnalysisHistory.query.get_or_404(analysis_id)
    if entry.user_id != current_user.id:
        return jsonify({"error": "Access denied"}), 403

    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Analysis deleted"})


@app.route("/api/profile")
@token_required
def get_profile(current_user):
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    })


@app.route("/api/profile", methods=["PUT"])
@token_required
def update_profile(current_user):
    data = request.get_json(silent=True) or {}
    full_name = data.get("full_name", current_user.full_name)
    email = data.get("email", current_user.email)
    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")

    if email != current_user.email:
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already in use"}), 400

    current_user.full_name = full_name
    current_user.email = email

    if new_password:
        if not current_user.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 400
        if len(new_password) < 6:
            return jsonify({"error": "New password must be at least 6 characters"}), 400
        current_user.set_password(new_password)

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"})


@app.route("/api/logout", methods=["POST"])
@token_required
def logout(current_user):
    return jsonify({"message": "Logged out successfully"})


# ---------------------------------------------------------------------------
# Error handlers
# ---------------------------------------------------------------------------

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File is too large. Maximum size is 16 MB."}), 413


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "true").lower() == "true")
