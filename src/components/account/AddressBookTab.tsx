import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../Button';

interface Address {
  id: string;
  type: string;
  is_default: boolean;
  full_name: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone?: string;
}

export default function AddressBookTab() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user?.id)
      .order('is_default', { ascending: false });

    if (data) setAddresses(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Address Book</h2>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Saved Addresses</h3>
          <p className="text-gray-600 mb-6">Add an address for faster checkout</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-6 relative">
              {address.is_default && (
                <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  Default
                </span>
              )}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <h3 className="font-bold">{address.type}</h3>
                </div>
                <div className="text-gray-700 space-y-1">
                  <p>{address.full_name}</p>
                  <p>{address.street_address}</p>
                  {address.apartment && <p>{address.apartment}</p>}
                  <p>{address.city}, {address.state} {address.zip_code}</p>
                  {address.phone && <p>{address.phone}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
