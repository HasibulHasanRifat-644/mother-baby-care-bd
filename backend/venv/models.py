import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Parent(Base):
    __tablename__ = "parents"
    nid_number = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, nullable=False)
    babies = relationship("Baby", back_populates="parent")

class Baby(Base):
    __tablename__ = "babies"
    
    # The default=lambda: str(uuid.uuid4()) automatically creates a unique ID!
    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    
    parent_nid = Column(String, ForeignKey("parents.nid_number"), nullable=False)
    name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    birth_registration_number = Column(String, unique=True, nullable=True)
    epi_center_name = Column(String, nullable=True)
    district = Column(String, nullable=True)
    
    parent = relationship("Parent", back_populates="babies")