import axios from 'axios';

async function fetchUserPreferences(userEmail) {
  const res = await axios.get('/api/preferences', { params: { userEmail } });
  return res.data.preferences;
}