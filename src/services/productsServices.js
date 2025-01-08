import axiosFS from '../config/axiosFS';

const ENDPOINT = 'products';
export async function fetchProducts() {
  try {
    const response = await axiosFS.get(`${ENDPOINT}`);
    return response.data;
  }
  catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}
