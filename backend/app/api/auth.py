from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import verify_token
from app.core.config import settings
from app.services.auth_service import (
    create_user,
    authenticate_user,
    create_user_token,
    get_user_by_username
)
from app.schemas.user import User, UserCreate, Token

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    - **email**: Valid email address
    - **username**: Unique username
    - **password**: Strong password
    """
    return create_user(db=db, user=user)

@router.post("/token", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login.
    
    - **username**: Your username
    - **password**: Your password
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return create_user_token(user)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token, credentials_exception)
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
        
    user = get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user

@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user
