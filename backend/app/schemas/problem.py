from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class StepBase(BaseModel):
    order: int
    content: str

class StepCreate(StepBase):
    pass

class Step(StepBase):
    id: int
    problem_id: int

    model_config = ConfigDict(from_attributes=True)

class HintBase(BaseModel):
    order: int
    content: str

class HintCreate(HintBase):
    pass

class Hint(HintBase):
    id: int
    problem_id: int

    model_config = ConfigDict(from_attributes=True)

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

    model_config = ConfigDict(from_attributes=True)

# Avoid circular reference issues
Problem.model_rebuild()
