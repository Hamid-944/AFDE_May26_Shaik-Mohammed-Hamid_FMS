from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    feedback_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    participant_name = Column(String(255), nullable=False)
    program_name = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)
    comments = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class EtlRun(Base):
    __tablename__ = "etl_runs"

    run_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="running")
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    loaded_records = Column(Integer, default=0)
    duplicate_records = Column(Integer, default=0)
    invalid_records = Column(Integer, default=0)
    cleaned_records = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime, nullable=True)
