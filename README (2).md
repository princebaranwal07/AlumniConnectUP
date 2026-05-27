# Here are your Instructions
/api/mentorship/my-mentees -> 404
/api/mentorship/requests/incoming -> 404
/api/posts -> 404

POST /api/auth/signup -> 200 OK
POST /api/auth/login -> 200 OK
GET /api/auth/me -> 200 OK
GET /api/profiles/alumni/... -> 200 OK
That means:
frontend is calling these APIs
backend does NOT have these routes implemented yet


So:
authentication works
profile fetch works
backend server works
frontend-backend connection works