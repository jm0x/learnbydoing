from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(title="Learn By Doing API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Learn By Doing API"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "message": "Service is running"}

# Import and include routers
from app.api import auth, problems
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(problems.router, prefix=settings.API_V1_STR)
# Uncomment when implemented
# from app.api import progress, validation
# app.include_router(progress.router, prefix=settings.API_V1_STR)
# app.include_router(validation.router, prefix=settings.API_V1_STR)
