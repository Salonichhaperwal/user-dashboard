import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser, reorderUsers } from '../features/userSlice';
import { Pencil, Save, Trash2 } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Props, User } from '../Models/UserTable.model';

const DraggableRow: React.FC<{
  user: User;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}> = ({ user, index, moveRow, children }) => {
  const ref = useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'ROW',
    item: { index, id: user.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ROW',
    hover: (draggedItem: { index: number; id: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;


      if (dragIndex === hoverIndex) {
        return;
      }

      moveRow(dragIndex, hoverIndex);

      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <tr
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`
        ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} 
        hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 
        border-b border-gray-200 dark:border-gray-700 cursor-move
      `}
    >
      {children}
    </tr>
  );
};

const UserTable: React.FC<Props> = ({ users, deleteUser }) => {
  const dispatch = useDispatch();
  const [editableRow, setEditableRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleEdit = (id: number, name: string, email: string) => {
    setEditableRow(id);
    setEditedData({ name, email }); 
  };

  const handleSave = (id: number) => {
    if (!editedData.name || !editedData.email) {
      alert('Name and email are required!');
      return;
    }
    dispatch(updateUser({ id, ...editedData })); 
    setEditableRow(null); 
  };

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    dispatch(reorderUsers({ from: dragIndex, to: hoverIndex }));
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getNestedValue = (user: User, key: string): string => {
    if (key === 'address') {
      return `${user.address?.street || ''}, ${user.address?.city || ''}, ${user.address?.zipcode || ''}`;
    }
    if (key === 'company') {
      return user.company?.name || '';
    }
    return user[key as keyof User] as string;
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig) return users;

    const sorted = [...users].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key).toLowerCase();
      const bValue = getNestedValue(b, sortConfig.key).toLowerCase();

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [users, sortConfig]);

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="bg-white shadow-2xl rounded-2xl overflow-x-scroll no-scrollbar">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <th
              onClick={() => handleSort('name')}
              className="px-6 py-4 text-left font-semibold tracking-wider cursor-pointer"
            >
              Name
              {sortConfig?.key === 'name' && (
                <span className="ml-2">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th
              onClick={() => handleSort('email')}
              className="px-6 py-4 text-left font-semibold tracking-wider cursor-pointer"
            >
              Email
              {sortConfig?.key === 'email' && (
                <span className="ml-2">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th
              onClick={() => handleSort('address')}
              className="px-6 py-4 text-left font-semibold tracking-wider cursor-pointer"
            >
              Address
              {sortConfig?.key === 'address' && (
                <span className="ml-2">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th
              onClick={() => handleSort('company')}
              className="px-6 py-4 text-left font-semibold tracking-wider cursor-pointer"
            >
              Company
              {sortConfig?.key === 'company' && (
                <span className="ml-2">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th className="px-6 py-4 text-left font-semibold tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length > 0 ? sortedUsers.map((user, index) => (
            <DraggableRow 
              key={user.id} 
              user={user} 
              index={index} 
              moveRow={moveRow}
            >
              <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                {editableRow === user.id ? (
                  <input
                    value={editedData.name}
                    onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                {editableRow === user.id ? (
                  <input
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                {user?.address
                  ? `${user.address.street || 'NA'}, ${user.address.city || 'NA'}, ${
                      user.address.zipcode || 'NA'
                    }`
                  : 'Not available'}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{user?.company?.name || 'Not Available'}</td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  {editableRow === user.id ? (
                    <button
                      onClick={() => handleSave(user.id)}
                      className="text-green-600 hover:bg-green-100 p-2 rounded-full transition-colors"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(user.id, user.name, user.email)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </DraggableRow>
          ))
          : 
          <tr>
            <td colSpan={5} className="px-6 py-4 text-center font-semibold text-black">
              NO DATA FOUND
            </td>
          </tr>
        }
        </tbody>
      </table>
    </div>
    </DndProvider>
  );
};

export default UserTable;