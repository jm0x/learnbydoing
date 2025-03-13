from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.models import Problem, Step, Hint
from app.schemas.problem import ProblemCreate

def get_problems(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Problem).offset(skip).limit(limit).all()

def get_problem(db: Session, problem_id: int):
    return db.query(Problem).filter(Problem.id == problem_id).first()

def create_problem(db: Session, problem: ProblemCreate):
    db_problem = Problem(
        title=problem.title,
        subject=problem.subject,
        difficulty=problem.difficulty,
        description=problem.description,
        solution=problem.solution
    )
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    
    # Add steps
    for step in problem.steps:
        db_step = Step(
            problem_id=db_problem.id,
            order=step.order,
            content=step.content
        )
        db.add(db_step)
    
    # Add hints
    for hint in problem.hints:
        db_hint = Hint(
            problem_id=db_problem.id,
            order=hint.order,
            content=hint.content
        )
        db.add(db_hint)
    
    # Add prerequisites
    if problem.prerequisite_ids:
        for prereq_id in problem.prerequisite_ids:
            prereq = get_problem(db, prereq_id)
            if prereq:
                db_problem.prerequisites.append(prereq)
    
    db.commit()
    db.refresh(db_problem)
    return db_problem
