import pandas as pd
from sqlalchemy.orm import Session
from models import Feedback


def load(df: pd.DataFrame, db: Session) -> int:
    records = df.to_dict(orient="records")
    loaded = 0
    for row in records:
        item = Feedback(
            participant_name=row["participant_name"],
            program_name=row["program_name"],
            rating=int(row["rating"]),
            comments=row.get("comments"),
            submitted_at=row["submitted_at"],
        )
        db.add(item)
        loaded += 1
    db.commit()
    return loaded
