from pydantic import BaseModel
from typing import List, Optional

class StepBase(BaseModel):
    order: int
    content: str

class StepCreate(StepBase):
    pass

class Step(StepBase):
    id: int
    problem_id: int

    class Config:
        orm_mode = True

class HintBase(BaseModel):
    order: int
    content: str

class HintCreate(HintBase):
    pass

class Hint(HintBase):
    id: int
    problem_id: int

    class Config:
        orm_mode = True

class ProblemBase(BaseModel):
    title: str
    subject: str
    difficulty: int
    description: str
    solution: str

class ProblemCreate(ProblemBase):
    steps: List[StepCreate]
    hints: List[HintCreate]
    prerequisite_ids: Optional[List[int]] = []

class Problem(ProblemBase):
    id: int
    steps: List[Step] = []
    hints: List[Hint] = []
    prerequisites: List["Problem"] = []

    class Config:
        orm_mode = True

# Avoid circular reference issues
Problem.update_forward_refs()
