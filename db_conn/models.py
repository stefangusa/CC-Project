from database import Base
from sqlalchemy import Column, Integer, String


class Location(Base):
    __tablename__ = 'locations'
    ip = Column(String(256), primary_key=True)
    location = Column(String(256), primary_key=True)
