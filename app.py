from dotenv import load_dotenv
load_dotenv()

import os
import re
import json
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from functools import wraps

from flask import (
    Flask, render_template, request, jsonify, send_file,
    redirect, url_for, flash, abort
)
from flask_login import (
    LoginManager, login_user, logout_user,
    login_required, current_user
)
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename

from models import db, User, AnalysisHistory, ResetToken
from analyzer.xml_parser import parse_xml, xml_to_json
from analyzer.impact_engine import analyze_impact
from analyzer.report_generator import generate_report, save_report, save_json_report


app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", secrets.token_hex(32))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///impact_analyzer.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
MAIL_FROM = os.environ.get("MAIL_FROM", SMTP_USER)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
REPORT_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

db.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = "login"
login_manager.login_message_category = "warning"
login_manager.login_message = "Please log in to access the analyzer."


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


with app.app_context():
    db.create_all()


def safe_filename(filename):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean = re.sub(r'[^\w.\-]', '', filename)
    return f"{ts}_{clean}"


def send_reset_email(to_email, reset_url):
    if not SMTP_USER or not SMTP_PASS:
        app.logger.warning("SMTP not configured. Reset link: %s", reset_url)
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = MAIL_FROM
    msg["To"] = to_email
    msg["Subject"] = "Strategic Impact Analyzer — Password Reset"

    text_body = f"You requested a password reset.\n\nClick the link below to set a new password:\n\n{reset_url}\n\nThis link expires in 1 hour.\nIf you did not request this, ignore this email."

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
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(MAIL_FROM, [to_email], msg.as_string())
        return True
    except Exception as e:
        app.logger.error("Failed to send reset email: %s", e)
        return False


@app.route("/")
def landing():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    return render_template("landing.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        full_name = request.form.get("full_name", "").strip()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm_password", "")

        errors = []
        if not username or len(username) < 3:
            errors.append("Username must be at least 3 characters.")
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            errors.append("Username can only contain letters, numbers, and underscores.")
        if not email or not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
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
            for e in errors:
                flash(e, "error")
            return render_template("register.html")

        user = User(username=username, email=email, full_name=full_name)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        flash("Account created successfully! Please log in.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        remember = request.form.get("remember") == "on"

        user = User.query.filter_by(username=username).first()

        if user is None or not user.check_password(password):
            flash("Invalid username or password.", "error")
            return render_template("login.html")

        login_user(user, remember=remember)
        next_page = request.args.get("next")
        if next_page and not next_page.startswith("/"):
            next_page = None
        flash(f"Welcome back, {user.full_name or user.username}!", "success")
        return redirect(next_page or url_for("dashboard"))

    return render_template("login.html")


@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        user = User.query.filter_by(email=email).first()

        if user:
            ResetToken.query.filter_by(user_id=user.id, used=False).update({"used": True})
            reset_token = ResetToken(
                user_id=user.id,
                expires_at=datetime.utcnow() + timedelta(hours=1),
            )
            db.session.add(reset_token)
            db.session.commit()

            reset_link = url_for("reset_password", token=reset_token.token, _external=True)
            sent = send_reset_email(email, reset_link)
            if sent:
                flash("Password reset link sent to your email.", "success")
            else:
                flash("Could not send email. Please try again later.", "error")
        else:
            flash("If that email is registered, a reset link has been sent.", "info")

        return redirect(url_for("forgot_password"))

    return render_template("forgot_password.html")


@app.route("/reset-password/<token>", methods=["GET", "POST"])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))

    reset_token = ResetToken.query.filter_by(token=token).first()
    if not reset_token or not reset_token.is_valid():
        flash("Invalid or expired reset link. Please request a new one.", "error")
        return redirect(url_for("forgot_password"))

    if request.method == "POST":
        password = request.form.get("password", "")
        confirm = request.form.get("confirm_password", "")

        if len(password) < 6:
            flash("Password must be at least 6 characters.", "error")
            return render_template("reset_password.html", token=token)

        if password != confirm:
            flash("Passwords do not match.", "error")
            return render_template("reset_password.html", token=token)

        user = User.query.get(reset_token.user_id)
        user.set_password(password)
        reset_token.used = True
        db.session.commit()

        flash("Password reset successful! Please sign in.", "success")
        return redirect(url_for("login"))

    return render_template("reset_password.html", token=token)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("landing"))


@app.route("/dashboard")
@login_required
def dashboard():
    recent = (
        AnalysisHistory.query
        .filter_by(user_id=current_user.id)
        .order_by(AnalysisHistory.created_at.desc())
        .limit(5)
        .all()
    )
    total_analyses = AnalysisHistory.query.filter_by(user_id=current_user.id).count()
    high_risk_count = AnalysisHistory.query.filter_by(user_id=current_user.id, risk_level="HIGH").count()
    return render_template(
        "dashboard.html",
        recent=recent,
        total_analyses=total_analyses,
        high_risk_count=high_risk_count,
        member_since=current_user.created_at,
    )


@app.route("/history")
@login_required
def history():
    page = request.args.get("page", 1, type=int)
    per_page = 10
    pagination = (
        AnalysisHistory.query
        .filter_by(user_id=current_user.id)
        .order_by(AnalysisHistory.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    return render_template("history.html", pagination=pagination)


@app.route("/analyze", methods=["POST"])
@login_required
def analyze():
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


@app.route("/history/<int:analysis_id>")
@login_required
def view_analysis(analysis_id):
    entry = AnalysisHistory.query.get_or_404(analysis_id)
    if entry.user_id != current_user.id:
        flash("Access denied.", "error")
        return redirect(url_for("history"))

    impact = json.loads(entry.impact_json) if entry.impact_json else {}
    return render_template(
        "view_analysis.html",
        entry=entry,
        impact=impact,
    )


@app.route("/history/<int:analysis_id>/delete", methods=["POST"])
@login_required
def delete_analysis(analysis_id):
    entry = AnalysisHistory.query.get_or_404(analysis_id)
    if entry.user_id != current_user.id:
        flash("Access denied.", "error")
        return redirect(url_for("history"))

    db.session.delete(entry)
    db.session.commit()
    flash("Analysis deleted.", "info")
    return redirect(url_for("history"))


@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    if request.method == "POST":
        full_name = request.form.get("full_name", "").strip()
        email = request.form.get("email", "").strip()
        current_password = request.form.get("current_password", "")
        new_password = request.form.get("new_password", "")

        if email != current_user.email:
            existing = User.query.filter_by(email=email).first()
            if existing:
                flash("Email already in use.", "error")
                return render_template("profile.html")

        current_user.full_name = full_name
        current_user.email = email

        if new_password:
            if not current_user.check_password(current_password):
                flash("Current password is incorrect.", "error")
                return render_template("profile.html")
            if len(new_password) < 6:
                flash("New password must be at least 6 characters.", "error")
                return render_template("profile.html")
            current_user.set_password(new_password)

        db.session.commit()
        flash("Profile updated successfully.", "success")
        return redirect(url_for("profile"))

    return render_template("profile.html")


@app.route("/download/<path:filename>")
@login_required
def download(filename):
    return send_file(filename, as_attachment=True)


@app.errorhandler(404)
def not_found(e):
    return render_template("base.html", error_code=404, error_msg="Page not found"), 404


@app.errorhandler(413)
def too_large(e):
    flash("File is too large. Maximum size is 16 MB.", "error")
    return redirect(url_for("dashboard"))


@app.errorhandler(500)
def server_error(e):
    return render_template("base.html", error_code=500, error_msg="Internal server error"), 500


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "true").lower() == "true")
