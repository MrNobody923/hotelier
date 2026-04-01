import { Search, Calendar, ChevronRight, TrendingUp, ShieldAlert, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SuperAdminOverview({ user, rooms = [], bookings = [], updateRoomStatus }) {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === "Available").length;
  const occupiedRooms = rooms.filter((room) => room.status === "Occupied").length;
  const cleaningRooms = rooms.filter((room) => room.status === "Cleaning").length;
  
  // Today's Date for comparison
  const todayStr = new Date().toISOString().split('T')[0];
  
  // STATS LOGIC
  const totalBookings = bookings.length;
  // Checking in: Guests arriving today OR currently occupied rooms
  const checkingInCount = bookings.filter(b => b.check_in === todayStr || b.room_status === "Occupied").length;
  // Checking out: Guests departing today OR rooms in cleaning status
  const checkingOutCount = bookings.filter(b => b.check_out === todayStr).length + cleaningRooms;

  const totalBookedNights = bookings.reduce((total, b) => {
    if (b.check_in && b.check_out) {
      const d = Math.ceil(Math.abs(new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));
      return total + (d > 0 ? d : 1);
    }
    return total;
  }, 0);

  // PHILIPPINE PESO REVENUE
  const dynamicRevenue = (185000 + (totalBookedNights * 850)).toLocaleString("en-PH");

  return (
    <div className="bg-[#fcfbfd] rounded-[2.5rem] p-6 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] min-h-screen border border-slate-100 max-w-full overflow-x-hidden">
      {/* PROFESSIONAL TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#6450f1] to-[#4837c7] rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-200">H</div>
          <div className="space-y-0.5">
            <h2 className="text-3xl font-serif font-extrabold text-[#2d2a3c] tracking-tight">Executive Dashboard</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-[#6450f1]" /> Hotelier Management Suite
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[#6450f1]" />
            <Input 
              type="text" 
              placeholder="Query any room, guest or ledger..." 
              className="pl-11 pr-4 py-6 bg-white rounded-2xl w-full md:w-96 shadow-sm border-slate-100 focus-visible:ring-[#6450f1]/20 font-medium" 
            />
          </div>
          <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
             <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=6450f1&color=fff`} className="w-10 h-10 rounded-xl shadow-sm" alt="Avatar"/>
             <div className="pr-2">
               <h3 className="text-sm font-extrabold text-slate-800 leading-none">{user.full_name}</h3>
               <p className="text-[10px] text-[#6450f1] font-black uppercase tracking-tighter mt-1">Super Admin</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-8 flex flex-col space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-extrabold text-[#2d2a3c] font-serif tracking-tight leading-none mb-2">Welcome back, {user.full_name?.split(' ')[0]} 👋</h2>
              <p className="text-slate-500 font-medium italic">Here is the latest overview for your luxury establishment today.</p>
            </div>
          </div>

          {/* REVENUE & ANALYTICS PREVIEWS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col relative overflow-hidden border border-slate-100 transition-all hover:shadow-xl group">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#6450f1]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] font-serif">Total Revenue</div>
              <div className="text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-[#2d2a3c] tracking-tighter mb-4 italic leading-none whitespace-nowrap">₱{dynamicRevenue}</div>
              <div className="flex items-center gap-2 mt-auto">
                 <Badge className="bg-emerald-50 text-emerald-600 border-0 font-bold text-[9px] py-1 px-2 shadow-none flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> +₱12k
                 </Badge>
                 <span className="text-[10px] font-bold text-slate-400 leading-none">Today</span>
              </div>
            </div>

            <div className="lg:col-span-8 bg-[#2d2a3c] rounded-[2.5rem] p-8 shadow-2xl relative group overflow-hidden border border-slate-800">
               <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-serif">Occupancy Analytics</div>
                    <div className="text-[10px] bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center font-bold text-white/80 cursor-pointer hover:bg-white/10 transition-all">
                       <Calendar className="w-3 h-3 mr-2 text-[#6450f1]" /> Current Term
                    </div>
                  </div>
                  <div className="flex h-24 items-end justify-between px-2 gap-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((item, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 h-full group">
                        <div className="w-full max-w-[20px] flex flex-col-reverse h-full bg-white/5 rounded-full relative overflow-hidden">
                           <div className="absolute bottom-0 w-full rounded-b-full bg-indigo-500 shadow-lg shadow-indigo-500/50" style={{height: `${Math.random() * 40 + 40}%`}}></div>
                        </div>
                        <span className="text-[9px] text-white/40 mt-3 font-bold uppercase tracking-widest leading-none">{item}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* ACTIVITY COUNTERS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Bookings", val: totalBookings, color: "bg-indigo-50", text: "text-indigo-600", icon: <Calendar className="w-4 h-4" /> },
              { label: "Check in", val: checkingInCount, color: "bg-emerald-50", text: "text-emerald-600", icon: <ChevronRight className="w-4 h-4" /> },
              { label: "Check out", val: checkingOutCount, color: "bg-orange-50", text: "text-orange-600", icon: <TrendingUp className="w-4 h-4" /> },
              { label: "Available", val: availableRooms, color: "bg-slate-50", text: "text-slate-600", icon: <Sparkles className="w-4 h-4" /> }
            ].map((st, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-md transition-all">
                <div className={`${st.color} ${st.text} w-10 h-10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all`}>
                  {st.icon}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-serif mb-1">{st.label}</div>
                <div className="text-3xl font-extrabold text-[#2d2a3c]">{st.val}</div>
              </div>
            ))}
          </div>

          {/* MAIN DATA TABLE */}
          <div className="bg-white rounded-[2.5rem] p-0 shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                 <div className="flex items-center text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] font-serif">Active Reservations Directory</div>
                 <div className="text-[10px] bg-white border border-slate-200 rounded-lg px-3 py-1 font-bold text-slate-500 shadow-sm">Filtered by Status</div>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left text-sm min-w-[500px]">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase tracking-[0.05em] font-extrabold bg-white border-b border-slate-100">
                      <th className="py-5 px-5 lg:px-6">Identifier</th>
                      <th className="py-5 px-5 lg:px-6">Guest Name</th>
                      <th className="py-5 px-5 lg:px-6 text-center">Room Details</th>
                      <th className="py-5 px-5 lg:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {bookings.map((booking, idx) => {
                      const displayStatus = booking.room_status || booking.booking_status || "Pending";
                      return (
                        <tr key={booking.id} className="hover:bg-slate-50/50 transition font-semibold text-slate-700">
                          <td className="py-6 px-5 lg:px-6 text-[#6450f1] font-black text-xs">BK-{10000 + Number(booking.id)}</td>
                          <td className="py-6 px-5 lg:px-6">
                            <div className="flex flex-col">
                               <span className="font-extrabold text-[#2d2a3c] text-[15px]">{booking.guest_name || "Esteemed Guest"}</span>
                               <span className="text-[10px] text-slate-400 uppercase tracking-wide italic">Registration ID: 00{booking.id}</span>
                            </div>
                          </td>
                          <td className="py-6 px-5 lg:px-6">
                            <div className="flex flex-col items-center">
                              <span className="text-base font-black text-slate-600 mb-1">Room {booking.room_number || "TBD"}</span>
                              <Badge variant="outline" className="bg-[#6450f1]/5 text-[#6450f1] border-[#6450f1]/10 font-bold uppercase text-[8px] tracking-widest px-2 scale-90">
                                 {booking.room_type || "Standard"}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-6 px-5 lg:px-6 text-right">
                            {displayStatus === "Occupied" ? (
                              <Button 
                                variant="secondary"
                                onClick={() => updateRoomStatus(booking.room_id, "Cleaning")}
                                className="bg-[#2d2a3c] text-white hover:bg-slate-800 rounded-xl px-4 font-bold text-[9px] uppercase tracking-widest h-8"
                              >
                                Check Out
                              </Button>
                            ) : displayStatus === "Cleaning" ? (
                              <Badge className="bg-amber-100 text-amber-700 border-0 font-bold uppercase text-[8px] tracking-widest px-3 py-1.5">Cleaning</Badge>
                            ) : (
                              <Badge className="bg-[#ebf8f2] text-[#2ba06d] border-0 font-bold uppercase text-[8px] tracking-widest px-3 py-1.5">Available</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-20 text-center text-slate-400 font-serif italic text-lg opacity-40">No active bookings found in the secure repository.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: REVENUE & TASKS */}
        <div className="col-span-12 xl:col-span-4 flex flex-col space-y-8">
           <div className="bg-gradient-to-br from-[#6450f1] to-[#4837c7] rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-200 text-white flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-32 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="flex flex-col relative z-10 h-full">
                <div className="flex items-center text-[10px] font-black text-white/50 uppercase tracking-[0.3em] font-serif mb-12">Platform Distribution</div>
                
                <div className="space-y-6 mb-12">
                   {[
                     { l: "Direct Booking", p: "61%", c: "bg-emerald-400" },
                     { l: "Booking.com", p: "12%", c: "bg-amber-400" },
                     { l: "Platform Agoda", p: "11%", c: "bg-white" }
                   ].map((pl, i) => (
                     <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${pl.c} shadow-md`}></div>
                           <span className="text-xs font-extrabold tracking-tight">{pl.l}</span>
                        </div>
                        <span className="text-sm font-black italic">{pl.p}</span>
                     </div>
                   ))}
                </div>

                <div className="mt-auto flex items-center justify-center p-8 bg-white/5 rounded-[2rem] border border-white/5 scale-105">
                   <div className="w-32 h-32 rounded-full border-[12px] border-white/10 flex flex-col items-center justify-center relative backdrop-blur-sm">
                       <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-amber-400 rotate-45"></div>
                       <div className="text-3xl font-serif font-black">+14%</div>
                       <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest text-center mt-1">Growth</div>
                   </div>
                </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center relative border border-slate-100 group overflow-hidden">
              <div className="w-full flex justify-between items-center font-serif">
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Guest Appraisal</div>
                 <Badge className="bg-emerald-50 text-emerald-600 border-0 font-bold text-[9px]">+0.2 Exp</Badge>
              </div>
              <div className="w-28 h-28 rounded-[2rem] border-8 border-slate-50 flex flex-col items-center justify-center bg-white shadow-xl shadow-indigo-100/20 rotate-3 group-hover:rotate-0 transition-transform duration-500 my-8">
                 <span className="text-4xl font-extrabold text-[#2d2a3c] italic pr-1">4.9</span>
              </div>
              <div className="space-y-1">
                 <div className="text-[#6450f1] font-black text-sm uppercase tracking-widest">Exceptional</div>
                 <div className="text-slate-400 text-xs font-bold font-serif opacity-60">Verified Guest Reviews</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 mt-6 group-hover:translate-x-2 transition-transform" />
           </div>
        </div>
      </div>
    </div>
  );
}
