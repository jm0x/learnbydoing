from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, Float, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Association table for problem prerequisites
problem_prerequisites = Table(
    "problem_prerequisites",
    Base.metadata,
    Column("problem_id", Integer, ForeignKey("problems.id"), primary_key=True),
    Column("prerequisite_id", Integer, ForeignKey("problems.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    progress = relationship("UserProgress", back_populates="user")

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    subject = Column(String, index=True)
    difficulty = Column(Integer)
    description = Column(Text)
    solution = Column(Text)
    
    # Relationships
    steps = relationship("Step", back_populates="problem")
    hints = relationship("Hint", back_populates="problem")
    prerequisites = relationship(
        "Problem",
        secondary=problem_prerequisites,
        primaryjoin=id==problem_prerequisites.c.problem_id,
        secondaryjoin=id==problem_prerequisites.c.prerequisite_id,
    )
    user_progress = relationship("UserProgress", back_populates="problem")

class Step(Base):
    __tablename__ = "steps"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    order = Column(Integer)
    content = Column(Text)
    
    # Relationships
    problem = relationship("Problem", back_populates="steps")

class Hint(Base):
    __tablename__ = "hints"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    order = Column(Integer)
    content = Column(Text)
    
    # Relationships
    problem = relationship("Problem", back_populates="hints")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))
    completed = Column(Boolean, default=False)
    current_step = Column(Integer, default=0)
    hints_used = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="progress")
    problem = relationship("Problem", back_populates="user_progress")
