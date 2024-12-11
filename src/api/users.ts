import axios from 'axios';
import { User } from '../features/userSlice';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createUser = async (user: User) => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

export const deleteUserById = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
