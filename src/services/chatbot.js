import api from './api';

export async function sendQuery(message) {
  const { data } = await api.post('/chatbot/query', { message });
  return data;
}

export async function getHistory() {
  const { data } = await api.get('/chatbot/history');
  return data.messages || [];
}

export async function clearHistory() {
  const { data } = await api.delete('/chatbot/history');
  return data;
}
