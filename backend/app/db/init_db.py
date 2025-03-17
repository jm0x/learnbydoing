from app.db.session import engine
from app.db.models import Base

def init_db():
    """Initialize the database with all required tables."""
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
