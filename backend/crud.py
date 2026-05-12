from sqlalchemy.orm import Session
from sqlalchemy import func, or_, cast, Date
from models import Feedback
from schemas import FeedbackCreate, FeedbackUpdate
from typing import Optional
from datetime import datetime, timedelta


def create_feedback(db: Session, payload: FeedbackCreate) -> Feedback:
    item = Feedback(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_feedback_by_id(db: Session, feedback_id: int) -> Optional[Feedback]:
    return db.query(Feedback).filter(Feedback.feedback_id == feedback_id).first()


def get_all_feedback(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    rating: Optional[int] = None,
    program_name: Optional[str] = None,
    keyword: Optional[str] = None,
) -> tuple[list[Feedback], int]:
    query = db.query(Feedback)

    if rating is not None:
        query = query.filter(Feedback.rating == rating)

    if program_name:
        query = query.filter(Feedback.program_name.ilike(f"%{program_name}%"))

    if keyword:
        query = query.filter(
            or_(
                Feedback.participant_name.ilike(f"%{keyword}%"),
                Feedback.program_name.ilike(f"%{keyword}%"),
                Feedback.comments.ilike(f"%{keyword}%"),
            )
        )

    total = query.count()
    items = query.order_by(Feedback.submitted_at.desc()).offset(skip).limit(limit).all()
    return items, total


def update_feedback(db: Session, feedback_id: int, payload: FeedbackUpdate) -> Optional[Feedback]:
    item = get_feedback_by_id(db, feedback_id)
    if not item:
        return None
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_feedback(db: Session, feedback_id: int) -> bool:
    item = get_feedback_by_id(db, feedback_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True


def get_stats(db: Session) -> dict:
    total = db.query(func.count(Feedback.feedback_id)).scalar() or 0
    avg = db.query(func.avg(Feedback.rating)).scalar()
    average_rating = round(float(avg), 2) if avg else 0.0

    dist_rows = (
        db.query(Feedback.rating, func.count(Feedback.feedback_id))
        .group_by(Feedback.rating)
        .all()
    )
    rating_labels = {1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent"}
    distribution = {rating_labels[r]: c for r, c in dist_rows}

    return {
        "total_feedback": total,
        "average_rating": average_rating,
        "rating_distribution": distribution,
    }


def get_analytics(db: Session) -> dict:
    today = datetime.now().date()
    thirty_days_ago = today - timedelta(days=29)

    date_rows = (
        db.query(
            cast(Feedback.submitted_at, Date).label("date"),
            func.count(Feedback.feedback_id).label("count"),
        )
        .filter(Feedback.submitted_at >= thirty_days_ago)
        .group_by(cast(Feedback.submitted_at, Date))
        .order_by(cast(Feedback.submitted_at, Date))
        .all()
    )

    date_map = {str(row.date): row.count for row in date_rows}
    feedback_by_date = []
    for i in range(30):
        d = str(thirty_days_ago + timedelta(days=i))
        feedback_by_date.append({"date": d, "count": date_map.get(d, 0)})

    top_programs = (
        db.query(
            Feedback.program_name,
            func.count(Feedback.feedback_id).label("count"),
            func.avg(Feedback.rating).label("avg_rating"),
        )
        .group_by(Feedback.program_name)
        .order_by(func.count(Feedback.feedback_id).desc())
        .limit(6)
        .all()
    )

    return {
        "feedback_by_date": feedback_by_date,
        "top_programs": [
            {
                "program_name": row.program_name[:22] + "…" if len(row.program_name) > 22 else row.program_name,
                "count": row.count,
                "avg_rating": round(float(row.avg_rating), 1),
            }
            for row in top_programs
        ],
    }


def search_feedback(
    db: Session,
    keyword: Optional[str] = None,
    rating: Optional[int] = None,
    program_name: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Feedback], int]:
    return get_all_feedback(
        db,
        skip=skip,
        limit=limit,
        rating=rating,
        program_name=program_name,
        keyword=keyword,
    )
