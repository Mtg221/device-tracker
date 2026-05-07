// All 14 regions of Senegal
export const SENEGAL_REGIONS = [
{ id: 'dakar', name: 'Dakar' },
{ id: 'thies', name: 'Thiès' },
{ id: 'saint-louis', name: 'Saint-Louis' },
{ id: 'diourbel', name: 'Diourbel' },
{ id: 'louga', name: 'Louga' },
{ id: 'tambacounda', name: 'Tambacounda' },
{ id: 'kaolack', name: 'Kaolack' },
{ id: 'mbacke', name: 'Mbacké' },
{ id: 'fatick', name: 'Fatick' },
{ id: 'matam', name: 'Matam' },
{ id: 'ziguinchor', name: 'Ziguinchor' },
{ id: 'kolda', name: 'Kolda' },
{ id: 'sedhiou', name: 'Sédhiou' },
{ id: 'kaffrine', name: 'Kaffrine' },
{ id: 'kédougou', name: 'Kédougou' },
];

export const getRegionById = (id) => {
  return SENEGAL_REGIONS.find(r => r.id === id);
};

export const getRegionCounts = async () => {
  // This will be populated by API call
  const response = await fetch('/api/regions/stats');
  return response.json();
};
