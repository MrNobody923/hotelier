import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SuperAdminOverview({ user, rooms = [], bookings = [], updateRoomStatus }) {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === "Available").length;
  const occupiedRooms = rooms.filter((room) => room.status === "Occupied").length;
  const totalBookings = bookings.length;

  const totalBookedNights = bookings.reduce((total, b) => {
    if (b.check_in && b.check_out) {
      const d = Math.ceil(Math.abs(new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));
      return total + (d > 0 ? d : 1);
    }
    return total;
  }, 0);
  const dynamicRevenue = (22500 + (totalBookedNights * 185)).toLocaleString("en-US");

  const checkingInCount = bookings.filter(b => b.room_status === "Occupied").length;
  const checkingOutCount = rooms.filter(r => r.status === "Cleaning").length;

  return (
    <div className="bg-[#f2f4f7] rounded-3xl p-6 shadow-sm min-h-screen">
      {/* Top Bar Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">H</div>
          <div className="flex items-center space-x-2">
            <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=1e293b&color=fff`} className="w-8 h-8 rounded-full shadow-sm" alt="Avatar"/>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-none">{user.full_name}</h3>
              <p className="text-[10px] text-slate-500 font-medium">Admin</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input type="text" placeholder="Search room, guest, book, etc" className="pl-10 pr-4 py-2 bg-white rounded-full w-80 shadow-sm border-0 text-sm focus-visible:ring-indigo-500" />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-2.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Main Content */}
        <div className="col-span-12 xl:col-span-8 flex flex-col space-y-6">
          <div className="flex justify-between items-end mb-2">
            <div><h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back,<br/>{user.full_name?.split(' ')[0]} 👋</h2></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden h-[180px]">
              <div className="flex items-center text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Total Revenue</div>
              <div className="text-3xl font-extrabold text-[#222222]">${dynamicRevenue}<span className="text-sm font-semibold text-slate-400">.00</span></div>
              <div className="flex items-center text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full mt-2 w-max shadow-sm border border-green-100">+7.02%</div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm col-span-2 relative h-[180px]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide">Reservations</div>
                <div className="text-[10px] bg-white border border-slate-200 shadow-sm rounded-lg px-2 py-1 flex items-center shadow-indigo-100 font-bold text-slate-600 cursor-pointer">Last 7 Days</div>
              </div>
              <div className="flex h-20 items-end justify-between px-2 gap-2 mt-2">
                {['12 Jun', '13 Jun', '14 Jun', '15 Jun', '16 Jun', '17 Jun', '18 Jun'].map((item, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 h-full z-0 group">
                    <div className="w-full max-w-[12px] md:max-w-[16px] flex flex-col-reverse h-full bg-slate-50 rounded-full relative">
                       <div className="absolute bottom-0 w-full rounded-b-full bg-orange-400" style={{height: `${Math.random() * 40 + 20}%`}}></div>
                       <div className="absolute top-[30%] w-full rounded-full bg-cyan-400 z-10" style={{height: `${Math.random() * 30 + 10}%`}}></div>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-2 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm"><div className="flex items-center text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">New Bookings</div><div className="text-4xl font-extrabold text-[#222222]">{totalBookings}</div></div>
            <div className="bg-white rounded-3xl p-6 shadow-sm"><div className="flex items-center text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide text-green-400">Check in</div><div className="text-4xl font-extrabold text-[#222222]">{checkingInCount}</div></div>
            <div className="bg-white rounded-3xl p-6 shadow-sm"><div className="flex items-center text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide text-orange-400">Check out</div><div className="text-4xl font-extrabold text-[#222222]">{checkingOutCount}</div></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide">Room Availability</div>
              </div>
              <div className="mb-6 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-[#222222]">{availableRooms}</span>
                <span className="text-sm font-semibold text-slate-400">Rooms Available</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden mb-4 shadow-inner bg-slate-100">
                 <div className="bg-indigo-500 shadow-sm" style={{width: `${(availableRooms / (totalRooms || 1)) * 100}%`}}></div>
                 <div className="bg-orange-400 shadow-sm" style={{width: `${(occupiedRooms / (totalRooms || 1)) * 100}%`}}></div>
                 <div className="bg-slate-300" style={{flex: 1}}></div>
              </div>
              <div className="flex items-center space-x-6">
                 <div className="flex items-center text-xs font-bold text-slate-500"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm mr-2 shadow-indigo-200"></div> {availableRooms} Available</div>
                 <div className="flex items-center text-xs font-bold text-slate-500"><div className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm mr-2 shadow-orange-200"></div> {occupiedRooms} Reserved</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide">Task</div>
                 <div className="text-[10px] bg-slate-50 border border-slate-200 shadow-sm rounded-lg px-2 py-1 flex items-center font-bold text-slate-600"><span className="text-red-500 mr-1">&#x1F4C5;</span> Today</div>
              </div>
              <div className="flex-1 space-y-4">
                {[
                  { text: "Confirm new booking request #2104" },
                  { text: "Update room availability status" },
                  { text: "Reply to customer inquiry via email" }
                ].map((t, i) => (
                  <div key={i} className="flex items-start">
                    <input type="checkbox" className="mt-0.5 mr-3 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"/>
                    <p className="text-sm font-semibold text-slate-600 leading-tight">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide">Booking List</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-100">
                      <th className="pb-3 px-2 font-bold">Booking ID</th>
                      <th className="pb-3 px-2 font-bold">Guest Name</th>
                      <th className="pb-3 px-2 font-bold">Room Type</th>
                      <th className="pb-3 px-2 font-bold text-center">Room No.</th>
                      <th className="pb-3 px-2 font-bold">Duration</th>
                      <th className="pb-3 px-2 font-bold">Status</th>
                      <th className="pb-3 px-2 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      let durationStr = "N/A";
                      if (booking.check_in && booking.check_out) {
                        const d = Math.ceil(Math.abs(new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24));
                        durationStr = d > 0 ? `${d} Nights` : "Same day";
                      }
                      const displayStatus = booking.room_status || booking.booking_status || "Pending";
                      return (
                        <tr key={booking.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition font-semibold text-slate-700">
                          <td className="py-3 px-2 text-indigo-700 tracking-tight">BK-{10000 + Number(booking.id)}</td>
                          <td className="py-3 px-2 max-w-[120px] truncate" title={booking.guest_name}>{booking.guest_name || "Guest"}</td>
                          <td className="py-3 px-2"><span className="text-[10px] bg-[#eef0ff] text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">{booking.room_type || "Standard"}</span></td>
                          <td className="py-3 px-2 text-center text-slate-500 font-bold">{booking.room_number || "TBD"}</td>
                          <td className="py-3 px-2 text-slate-500 font-medium">{durationStr}</td>
                          <td className="py-3 px-2">
                            <span className={`text-[10px] px-2 py-1 rounded shadow-sm border ${displayStatus === 'Available' ? 'bg-[#ebf8f2] text-[#2ba06d] border-[#2ba06d]/20' : displayStatus === 'Occupied' ? 'bg-[#fef1f2] text-[#e03131] border-[#e03131]/20' : 'bg-[#fff4e6] text-[#e8590c] border-[#e8590c]/20'}`}>
                              {displayStatus}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {displayStatus === "Occupied" && (
                              <button 
                                onClick={() => updateRoomStatus(booking.room_id, "Available")}
                                className="text-[10px] bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700 transition shadow-sm font-bold uppercase tracking-tighter"
                              >
                                Check out
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-6 text-center text-slate-400 font-medium bg-slate-50/30 rounded-xl">No active bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="col-span-12 xl:col-span-4 flex flex-col space-y-6">
           <div className="bg-[#4842cd] rounded-3xl p-6 shadow-xl shadow-indigo-600/20 text-white flex flex-col relative overflow-hidden flex-1 h-[450px]">
             <div className="flex justify-between items-center mb-6 relative z-10">
               <div className="flex items-center text-xs font-bold text-indigo-100 uppercase tracking-wide">Booking by platform</div>
             </div>
             <div className="flex flex-wrap gap-x-4 gap-y-2 mb-10 text-[11px] font-bold text-indigo-100 relative z-10">
               <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#1de9b6] mr-1.5 shadow-[0_0_8px_rgba(29,233,182,0.8)]"></span> 61% Direct</div>
               <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#ffea00] mr-1.5 shadow-[0_0_8px_rgba(255,234,0,0.8)]"></span> 12% Booking.com</div>
               <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#ff5252] mr-1.5 shadow-[0_0_8px_rgba(255,82,82,0.8)]"></span> 11% Agoda</div>
             </div>
             <div className="flex-1 flex items-center justify-center relative z-10 pb-4">
                <div className="w-48 h-48 rounded-full border-[16px] border-[#1de9b6] flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(29,233,182,0.4)]">
                    <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-[#ffea00] border-l-[#ff5252] rotate-45 pointer-events-none"></div>
                    <div className="text-3xl font-extrabold text-white leading-none mb-1">+14%</div>
                    <div className="text-[10px] text-indigo-200 font-bold text-center px-4 leading-tight">vs last month<br/>Great results!</div>
                </div>
             </div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center text-center relative h-[220px]">
              <div className="w-full flex justify-between items-center relative z-10">
                 <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wide">Overall Rating</div>
              </div>
              <div className="w-24 h-24 rounded-full border border-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.1)] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white relative mt-2 z-10">
                 <span className="text-4xl font-extrabold text-[#222222] italic pr-1">4.9</span>
              </div>
              <div className="mt-4 relative z-10">
                 <div className="text-indigo-600 font-bold text-sm">Impressive</div>
                 <div className="text-slate-400 text-xs font-semibold">From 2,405 reviews</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
