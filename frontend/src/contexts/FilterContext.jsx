import React, { createContext, useContext, useState } from 'react';

// Criação do contexto
const FilterContext = createContext();

// Hook para facilitar o acesso ao contexto
export const useFilter = () => useContext(FilterContext);

// Provider que encapsula os componentes com o estado do filtro
export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    federalState: null,
    syndrome: null,
    year: null,
    evolution: null,
  });

  // Função para atualizar filtros específicos
  const updateFilter = (key, newValue) => {
    setFilters((prev) => ({ ...prev, [key]: newValue }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
