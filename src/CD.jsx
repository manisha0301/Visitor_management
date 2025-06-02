import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { formatReadableDate } from './utils/formatDate';

  const CD = () => {
    const [couriers, setCouriers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
  
    useEffect(() => {
      fetch('http://localhost:5001/api/couriers/all')
        .then(res => res.json())
        .then(data => setCouriers(data))
        .catch(err => console.error('Error fetching couriers:', err));
    }, []);
  
    const filteredData = couriers.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.phone.includes(query) ||
        item.courierid.toLowerCase().includes(query)
      );
    });
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Courier Details</h2>
  
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, phone, or courier ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Sl. No.',
                  'Visitor Name',
                  'Courier Name',
                  'Courier ID',
                  'Phone',
                  'Person to Deliver',
                  'Date & Time',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.couriername}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.courierid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.persontodeliver}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatReadableDate(item.datetime)}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center px-6 py-4 text-gray-500">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default CD;
  
