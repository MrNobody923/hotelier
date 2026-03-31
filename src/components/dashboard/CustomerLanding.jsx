import { useState } from "react";
import { UserCheck, BedDouble, CookingPot, Building, Users, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerLanding({ onDashboardReserve }) {
  const [checkIn, setCheckIn] = useState("2026-03-23");
  const [checkOut, setCheckOut] = useState("2026-03-25");

  return (
    <div className="bg-[#fcfbfd] p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-purple-100/50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: MASONRY / IMAGE GRID */}
        <div className="lg:col-span-6 xl:col-span-7 flex gap-4 h-[500px] lg:h-[700px]">
          <div className="flex flex-col gap-4 w-1/3 h-full">
            <img src="/resort_outdoor_path.png" alt="Outdoor Path" className="h-1/3 w-full object-cover rounded-2xl shadow-sm" />
            <img src="/luxury_hotel_bedroom.png" alt="Cozy Bedroom" className="h-1/3 w-full object-cover rounded-2xl shadow-sm" />
            <img src="/luxury_hotel_bathroom.png" alt="Bathroom" className="h-1/3 w-full object-cover rounded-2xl shadow-sm" />
          </div>
          <div className="w-2/3 h-full relative">
            <img src="/villa_main_pool.png" alt="Main Villa Pool" className="w-full h-full object-cover rounded-[2rem] shadow-md" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow border border-white/20 text-sm font-semibold text-slate-800 flex items-center cursor-pointer hover:bg-white transition">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Show all photos
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INFO & BOOKING WIDGET */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col h-full">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-3 font-medium">
              <span className="text-[#6450f1] font-bold">Featured Hub</span>
              <span>•</span>
              <span>Private Stay</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#2d2a3c] leading-[1.1] mb-5 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              Luxury Suite at Central Hub
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg">
                <UserCheck className="w-4 h-4 mr-1.5 text-slate-400"/> Private Pool
              </div>
              <div className="flex items-center text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg">
                <BedDouble className="w-4 h-4 text-yellow-500 mr-1.5 fill-yellow-500" /> 4.9 <span className="text-slate-400 font-normal ml-1">(128)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-[#f7f5fa] p-5 lg:p-6 rounded-[1.5rem] border border-purple-900/5 mb-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-3 text-sm">Bathroom</h3>
              <ul className="text-[13px] text-slate-500 space-y-2.5 font-medium">
                <li className="flex items-center"><CookingPot className="w-4 h-4 mr-2.5 text-slate-400"/> Hair dryer</li>
                <li className="flex items-center"><Building className="w-4 h-4 mr-2.5 text-slate-400"/> Shampoo</li>
                <li className="flex items-center"><UserCheck className="w-4 h-4 mr-2.5 text-slate-400"/> Hot water</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-3 text-sm">Bedroom</h3>
              <ul className="text-[13px] text-slate-500 space-y-2.5 font-medium">
                <li className="flex items-center"><BedDouble className="w-4 h-4 mr-2.5 text-slate-400"/> Essentials</li>
                <li className="flex items-center"><Users className="w-4 h-4 mr-2.5 text-slate-400"/> Hangers</li>
                <li className="flex items-center"><LayoutDashboard className="w-4 h-4 mr-2.5 text-slate-400"/> Safe & Storage</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 lg:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 mt-auto">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-3xl font-extrabold text-[#2d2a3c]" style={{ fontFamily: "Georgia, serif" }}>₱526</span>
                <span className="text-sm font-medium text-slate-500 ml-1">night</span>
              </div>
              <Button 
                className="bg-[#6450f1] hover:bg-[#523ee0] text-white rounded-xl px-8 py-6 font-bold shadow-md shadow-indigo-200 transition-all"
                onClick={() => onDashboardReserve && onDashboardReserve(checkIn, checkOut)}
              >
                Reserve
              </Button>
            </div>
            
            <div className="border border-slate-200 rounded-[1rem] overflow-hidden mb-5 focus-within:ring-2 focus-within:ring-[#6450f1]/20 transition-all">
              <div className="flex divide-x divide-slate-200 border-b border-slate-200">
                <div className="p-3.5 w-1/2 hover:bg-slate-50 transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-slate-800 tracking-wider mb-0.5">Check-in</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full text-sm font-medium outline-none text-slate-600 bg-transparent cursor-pointer" />
                </div>
                <div className="p-3.5 w-1/2 hover:bg-slate-50 transition-colors">
                  <label className="block text-[10px] uppercase font-bold text-slate-800 tracking-wider mb-0.5">Checkout</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full text-sm font-medium outline-none text-slate-600 bg-transparent cursor-pointer" />
                </div>
              </div>
              <div className="p-3.5 hover:bg-slate-50 transition-colors">
                <label className="block text-[10px] uppercase font-bold text-slate-800 tracking-wider mb-0.5">Guests</label>
                <select className="w-full text-sm font-medium outline-none text-slate-600 bg-transparent cursor-pointer">
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                </select>
              </div>
            </div>

            <div className="space-y-3.5 text-sm font-medium text-slate-500 mb-5 border-b border-slate-100 pb-5">
              <div className="flex justify-between">
                <span className="underline decoration-slate-300 underline-offset-2">$526 x 2 nights</span>
                <span className="text-slate-800">$1052</span>
              </div>
              <div className="flex justify-between">
                <span className="underline decoration-slate-300 underline-offset-2">Cleaning fee</span>
                <span className="text-slate-800">$25</span>
              </div>
              <div className="flex justify-between">
                <span className="underline decoration-slate-300 underline-offset-2">Taxes</span>
                <span className="text-slate-800">$50</span>
              </div>
            </div>

            <div className="flex justify-between font-extrabold text-[1.1rem] text-[#2d2a3c]">
              <span>Total</span>
              <span>$1127</span>
            </div>
          </div>
        </div>
      </div>

      {/* MORE ROOMS SECTION */}
      <div className="mt-16">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2d2a3c] tracking-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>Other Premium Experiences</h2>
            <p className="text-slate-500 font-medium">Discover more luxurious spaces tailored for your perfect getaway.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* CARD 1 */}
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
            <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-5 relative">
              <img src="/ocean_view_suite.png" alt="Ocean View Suite" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center">
                <BedDouble className="w-3.5 h-3.5 mr-1.5 text-[#6450f1]" /> 1 King Bed
              </div>
            </div>
            <div className="px-2 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#2d2a3c] mb-2" style={{ fontFamily: "Georgia, serif" }}>Ocean View Suite</h3>
              <div className="flex gap-3 text-xs font-medium text-slate-500 mb-4">
                <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> 2 Guests</span>
                <span className="flex items-center"><LayoutDashboard className="w-3.5 h-3.5 mr-1 text-slate-400" /> 450 sq ft</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                <div>
                  <span className="text-xl font-bold text-[#6450f1]">$350</span>
                  <span className="text-xs text-slate-400 ml-1">/night</span>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-[#f7f5fa] hover:text-[#6450f1] hover:border-[#6450f1] font-semibold text-xs py-1 transition-colors" onClick={() => onDashboardReserve && onDashboardReserve(checkIn, checkOut)}>
                  Reserve
                </Button>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
            <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-5 relative">
              <img src="/presidential_penthouse.png" alt="Presidential Penthouse" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-[#6450f1] px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center tracking-wide">
                 SIGNATURE
              </div>
            </div>
            <div className="px-2 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#2d2a3c] mb-2" style={{ fontFamily: "Georgia, serif" }}>Presidential Penthouse</h3>
              <div className="flex gap-3 text-xs font-medium text-slate-500 mb-4">
                <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> 6 Guests</span>
                <span className="flex items-center"><LayoutDashboard className="w-3.5 h-3.5 mr-1 text-slate-400" /> 2000 sq ft</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                <div>
                  <span className="text-xl font-bold text-[#6450f1]">$1,200</span>
                  <span className="text-xs text-slate-400 ml-1">/night</span>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-[#f7f5fa] hover:text-[#6450f1] hover:border-[#6450f1] font-semibold text-xs py-1 transition-colors" onClick={() => onDashboardReserve && onDashboardReserve(checkIn, checkOut)}>
                  Reserve
                </Button>
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
            <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-5 relative">
              <img src="/garden_room.png" alt="Zen Garden Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center">
                <BedDouble className="w-3.5 h-3.5 mr-1.5 text-[#6450f1]" /> 1 Queen Bed
              </div>
            </div>
            <div className="px-2 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#2d2a3c] mb-2" style={{ fontFamily: "Georgia, serif" }}>Zen Garden Room</h3>
              <div className="flex gap-3 text-xs font-medium text-slate-500 mb-4">
                <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> 2 Guests</span>
                <span className="flex items-center"><LayoutDashboard className="w-3.5 h-3.5 mr-1 text-slate-400" /> 350 sq ft</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                <div>
                  <span className="text-xl font-bold text-[#6450f1]">$280</span>
                  <span className="text-xs text-slate-400 ml-1">/night</span>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-[#f7f5fa] hover:text-[#6450f1] hover:border-[#6450f1] font-semibold text-xs py-1 transition-colors" onClick={() => onDashboardReserve && onDashboardReserve(checkIn, checkOut)}>
                  Reserve
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
