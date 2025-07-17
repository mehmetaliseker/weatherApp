import React from 'react';

const SearchBar = ({ city, setCity, setQueryCity, cityTimeZones }) => (
  <div className="mb-8">
    <div className="flex gap-3 mb-4">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && setQueryCity(city)}
        placeholder="Şehir adı girin..."
        className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition"
      />
      <button
        onClick={() => setQueryCity(city)}
        className="px-5 py-3 text-white bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition"
      >
        <i className="fas fa-search mr-1"></i> Ara
      </button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.keys(cityTimeZones).map((c) => (
        <button
          key={c}
          onClick={() => {
            setCity(c);
            setQueryCity(c);
          }}
          className="py-2 border-2 border-gray-300 rounded-md text-sm font-medium bg-gray-100 hover:bg-teal-500 hover:text-white hover:border-teal-500 transition"
        >
          {c}
        </button>
      ))}
    </div>
  </div>
);

export default SearchBar;