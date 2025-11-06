"use client";

interface Booking {
  guest: string;
  listing: string;
  dates: string;
  status: 'Pending' | 'Confirmed' | 'Declined';
}

const bookings: Booking[] = [
  {
    guest: 'John Doe',
    listing: 'Modern Downtown Loft',
    dates: 'Oct 15-20, 2024',
    status: 'Pending',
  },
  {
    guest: 'Jane Smith',
    listing: 'Cozy Beachside Cottage',
    dates: 'Nov 5-10, 2024',
    status: 'Confirmed',
  },
  {
    guest: 'Robert Brown',
    listing: 'Rustic Mountain Cabin',
    dates: 'Dec 1-8, 2024',
    status: 'Declined',
  },
];

const BookingRow = ({ booking }: { booking: Booking }) => (
  <div className="grid grid-cols-5 items-center p-4 border-b border-gray-800 bg-gray-900">
    <div className="font-bold">{booking.guest}</div>
    <div>{booking.listing}</div>
    <div>{booking.dates}</div>
    <div className="text-center">
      <span className={`px-3 py-1 text-sm font-semibold ${
        booking.status === 'Confirmed' ? 'bg-green-800 text-green-200' :
        booking.status === 'Pending' ? 'bg-yellow-800 text-yellow-200' :
        'bg-red-800 text-red-200'
      }`}>
        {booking.status}
      </span>
    </div>
    <div className="text-center space-x-2">
      {booking.status === 'Pending' && (
        <>
          <button className="font-bold text-green-400 hover:underline">Approve</button>
          <button className="font-bold text-red-400 hover:underline">Decline</button>
        </>
      )}
      {booking.status !== 'Pending' && (
        <button className="font-bold text-white hover:underline">Details</button>
      )}
    </div>
  </div>
);

const ManageBookings = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

        <div className="border border-gray-700">
          <div className="grid grid-cols-5 p-4 bg-gray-800 font-bold border-b border-gray-700">
            <div>Guest</div>
            <div>Listing</div>
            <div>Dates</div>
            <div className="text-center">Status</div>
            <div className="text-center">Actions</div>
          </div>
          <div>
            {bookings.map((booking, index) => (
              <BookingRow key={index} booking={booking} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
