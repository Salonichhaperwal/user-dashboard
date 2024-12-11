import React from 'react';

interface Props {
  search: string;
  setSearch: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  companyOptions: string[];
}

const SearchBar: React.FC<Props> = ({ search, setSearch, city, setCity, company, setCompany, companyOptions }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="border rounded p-2 flex-1 text-black"
      />

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Filter by city..."
        className="border rounded p-2 flex-1 text-black"
      />

      <select
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border rounded p-2 flex-1 text-black"
      >
        <option value="">All Companies</option>
        {companyOptions.map((companyName) => (
          <option key={companyName} value={companyName}>
            {companyName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
