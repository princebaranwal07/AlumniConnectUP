import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  createStudentProfile: (data) => axios.post(`${API_URL}/profiles/student`, data, { headers: getAuthHeaders() }),
  getStudentProfile: (userId) => axios.get(`${API_URL}/profiles/student/${userId}`),
  updateStudentProfile: (data) => axios.put(`${API_URL}/profiles/student`, data, { headers: getAuthHeaders() }),
  
  createAlumniProfile: (data) => axios.post(`${API_URL}/profiles/alumni`, data, { headers: getAuthHeaders() }),
  getAlumniProfile: (userId) => axios.get(`${API_URL}/profiles/alumni/${userId}`),
  updateAlumniProfile: (data) => axios.put(`${API_URL}/profiles/alumni`, data, { headers: getAuthHeaders() }),
  
  searchMentors: (params) => axios.get(`${API_URL}/mentorship/search`, { params, headers: getAuthHeaders() }),
  createMentorshipRequest: (data) => axios.post(`${API_URL}/mentorship/request`, data, { headers: getAuthHeaders() }),
  getIncomingRequests: () => axios.get(`${API_URL}/mentorship/requests/incoming`, { headers: getAuthHeaders() }),
  getOutgoingRequests: () => axios.get(`${API_URL}/mentorship/requests/outgoing`, { headers: getAuthHeaders() }),
  acceptRequest: (requestId) => axios.put(`${API_URL}/mentorship/request/${requestId}/accept`, {}, { headers: getAuthHeaders() }),
  rejectRequest: (requestId) => axios.put(`${API_URL}/mentorship/request/${requestId}/reject`, {}, { headers: getAuthHeaders() }),
  getMyMentors: () => axios.get(`${API_URL}/mentorship/my-mentors`, { headers: getAuthHeaders() }),
  getMyMentees: () => axios.get(`${API_URL}/mentorship/my-mentees`, { headers: getAuthHeaders() }),
  
  getRecommendations: () => axios.get(`${API_URL}/recommendations`, { headers: getAuthHeaders() }),
  
  createPost: (data) => axios.post(`${API_URL}/posts`, data, { headers: getAuthHeaders() }),
  getPosts: (type) => axios.get(`${API_URL}/posts`, { params: type ? { post_type: type } : {} }),
  
  getChatMessages: (otherUserId) => axios.get(`${API_URL}/chat/messages/${otherUserId}`, { headers: getAuthHeaders() }),
  sendChatMessage: (data) => axios.post(`${API_URL}/chat/messages`, data, { headers: getAuthHeaders() }),
  
  getAllUsers: () => axios.get(`${API_URL}/admin/users`, { headers: getAuthHeaders() }),
  updateUser: (userId, data) => axios.put(`${API_URL}/admin/users/${userId}`, data, { headers: getAuthHeaders() }),
  deletePost: (postId) => axios.delete(`${API_URL}/admin/posts/${postId}`, { headers: getAuthHeaders() }),
};

export default api;