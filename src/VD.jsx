import { useState } from 'react';
import { Search } from 'lucide-react';
import image1 from './assets/ayu.png'; // Adjust the path as necessary

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

const VD = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [enlargedImage, setEnlargedImage] = useState(null); // 🔸 New state for image overlay

  const dummyData = [
    {
      dateTime: formatDateTime(new Date()),
      slNumber: 1,
      name: 'Ayush Raj',
      address: 'Bhubaneswar, Odisha',
      designation: 'Developer',
      phone: '7462953549',
      email: 'ayushraj1408@gmail.com',
      personToMeet: 'John Doe',
      purpose: 'Project Discussion',
      photo: image1,
    },
    {
      dateTime: formatDateTime(new Date()),
      slNumber: 2,
      name: 'Manisha',
      address: 'Cuttack, Odisha',
      designation: 'Engineer',
      phone: '9437559580',
      email: 'manisha@kristellar.com',
      personToMeet: 'Jane Smith',
      purpose: 'Job Interview',
      photo: null,
    },
  ];

  const filteredData = dummyData.filter((visitor) =>
    [visitor.name, visitor.address, visitor.phone].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search by name, address, or phone..."
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
                'Date & Time',
                'Sl. No.',
                'Name',
                'Address',
                'Designation',
                'Phone',
                'Email',
                'Person to Meet',
                'Purpose',
                'Photo',
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
            {filteredData.map((visitor, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.dateTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.slNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.designation}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.personToMeet}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.purpose}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {visitor.photo ? (
                    <img
                      src={visitor.photo}
                      alt="Visitor"
                      className="h-10 w-10 rounded-full object-cover cursor-pointer"
                      onClick={() => setEnlargedImage(visitor.photo)} // 🔸 Set image
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

      {/* 🔸 Enlarged Image Overlay */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setEnlargedImage(null)}
        >
          <img
            src={enlargedImage}
            alt="Enlarged"
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />
        </div>
      )}
    </div>
  );
};

export default VD;
