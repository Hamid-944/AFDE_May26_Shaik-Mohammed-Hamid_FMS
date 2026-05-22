import os
import io
import csv
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import EtlRun, Feedback
from schemas import EtlRunResponse, EtlReportResponse
from etl.pipeline import run_pipeline

router = APIRouter(prefix="/etl", tags=["ETL Pipeline"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}


@router.post("/upload", summary="Upload a CSV or Excel file")
async def upload_file(file: UploadFile = File(...)):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    dest = os.path.join(UPLOAD_DIR, file.filename)
    contents = await file.read()
    with open(dest, "wb") as f:
        f.write(contents)

    return {
        "filename": file.filename,
        "file_path": dest,
        "size_bytes": len(contents),
        "message": "File uploaded successfully. Call /etl/run to start the pipeline.",
    }


@router.post("/run", summary="Run the ETL pipeline on an uploaded file")
def run_etl(file_path: str, db: Session = Depends(get_db)):
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

    filename = os.path.basename(file_path)
    try:
        result = run_pipeline(file_path, filename, db)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Clean up uploaded file after successful load
    try:
        os.remove(file_path)
    except OSError:
        pass

    return result


@router.get("/runs", response_model=list[EtlRunResponse], summary="List all ETL run records")
def list_runs(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    runs = (
        db.query(EtlRun)
        .order_by(EtlRun.started_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return runs


@router.get("/report", response_model=EtlReportResponse, summary="Aggregate ETL statistics")
def get_report(db: Session = Depends(get_db)):
    runs = db.query(EtlRun).order_by(EtlRun.started_at.desc()).all()

    total_runs = len(runs)
    total_records = sum(r.total_records or 0 for r in runs)
    total_loaded = sum(r.loaded_records or 0 for r in runs)
    total_dupes = sum(r.duplicate_records or 0 for r in runs)
    total_invalid = sum(r.invalid_records or 0 for r in runs)

    valid_rates = [
        r.valid_records / r.total_records
        for r in runs
        if (r.total_records or 0) > 0
    ]
    avg_valid_rate = round(sum(valid_rates) / len(valid_rates) * 100, 1) if valid_rates else 0.0

    return EtlReportResponse(
        total_runs=total_runs,
        total_records_processed=total_records,
        total_loaded=total_loaded,
        total_duplicates=total_dupes,
        total_invalid=total_invalid,
        avg_valid_rate=avg_valid_rate,
        runs=runs,
    )


@router.get("/report/download", summary="Download all feedback as CSV")
def download_report(db: Session = Depends(get_db)):
    rows = db.query(Feedback).order_by(Feedback.submitted_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        ["feedback_id", "participant_name", "program_name", "rating", "comments", "submitted_at"]
    )
    for r in rows:
        writer.writerow([
            r.feedback_id,
            r.participant_name,
            r.program_name,
            r.rating,
            r.comments or "",
            r.submitted_at.isoformat() if r.submitted_at else "",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=feedback_export.csv"},
    )
