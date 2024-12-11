import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
   <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition">
      {/* <header className="p-4 shadow-md bg-white dark:bg-gray-800 flex justify-end">
        <DarkModeToggle />
      </header> */}
      <main className="p-4">
        <Dashboard />
      </main>
    </div>
    </Provider>
  );
};

export default App;
