import API from './axios';

export const aiApi = {
  scoreResume: (applicationId) => API.post(`/ai/score-resume?applicationId=${applicationId}`),
  bulkScore: (jobId) => API.post(`/ai/bulk-score?jobId=${jobId}`),
  extractSkills: (text) => API.post('/ai/skill-extract', { text }),
  generateInterviewQuestions: (jobId, applicationId) => {
    return API.post('/ai/interview-questions', { jobId, applicationId });
  },
  getInterviewQuestions: (jobId) => API.get(`/ai/interview-questions/${jobId}`),
};

export default aiApi;
