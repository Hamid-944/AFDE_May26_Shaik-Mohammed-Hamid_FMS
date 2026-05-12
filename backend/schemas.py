from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional


class FeedbackBase(BaseModel):
    participant_name: str = Field(..., min_length=1, max_length=255, description="Name of the participant")
    program_name: str = Field(..., min_length=1, max_length=255, description="Training / event / product name")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 (Poor) to 5 (Excellent)")
    comments: Optional[str] = Field(None, description="Optional feedback comments")

    @field_validator("participant_name", "program_name")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackUpdate(BaseModel):
    participant_name: Optional[str] = Field(None, min_length=1, max_length=255)
    program_name: Optional[str] = Field(None, min_length=1, max_length=255)
    rating: Optional[int] = Field(None, ge=1, le=5)
    comments: Optional[str] = None

    @field_validator("participant_name", "program_name")
    @classmethod
    def strip_whitespace(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


class FeedbackResponse(FeedbackBase):
    feedback_id: int
    submitted_at: datetime

    model_config = {"from_attributes": True}


class FeedbackListResponse(BaseModel):
    total: int
    items: list[FeedbackResponse]


class StatsResponse(BaseModel):
    total_feedback: int
    average_rating: float
    rating_distribution: dict[str, int]


class DateCountItem(BaseModel):
    date: str
    count: int


class TopProgramItem(BaseModel):
    program_name: str
    count: int
    avg_rating: float


class AnalyticsResponse(BaseModel):
    feedback_by_date: list[DateCountItem]
    top_programs: list[TopProgramItem]
