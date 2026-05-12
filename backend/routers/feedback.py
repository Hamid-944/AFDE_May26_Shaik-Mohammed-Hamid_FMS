from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.get("/analytics", response_model=schemas.AnalyticsResponse, summary="Get analytics data")
def get_analytics(db: Session = Depends(get_db)):
    return crud.get_analytics(db)


@router.get("/stats", response_model=schemas.StatsResponse, summary="Get aggregate statistics")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)


@router.get("", response_model=schemas.FeedbackListResponse, summary="List all feedback")
def list_feedback(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Max records to return"),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Filter by exact rating"),
    program_name: Optional[str] = Query(None, description="Filter by program name (partial match)"),
    keyword: Optional[str] = Query(None, description="Keyword search across name, program, comments"),
    db: Session = Depends(get_db),
):
    items, total = crud.get_all_feedback(
        db, skip=skip, limit=limit, rating=rating, program_name=program_name, keyword=keyword
    )
    return {"total": total, "items": items}


@router.get("/{feedback_id}", response_model=schemas.FeedbackResponse, summary="Get feedback by ID")
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    item = crud.get_feedback_by_id(db, feedback_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Feedback with id {feedback_id} not found")
    return item


@router.post("", response_model=schemas.FeedbackResponse, status_code=status.HTTP_201_CREATED, summary="Submit feedback")
def create_feedback(payload: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    return crud.create_feedback(db, payload)


@router.put("/{feedback_id}", response_model=schemas.FeedbackResponse, summary="Update feedback")
def update_feedback(feedback_id: int, payload: schemas.FeedbackUpdate, db: Session = Depends(get_db)):
    item = crud.update_feedback(db, feedback_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail=f"Feedback with id {feedback_id} not found")
    return item


@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete feedback")
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_feedback(db, feedback_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Feedback with id {feedback_id} not found")


@router.get("/search/query", response_model=schemas.FeedbackListResponse, summary="Search feedback")
def search_feedback(
    keyword: Optional[str] = Query(None),
    rating: Optional[int] = Query(None, ge=1, le=5),
    program_name: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    items, total = crud.search_feedback(
        db, keyword=keyword, rating=rating, program_name=program_name, skip=skip, limit=limit
    )
    return {"total": total, "items": items}
