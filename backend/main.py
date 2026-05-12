from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import engine, Base
from routers import feedback


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Feedback Management System",
    description="REST API for collecting, managing, and searching feedback records.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feedback.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Feedback Management System API is running"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
