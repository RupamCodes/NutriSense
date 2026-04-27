import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';
export default function LogMealPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mealType, setMealType] = useState('BREAKFAST');
  const [mealName, setMealName] = useState('');
  const searchMutation = useMutation({
    mutationFn: (query) => api.get(`/nutrition/search?query=${encodeURIComponent(query)}`).then(r => r.data),
    onSuccess: (data) => setSearchResults(data),
    onError: () => toast.error('Search failed'),
  });
  const logMutation = useMutation({
    mutationFn: (meal) => api.post('/meals', meal),
    onSuccess: () => {
      toast.success('Meal logged!');
      setSelectedItems([]);
      setMealName('');
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
    onError: () => toast.error('Failed to log meal'),
  });
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) searchMutation.mutate(searchQuery);
  };
  const addItem = (food) => {
    setSelectedItems(prev => [...prev, { ...food, servingQty: food.servingQty || 1, servingUnit: food.servingUnit || 'serving' }]);
  };
  const handleLog = () => {
    if (!selectedItems.length) return toast.error('Add at least one food item');
    logMutation.mutate({
      name: mealName || `${mealType.charAt(0) + mealType.slice(1).toLowerCase()} meal`,
      mealType,
      items: selectedItems.map(i => ({ foodName: i.foodName, brandName: i.brandName, servingQty: i.servingQty, servingUnit: i.servingUnit, calories: i.calories || 0, proteinG: i.proteinG || 0, carbsG: i.carbsG || 0, fatG: i.fatG || 0, thumbnailUrl: i.thumbnailUrl, nxItemId: i.nxItemId })),
    });
  };
  return (
    <>
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Log Meal</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Search for foods and log your meals.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            {}
            <div className="flex gap-2 mb-stack-md flex-wrap">
              {['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'].map(t => (
                <button key={t} onClick={() => setMealType(t)} className={`px-4 py-2 rounded-full font-label-lg text-label-lg transition-colors ${mealType === t ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {}
            <form onSubmit={handleSearch} className="mb-stack-md">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Search foods... e.g. 'chicken breast'" type="text" />
              </div>
            </form>
            {}
            {searchResults && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.common?.map((food, i) => (
                  <div key={`c-${i}`} className="border border-outline-variant rounded-lg p-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      {food.thumbnailUrl && <img src={food.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <p className="font-label-lg text-label-lg text-on-surface capitalize">{food.foodName}</p>
                        <p className="font-label-md text-label-md text-on-surface-variant">{food.servingQty} {food.servingUnit}</p>
                      </div>
                    </div>
                    <button onClick={() => addItem(food)} className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                ))}
                {searchResults.branded?.map((food, i) => (
                  <div key={`b-${i}`} className="border border-outline-variant rounded-lg p-3 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-3">
                      {food.thumbnailUrl && <img src={food.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <div>
                        <p className="font-label-lg text-label-lg text-on-surface">{food.foodName}</p>
                        <p className="font-label-md text-label-md text-on-surface-variant">{food.brandName} • {Math.round(food.calories || 0)} kcal</p>
                      </div>
                    </div>
                    <button onClick={() => addItem(food)} className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card p-6">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Your Meal</h2>
            <input value={mealName} onChange={(e) => setMealName(e.target.value)} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary mb-stack-md" placeholder="Meal name (optional)" />
            {selectedItems.length === 0 ? (
              <p className="text-on-surface-variant text-center py-8 font-body-md text-body-md">Search and add foods to your meal</p>
            ) : (
              <div className="space-y-2 mb-stack-md">
                {selectedItems.map((item, i) => (
                  <div key={i} className="border border-outline-variant rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-label-lg text-label-lg text-on-surface capitalize">{item.foodName}</p>
                      <p className="font-label-md text-label-md text-on-surface-variant">{Math.round(item.calories || 0)} kcal</p>
                    </div>
                    <button onClick={() => setSelectedItems(prev => prev.filter((_, idx) => idx !== i))} className="text-error hover:bg-error-container rounded-full p-1 transition-colors">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {}
            {selectedItems.length > 0 && (
              <div className="border-t border-outline-variant pt-stack-md mb-stack-md">
                <div className="flex justify-between font-label-lg text-label-lg text-on-surface">
                  <span>Total Calories</span>
                  <span>{Math.round(selectedItems.reduce((a, i) => a + (i.calories || 0), 0))} kcal</span>
                </div>
              </div>
            )}
            <button onClick={handleLog} disabled={selectedItems.length === 0 || logMutation.isPending} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-lg text-label-lg text-on-primary bg-primary hover:bg-surface-tint transition-colors duration-200 disabled:opacity-50">
              {logMutation.isPending ? 'Logging...' : 'Log Meal'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
