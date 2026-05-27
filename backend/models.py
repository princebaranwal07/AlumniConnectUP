from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    verified: bool
    token: str

class StudentProfileCreate(BaseModel):
    name: str
    education: str
    skills: List[str]
    career_goals: str
    interests: List[str]

class StudentProfileResponse(StudentProfileCreate):
    id: str
    user_id: str
    created_at: str

class AlumniProfileCreate(BaseModel):
    name: str
    graduation_year: int
    company: str
    designation: str
    skills: List[str]
    years_of_experience: int
    mentorship_available: bool = True
    bio: Optional[str] = ""
    linkedin_url: Optional[str] = ""

class AlumniProfileResponse(AlumniProfileCreate):
    id: str
    user_id: str
    created_at: str

class MentorshipRequestCreate(BaseModel):
    alumni_id: str
    message: str

class MentorshipRequestResponse(BaseModel):
    id: str
    student_id: str
    alumni_id: str
    message: str
    status: str
    created_at: str

class PostCreate(BaseModel):
    title: str
    content: str
    type: str
    tags: Optional[List[str]] = []

class PostResponse(PostCreate):
    id: str
    alumni_id: str
    created_at: str
    author_name: Optional[str] = ""
    author_company: Optional[str] = ""

class ChatMessageCreate(BaseModel):
    receiver_id: str
    message: str

class ChatMessageResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    message: str
    timestamp: str

class AdminUserUpdate(BaseModel):
    verified: Optional[bool] = None
    role: Optional[str] = None