import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../features/userSlice';
import { RootState, AppDispatch } from '../store';

export const useUsers = () => {
  const dispatch: AppDispatch = useDispatch(); 
  const users = useSelector((state: RootState) => state?.users?.users);
  const status = useSelector((state: RootState) => state?.users?.status);
  console.log('users :>> ', users);
  console.log('status :>> ', status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  return { users, status };
};
