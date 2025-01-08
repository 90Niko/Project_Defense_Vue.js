import axiosFS from '../config/axiosFS';

const ENDPOINT = 'users';
export async function fetchUsers() {
  try {
    const response = await axiosFS.get(`${ENDPOINT}`);
    return response.data;
  }
  catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
