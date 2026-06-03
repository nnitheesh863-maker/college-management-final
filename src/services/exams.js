import api from './api';

export async function getExams() {
  const { data } = await api.get('/exams');
  return data.exams;
}

export async function getExam(id) {
  const { data } = await api.get(`/exams/${id}`);
  return data;
}

export async function createExam(examData) {
  const { data } = await api.post('/exams', examData);
  return data;
}

export async function updateExam(id, examData) {
  const { data } = await api.put(`/exams/${id}`, examData);
  return data;
}

export async function publishExam(id) {
  const { data } = await api.put(`/exams/${id}/publish`);
  return data;
}

export async function deleteExam(id) {
  const { data } = await api.delete(`/exams/${id}`);
  return data;
}

export async function startExam(id) {
  const { data } = await api.post(`/exams/${id}/start`);
  return data;
}

export async function saveExamProgress(id, answers) {
  const { data } = await api.put(`/exams/${id}/save`, { answers });
  return data;
}

export async function submitExam(id, answers) {
  const { data } = await api.post(`/exams/${id}/submit`, { answers });
  return data;
}

export async function getExamSubmissions(id) {
  const { data } = await api.get(`/exams/${id}/submissions`);
  return data.submissions;
}

export async function gradeDescriptive(submissionId, answers) {
  const { data } = await api.put(`/exams/submissions/${submissionId}/grade`, { answers });
  return data;
}

export async function getMyResults() {
  const { data } = await api.get('/exams/results/my');
  return data.submissions;
}

export async function getLeaderboard(examId) {
  const { data } = await api.get(`/exams/${examId}/leaderboard`);
  return data.leaderboard;
}

export async function getExamAnalytics() {
  const { data } = await api.get('/exams/analytics/overview');
  return data;
}
