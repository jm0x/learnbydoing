from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.problem import Problem, ProblemCreate
from app.services.problem_service import get_problems, get_problem, create_problem

router = APIRouter(prefix="/problems", tags=["problems"])

@router.get("/", response_model=List[Problem])
def read_problems(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    problems = get_problems(db, skip=skip, limit=limit)
    return problems

@router.get("/{problem_id}", response_model=Problem)
def read_problem(problem_id: int, db: Session = Depends(get_db)):
    db_problem = get_problem(db, problem_id=problem_id)
    if db_problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    return db_problem

@router.post("/", response_model=Problem, status_code=status.HTTP_201_CREATED)
def create_new_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    return create_problem(db=db, problem=problem)
