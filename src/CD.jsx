import { useState } from 'react';
import { Search } from 'lucide-react';

const formatDateTime = (date) => {
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const CD = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const dummyData = [
    {
      dateTime: formatDateTime(new Date()),
      serialnumber: 1,
      name: 'Ramesh Kumar',
      couriername: 'BlueDart',
      courierid: 'BDX123456',
      phone: '9876543210',
      persontodeliver: 'Mr. Sharma',
    },
    {
      dateTime: formatDateTime(new Date()),
      serialnumber: 2,
      name: 'Sita Devi',
      couriername: 'DTDC',
      courierid: 'DTC789012',
      phone: '9123456780',
      persontodeliver: 'Ms. Anjali',
    },
  ];

  const filteredData = dummyData.filter((item) => {
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
                'Date & Time',
                'Sl. No.',
                'Visitor Name',
                'Courier Name',
                'Courier ID',
                'Phone',
                'Person to Deliver',
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
                <td className="px-6 py-4 whitespace-nowrap">{item.dateTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.serialnumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.couriername}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.courierid}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.persontodeliver}</td>
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
