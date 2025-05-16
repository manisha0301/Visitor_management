import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { formatReadableDate } from './utils/formatDate';

  const VD = () => {
    const [visitors, setVisitors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [enlargedImage, setEnlargedImage] = useState(null);
  
    useEffect(() => {
      fetch('http://localhost:5000/api/visitors/all')
        .then(res => res.json())
        .then(data => setVisitors(data))
        .catch(err => console.error('Error fetching visitors:', err));
    }, []);
  
    const filteredData = visitors.filter((visitor) =>
      [visitor.name, visitor.phone, visitor.email].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Visitor Details</h2>
  
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, email id or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'Sl. No.',
                  'Name',
                  'Address',
                  'Designation',
                  'Phone',
                  'Email',
                  'Person to Meet',
                  'Purpose',
                  'Date & Time',
                  'pincode',
                  'device',
                  'Photo',
                ].map((heading) => (
                  <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((visitor, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.persontomeet}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.purpose}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatReadableDate(visitor.datetime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.pincode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{visitor.device}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {visitor.photo ? (
                      <img
                        src={`http://localhost:5000${visitor.photo}`}
                        alt="Visitor"
                        className="h-10 w-10 rounded-full object-cover cursor-pointer"
                        onClick={() => setEnlargedImage(`http://localhost:5000${visitor.photo}`)}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm italic">No Photo</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500 italic">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {enlargedImage && (
  <div
    className="fixed inset-0 bg-black/80 bg-opacity-75 flex items-center justify-center z-50"
  >
    <div
      className="relative bg-white p-4 rounded-lg w-[50%] h-[70vh] max-w-6xl overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute -top-2 right-0 text-red-500 text-4xl font-bold focus:outline-none hover:text-red-500 cursor-pointer"
        onClick={() => setEnlargedImage(null)}
      >
        &times;
      </button>
      <img
        src={enlargedImage}
        alt="Enlarged"
        className="w-full h-full rounded pt-4"
      />
    </div>
  </div>
)}


      </div>
    );
  };
  
  export default VD;
 