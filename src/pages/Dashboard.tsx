import React, { useState } from 'react';
import UserTable from '../components/UserTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import { useUsers } from '../hooks/useUsers';
import { useDispatch } from 'react-redux';
import { deleteUser, addUser } from '../features/userSlice';
import DarkModeToggle from '../components/DarkModeToggle';

const Dashboard: React.FC = () => {
  const { users, status } = useUsers();
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [company, setCompany] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false);

  const companyOptions = Array.from(new Set(users.map((user) => user?.company?.name)));

  const filteredUsers = users?.filter((user) => {
    return (
      (search === '' || user?.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())) &&
      (city === '' || user?.address?.city.toLowerCase().includes(city.toLowerCase())) &&
      (company === '' || user?.company?.name === company)
    );
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  const handleAddUser = (user: any) => {
    dispatch(addUser(user));
    setModalOpen(false);
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error fetching users.</div>;

  return (
    <div className="p-4">
      <div className="modeAndUser flex justify-center mb-5">
      <DarkModeToggle/>
      <button onClick={() => setModalOpen(true)} className="p-2 rounded-md border bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 transition bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        Add User
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddUser} />
      </div>
      <SearchBar
        search={search}
        setSearch={setSearch}
        city={city}
        setCity={setCity}
        company={company}
        setCompany={setCompany}
        companyOptions={companyOptions}
      />

      <UserTable users={paginatedUsers} deleteUser={handleDelete} />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />

      
    </div>
  );
};

export default Dashboard;
