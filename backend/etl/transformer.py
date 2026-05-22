import pandas as pd
from datetime import datetime


def transform(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    df = df.copy()
    df.columns = df.columns.str.lower().str.strip()

    stats = {
        "raw": len(df),
        "duplicates_removed": 0,
        "invalid_rating": 0,
        "missing_name": 0,
        "missing_program": 0,
        "invalid_date": 0,
        "text_standardized": 0,
        "valid": 0,
        "dropped": 0,
    }

    # ── Step 1: Remove exact duplicates ──
    before = len(df)
    df = df.drop_duplicates()
    stats["duplicates_removed"] = before - len(df)

    # ── Step 2: Standardize text columns ──
    text_changes = 0
    for col in ["participant_name", "program_name", "comments"]:
        if col in df.columns:
            original = df[col].copy()
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace({"nan": None, "": None, "none": None, "None": None})
            # Title-case names and programs
            if col in ["participant_name", "program_name"]:
                mask = df[col].notna()
                df.loc[mask, col] = df.loc[mask, col].str.title()
            text_changes += (original != df[col]).sum()
    stats["text_standardized"] = int(text_changes)

    # ── Step 3: Drop rows with missing required fields ──
    missing_name_mask = df["participant_name"].isna() | (df["participant_name"].str.strip() == "")
    stats["missing_name"] = int(missing_name_mask.sum())

    missing_program_mask = df["program_name"].isna() | (df["program_name"].str.strip() == "")
    stats["missing_program"] = int(missing_program_mask.sum())

    drop_mask = missing_name_mask | missing_program_mask
    df = df[~drop_mask]

    # ── Step 4: Validate and fix ratings ──
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
    invalid_rating_mask = df["rating"].isna() | ~df["rating"].between(1, 5)
    stats["invalid_rating"] = int(invalid_rating_mask.sum())
    df = df[~invalid_rating_mask]
    df["rating"] = df["rating"].astype(int)

    # ── Step 5: Handle submitted_at ──
    if "submitted_at" in df.columns:
        original_dates = df["submitted_at"].copy()
        df["submitted_at"] = pd.to_datetime(df["submitted_at"], errors="coerce")
        invalid_date_mask = df["submitted_at"].isna()
        stats["invalid_date"] = int(invalid_date_mask.sum())
        df.loc[invalid_date_mask, "submitted_at"] = datetime.now()
    else:
        df["submitted_at"] = datetime.now()

    # ── Step 6: Fill optional comments ──
    if "comments" in df.columns:
        df["comments"] = df["comments"].where(df["comments"].notna(), None)
    else:
        df["comments"] = None

    # ── Final stats ──
    stats["valid"] = len(df)
    stats["dropped"] = stats["raw"] - stats["duplicates_removed"] - stats["valid"]
    stats["dropped"] = max(0, stats["dropped"])

    # Keep only needed columns
    df = df[["participant_name", "program_name", "rating", "comments", "submitted_at"]]

    return df, stats
