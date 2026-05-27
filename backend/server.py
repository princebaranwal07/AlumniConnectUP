from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional
import json
from uuid import uuid4

from auth import create_access_token as _create_access_token, verify_token as _verify_token, get_password_hash, verify_password

create_access_token: Callable[[Dict[str, Any]], str] = _create_access_token
verify_token: Callable[[str], Optional[Dict[str, Any]]] = _verify_token
from models import (
    UserSignup, UserLogin, UserResponse,
    StudentProfileCreate, StudentProfileResponse,
    AlumniProfileCreate, AlumniProfileResponse,
    MentorshipRequestCreate, MentorshipRequestResponse,
    PostCreate, PostResponse,
    ChatMessageCreate, ChatMessageResponse,
    AdminUserUpdate
)
from recommendations import get_ai_recommendations

# ---------------- ENV ----------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
db_name = os.environ["DB_NAME"]

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# ---------------- APP ----------------
app = FastAPI(title="Alumni-Student Mentorship Platform")
api_router = APIRouter(prefix="/api")

# 🔥 FIX: do not auto-error on missing token
security = HTTPBearer(auto_error=False)

# ---------------- WS MANAGER ----------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id, None)

    async def send_message(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

manager = ConnectionManager()

# ---------------- AUTH DEP ----------------
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

# ---------------- ROOT ----------------
@api_router.get("/")
async def root():
    return {"message": "Alumni-Student Mentorship Platform API", "status": "active"}

# ---------------- AUTH ----------------
@api_router.post("/auth/signup", response_model=UserResponse)
async def signup(user_data: UserSignup):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(400, "Email already registered")

    user_id = str(uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password_hash": get_password_hash(user_data.password),
        "role": user_data.role,
        "verified": user_data.role != "alumni",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await db.users.insert_one(user_doc)

    token = create_access_token({
        "user_id": user_id,
        "role": user_data.role
    })

    return {
        "id": user_id,
        "email": user_data.email,
        "role": user_data.role,
        "verified": user_doc["verified"],
        "token": token,
        "access_token": token  # 🔥 frontend fix
    }

@api_router.post("/auth/login", response_model=UserResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({
        "user_id": user["id"],
        "role": user["role"]
    })

    return {
        "id": user["id"],
        "email": user["email"],
        "role": user["role"],
        "verified": user["verified"],
        "token": token,
        "access_token": token
    }

@api_router.get("/auth/me")
async def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "role": current_user["role"],
        "verified": current_user["verified"]
    }

# ---------------- STUDENT PROFILE ----------------
@api_router.post("/profiles/student", response_model=StudentProfileResponse)
async def create_student_profile(profile: StudentProfileCreate, current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(403)

    doc = {
        "id": str(uuid4()),
        "user_id": current_user["id"],
        **profile.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.student_profiles.insert_one(doc)
    return doc

@api_router.get("/profiles/student/{user_id}", response_model=StudentProfileResponse)
async def get_student_profile(user_id: str):
    profile = await db.student_profiles.find_one({"user_id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(404)
    return profile

@api_router.put("/profiles/student", response_model=StudentProfileResponse)
async def update_student_profile(profile: StudentProfileCreate, current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(403)

    await db.student_profiles.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile.model_dump()}
    )
    return await db.student_profiles.find_one(
        {"user_id": current_user["id"]}, {"_id": 0}
    )

# ---------------- ALUMNI PROFILE ----------------
@api_router.post("/profiles/alumni", response_model=AlumniProfileResponse)
async def create_alumni_profile(profile: AlumniProfileCreate, current_user=Depends(get_current_user)):
    if current_user["role"] != "alumni":
        raise HTTPException(403)

    doc = {
        "id": str(uuid4()),
        "user_id": current_user["id"],
        **profile.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.alumni_profiles.insert_one(doc)
    return doc

@api_router.get("/profiles/alumni/{user_id}", response_model=AlumniProfileResponse)
async def get_alumni_profile(user_id: str):
    profile = await db.alumni_profiles.find_one({"user_id": user_id}, {"_id": 0})
    if not profile:
        raise HTTPException(404)
    return profile

@api_router.put("/profiles/alumni", response_model=AlumniProfileResponse)
async def update_alumni_profile(profile: AlumniProfileCreate, current_user=Depends(get_current_user)):
    if current_user["role"] != "alumni":
        raise HTTPException(403)

    await db.alumni_profiles.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile.model_dump()}
    )
    return await db.alumni_profiles.find_one(
        {"user_id": current_user["id"]}, {"_id": 0}
    )

# ---------------- MENTORSHIP ----------------
@api_router.get("/mentorship/search")
async def search_mentors(skills: str = None, company: str = None, current_user=Depends(get_current_user)):
    query = {}
    if skills:
        query["skills"] = {"$in": skills.split(",")}
    if company:
        query["company"] = {"$regex": company, "$options": "i"}

    alumni_profiles = await db.alumni_profiles.find(query, {"_id": 0}).to_list(100)

    verified = []
    for profile in alumni_profiles:
        user = await db.users.find_one({"id": profile["user_id"], "verified": True})
        if user and profile.get("mentorship_available", True):
            verified.append(profile)

    return verified

@api_router.post("/mentorship/request", response_model=MentorshipRequestResponse)
async def create_request(data: MentorshipRequestCreate, current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(403)

    exists = await db.mentorship_requests.find_one({
        "student_id": current_user["id"],
        "alumni_id": data.alumni_id,
        "status": {"$in": ["pending", "accepted"]}
    })
    if exists:
        raise HTTPException(400, "Request already exists")

    doc = {
        "id": str(uuid4()),
        "student_id": current_user["id"],
        "alumni_id": data.alumni_id,
        "message": data.message,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.mentorship_requests.insert_one(doc)
    return doc

@api_router.get("/mentorship/my-mentors")
async def my_mentors(current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(403)

    reqs = await db.mentorship_requests.find(
        {"student_id": current_user["id"], "status": "accepted"}, {"_id": 0}
    ).to_list(100)

    mentors = []
    for r in reqs:
        p = await db.alumni_profiles.find_one({"user_id": r["alumni_id"]}, {"_id": 0})
        if p:
            mentors.append(p)
    return mentors

# ---------------- RECOMMENDATIONS ----------------
@api_router.get("/recommendations")
async def recommendations(current_user=Depends(get_current_user)):
    if current_user["role"] != "student":
        raise HTTPException(403)

    student = await db.student_profiles.find_one(
        {"user_id": current_user["id"]}, {"_id": 0}
    )
    if not student:
        raise HTTPException(404)

    alumni = await db.alumni_profiles.find({}, {"_id": 0}).to_list(100)
    verified = []

    for p in alumni:
        u = await db.users.find_one({"id": p["user_id"], "verified": True})
        if u and p.get("mentorship_available", True):
            verified.append(p)

    return await get_ai_recommendations(student, verified)

# ---------------- CHAT ----------------
@api_router.get("/chat/messages/{other_user_id}", response_model=List[ChatMessageResponse])
async def get_messages(other_user_id: str, current_user=Depends(get_current_user)):
    return await db.chat_messages.find({
        "$or": [
            {"sender_id": current_user["id"], "receiver_id": other_user_id},
            {"sender_id": other_user_id, "receiver_id": current_user["id"]}
        ]
    }, {"_id": 0}).sort("timestamp", 1).to_list(1000)

@api_router.post("/chat/messages", response_model=ChatMessageResponse)
async def send_message(data: ChatMessageCreate, current_user=Depends(get_current_user)):
    msg = {
        "id": str(uuid4()),
        "sender_id": current_user["id"],
        "receiver_id": data.receiver_id,
        "message": data.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(msg)
    await manager.send_message(data.receiver_id, msg)
    return msg

@api_router.websocket("/chat/ws/{user_id}")
async def chat_ws(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = json.loads(await websocket.receive_text())
            msg = {
                "id": str(uuid4()),
                "sender_id": user_id,
                "receiver_id": data["receiver_id"],
                "message": data["message"],
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            await db.chat_messages.insert_one(msg)
            await manager.send_message(data["receiver_id"], msg)
            await websocket.send_json(msg)
    except WebSocketDisconnect:
        manager.disconnect(user_id)

# ---------------- ADMIN ----------------
@api_router.get("/admin/users")
async def admin_users(current_user=Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(403)
    return await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)

# ---------------- MIDDLEWARE ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

# ---------------- SHUTDOWN ----------------
@app.on_event("shutdown")
async def shutdown():
    client.close()
