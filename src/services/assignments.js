import api from './api';

export async function getAssignments() {
  const { data } = await api.get('/assignments');
  return data.assignments;
}

export async function createAssignment(formData) {
  const { data } = await api.post('/assignments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateAssignment(id, formData) {
  const { data } = await api.put(`/assignments/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteAssignment(id) {
  const { data } = await api.delete(`/assignments/${id}`);
  return data;
}

export async function submitAssignment(id, formData) {
  const { data } = await api.post(`/assignments/${id}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getSubmissions(assignmentId) {
  const { data } = await api.get(`/assignments/${assignmentId}/submissions`);
  return data.submissions;
}

export async function getMySubmissions() {
  const { data } = await api.get('/assignments/my-submissions');
  return data.submissions;
}

export async function gradeSubmission(submissionId, marks, feedback) {
  const { data } = await api.put(`/assignments/submissions/${submissionId}/grade`, { marks, feedback });
  return data;
}
