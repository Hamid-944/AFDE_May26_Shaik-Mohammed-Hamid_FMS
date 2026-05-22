import pandas as pd
from pathlib import Path


SUPPORTED_EXTENSIONS = {".csv", ".xlsx", ".xls"}


def extract(file_path: str) -> tuple[pd.DataFrame, dict]:
    path = Path(file_path)
    ext = path.suffix.lower()

    if ext not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {ext}. Supported: {', '.join(SUPPORTED_EXTENSIONS)}")

    if ext == ".csv":
        df = pd.read_csv(file_path, encoding="utf-8", on_bad_lines="skip")
    else:
        df = pd.read_excel(file_path, engine="openpyxl")

    meta = {
        "filename": path.name,
        "file_type": ext.lstrip(".").upper(),
        "raw_records": len(df),
        "columns_found": list(df.columns),
    }

    return df, meta


REQUIRED_COLUMNS = {"participant_name", "program_name", "rating"}


def validate_columns(df: pd.DataFrame) -> list[str]:
    missing = REQUIRED_COLUMNS - set(df.columns.str.lower().str.strip())
    return list(missing)
