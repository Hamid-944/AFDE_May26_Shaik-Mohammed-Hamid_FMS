from datetime import datetime
from sqlalchemy.orm import Session
from etl.extractor import extract, validate_columns
from etl.transformer import transform
from etl.loader import load
from models import EtlRun


def run_pipeline(file_path: str, filename: str, db: Session) -> dict:
    run = EtlRun(filename=filename, status="running", started_at=datetime.now())
    db.add(run)
    db.commit()
    db.refresh(run)

    try:
        # ── Extract ──
        df, meta = extract(file_path)

        missing_cols = validate_columns(df)
        if missing_cols:
            raise ValueError(f"Missing required columns: {', '.join(missing_cols)}")

        run.total_records = meta["raw_records"]
        db.commit()

        # ── Transform ──
        clean_df, stats = transform(df)

        run.duplicate_records = stats["duplicates_removed"]
        run.invalid_records = stats["invalid_rating"] + stats["missing_name"] + stats["missing_program"]
        run.cleaned_records = stats["text_standardized"]
        run.valid_records = stats["valid"]
        db.commit()

        # ── Load ──
        loaded = load(clean_df, db)
        run.loaded_records = loaded
        run.status = "success"
        run.completed_at = datetime.now()
        db.commit()

        return {
            "run_id": run.run_id,
            "status": "success",
            "filename": filename,
            "total_records": run.total_records,
            "valid_records": run.valid_records,
            "loaded_records": run.loaded_records,
            "duplicate_records": run.duplicate_records,
            "invalid_records": run.invalid_records,
            "cleaned_records": run.cleaned_records,
            "started_at": str(run.started_at),
            "completed_at": str(run.completed_at),
        }

    except Exception as e:
        run.status = "failed"
        run.error_message = str(e)
        run.completed_at = datetime.now()
        db.commit()
        raise
