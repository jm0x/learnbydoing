from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    username: str
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
