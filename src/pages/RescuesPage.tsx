import { useEffect, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

interface Nonprofit {
  id: string;
  organization_name: string;
  slug: string;
  location_city: string | null;
  location_state: string | null;
  mission_statement: string | null;
  logo_url: string | null;
}

export default function RescuesPage() {
  const [nonprofits, setNonprofits] = useState<Nonprofit[]>([]);
  const [filteredNonprofits, setFilteredNonprofits] = useState<Nonprofit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNonprofits();
  }, []);

  useEffect(() => {
    filterNonprofits();
  }, [searchQuery, stateFilter, nonprofits]);

  const loadNonprofits = async () => {
    const { data } = await supabase
      .from('nonprofits')
      .select('*')
      .in('status', ['active', 'approved'])
      .order('organization_name');

    if (data) {
      setNonprofits(data);
      setFilteredNonprofits(data);
    }
    setLoading(false);
  };

  const filterNonprofits = () => {
    let filtered = nonprofits;

    if (searchQuery) {
      filtered = filtered.filter((np) =>
        np.organization_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (stateFilter) {
      filtered = filtered.filter((np) => np.location_state === stateFilter);
    }

    setFilteredNonprofits(filtered);
  };

  const states = Array.from(new Set(nonprofits.map((np) => np.location_state).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Partner Rescues & Shelters</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Every purchase you make supports these amazing organizations working to help animals in need
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by organization name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state || ''}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredNonprofits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No rescues found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNonprofits.map((nonprofit) => (
            <div
              key={nonprofit.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {nonprofit.logo_url ? (
                <img
                  src={nonprofit.logo_url}
                  alt={nonprofit.organization_name}
                  className="w-full h-32 object-contain mb-4"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center mb-4">
                  <span className="text-3xl text-gray-400">
                    {nonprofit.organization_name[0]}
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{nonprofit.organization_name}</h3>

              {(nonprofit.location_city || nonprofit.location_state) && (
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {nonprofit.location_city && `${nonprofit.location_city}, `}
                    {nonprofit.location_state}
                  </span>
                </div>
              )}

              {nonprofit.mission_statement && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {nonprofit.mission_statement}
                </p>
              )}

              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = `/rescues/${nonprofit.slug}`}
              >
                View Profile
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join hundreds of animal rescues and nonprofits earning sustainable income with Mumbies
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.location.href = '/partners'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg bg-white text-green-600 hover:bg-green-50 shadow-lg transition-colors"
          >
            Learn More
          </button>
          <button
            onClick={() => window.location.href = '/partner/login'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-green-600 transition-colors"
          >
            Existing Partner? Login
          </button>
        </div>
        <p className="mt-6 text-sm">
          Questions? Email us at partners@mumbies.com
        </p>
      </div>
    </div>
  );
}
