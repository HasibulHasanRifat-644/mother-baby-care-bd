from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models import Base, Baby, Parent
from pydantic import BaseModel
from typing import Optional

# Replace 'YOUR_PASSWORD' with your actual PostgreSQL password
DATABASE_URL = "postgresql://postgres:7%401V0RY_cng@localhost/postgres"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Automatically creates the tables in PostgreSQL
Base.metadata.drop_all(bind=engine) 
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mother & Baby Care API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
class ParentCreate(BaseModel):
    nid_number: str
    full_name: str
    phone_number: str

class BabyCreate(BaseModel):
    parent_nid: str  
    name: str
    date_of_birth: str
    gender: str
    birth_registration_number: Optional[str] = None
    epi_center_name: Optional[str] = None
    district: Optional[str] = None

@app.post("/api/parents/")
def register_parent(parent: ParentCreate, db: Session = Depends(get_db)):
    db_parent = Parent(**parent.dict())
    db.add(db_parent)
    db.commit()
    db.refresh(db_parent)
    return {"status": "success", "message": "Parent registered successfully!", "data": db_parent}

@app.post("/api/babies/")
def register_baby(baby: BabyCreate, db: Session = Depends(get_db)):
    db_baby = Baby(**baby.dict())
    db.add(db_baby)
    db.commit()
    db.refresh(db_baby)
    return {"status": "success", "message": "Baby registered successfully!", "data": db_baby}

@app.get("/api/babies/")
def get_all_babies(db: Session = Depends(get_db)):
    return db.query(Baby).all()