import { useState } from "react";
import { UserCheck, BedDouble, CookingPot, Building, Users, LayoutDashboard, CreditCard, Wallet, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function CustomerLanding({ onDashboardReserve }) {
  const [checkIn, setCheckIn] = useState("2026-03-23");
  const [checkOut, setCheckOut] = useState("2026-03-25");
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const experiences = [
    { id: 1, name: "Luxury Suite at Central Hub", price: 526, img: "/villa_main_pool.png", guests: 2, size: "700 sq ft" },
    { id: 2, name: "Ocean View Suite", price: 350, img: "/ocean_view_suite.png", guests: 2, size: "450 sq ft" },
    { id: 3, name: "Presidential Penthouse", price: 1200, img: "/presidential_penthouse.png", guests: 6, size: "2000 sq ft" },
    { id: 4, name: "Zen Garden Room", price: 280, img: "/garden_room.png", guests: 2, size: "350 sq ft" }
  ];

  const handleOpenCheckout = (exp) => {
    setSelectedExperience(exp);
    setCheckoutOpen(true);
  };

  const handleFinalReserve = () => {
    if (onDashboardReserve) {
      onDashboardReserve(checkIn, checkOut);
      setCheckoutOpen(false);
    }
  };

  const calculateTotal = (price) => {
    const subtotal = price * 2;
    const cleaning = 250;
    const taxes = Math.round(subtotal * 0.12);
    return { subtotal, cleaning, taxes, total: subtotal + cleaning + taxes };
  };

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
                onClick={() => handleOpenCheckout(experiences[0])}
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
                <span className="underline decoration-slate-300 underline-offset-2">₱526 x 2 nights</span>
                <span className="text-slate-800">₱1,052</span>
              </div>
              <div className="flex justify-between">
                <span className="underline decoration-slate-300 underline-offset-2">Cleaning fee</span>
                <span className="text-slate-800">₱250</span>
              </div>
              <div className="flex justify-between">
                <span className="underline decoration-slate-300 underline-offset-2">Taxes</span>
                <span className="text-slate-800">₱126</span>
              </div>
            </div>

            <div className="flex justify-between font-extrabold text-[1.1rem] text-[#2d2a3c]">
              <span>Total</span>
              <span>₱1,428</span>
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
          {experiences.slice(1).map((exp) => (
            <div key={exp.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
              <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-5 relative">
                <img src={exp.img} alt={exp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center">
                  <BedDouble className="w-3.5 h-3.5 mr-1.5 text-[#6450f1]" /> 1 King Bed
                </div>
              </div>
              <div className="px-2 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#2d2a3c] mb-2" style={{ fontFamily: "Georgia, serif" }}>{exp.name}</h3>
                <div className="flex gap-3 text-xs font-medium text-slate-500 mb-4">
                  <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> {exp.guests} Guests</span>
                  <span className="flex items-center"><LayoutDashboard className="w-3.5 h-3.5 mr-1 text-slate-400" /> {exp.size}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                  <div>
                    <span className="text-xl font-bold text-[#6450f1]">₱{exp.price}</span>
                    <span className="text-xs text-slate-400 ml-1">/night</span>
                  </div>
                  <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-[#f7f5fa] hover:text-[#6450f1] hover:border-[#6450f1] font-semibold text-xs py-1 transition-colors" onClick={() => handleOpenCheckout(exp)}>
                    Reserve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[850px] p-0 rounded-[3rem] border-0 shadow-2xl overflow-hidden bg-white max-h-[90vh]">
          {selectedExperience && (
            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
              {/* LEFT SIDE: SUMMARY */}
              <div className="lg:w-1/3 bg-[#2d2a3c] text-white p-8 lg:p-10 flex flex-col">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-2xl">
                  <img src={selectedExperience.img} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                
                <Badge className="w-fit mb-4 bg-amber-400/90 text-black border-0 uppercase tracking-widest text-[9px] font-bold px-3 py-1">Booking Selection</Badge>
                <h2 className="text-2xl font-serif font-extrabold mb-4 leading-tight">{selectedExperience.name}</h2>
                
                <div className="space-y-4 mt-auto">
                   <div className="flex items-center text-sm font-semibold text-white/60">
                      <Calendar className="w-4 h-4 mr-3" /> {checkIn} - {checkOut}
                   </div>
                   <div className="flex items-center text-sm font-semibold text-white/60">
                      <Users className="w-4 h-4 mr-3" /> {selectedExperience.guests} Professional Guests
                   </div>
                   
                   <div className="pt-6 border-t border-white/10">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 block">Pricing Details</span>
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                           <span className="text-white/60">₱{selectedExperience.price} x 2 Nights</span>
                           <span className="font-bold">₱{calculateTotal(selectedExperience.price).subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-white/60">Luxury Taxes</span>
                           <span className="font-bold">₱{calculateTotal(selectedExperience.price).taxes}</span>
                        </div>
                        <div className="flex justify-between text-lg pt-4 border-t border-white/10">
                           <span className="font-serif font-bold">Total Stay</span>
                           <span className="font-extrabold text-amber-400">₱{calculateTotal(selectedExperience.price).total}</span>
                        </div>
                     </div>
                   </div>
                </div>
              </div>

              {/* RIGHT SIDE: PAYMENT FORM */}
              <div className="lg:w-2/3 p-8 lg:p-10 overflow-y-auto bg-white" style={{ maxHeight: '90vh' }}>
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-3xl font-serif font-extrabold text-[#2d2a3c]">Complete Reservation</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium pt-1 italic text-xs">A moment away from sanctuary.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] pl-1">Full Identity</Label>
                       <Input className="rounded-xl border-slate-100 bg-slate-50/50 p-5 font-semibold" placeholder="e.g., Jonathan Wick" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] pl-1">Contact Email</Label>
                       <Input className="rounded-xl border-slate-100 bg-slate-50/50 p-5 font-semibold" placeholder="j.wick@continental.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] pl-1">Phone Number</Label>
                    <div className="relative">
                      <Input className="rounded-xl border-slate-100 bg-slate-50/50 p-5 font-semibold pl-12" placeholder="+63 9XX XXX XXXX" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold border-r pr-3 border-slate-200">🇵🇭</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] pl-1 mb-3 block">Payment Method</Label>
                    <div className="grid grid-cols-2 gap-4">
                       <div 
                         onClick={() => setPaymentMethod("card")}
                         className={`cursor-pointer p-5 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'card' ? 'border-[#6450f1] bg-[#6450f1]/5' : 'border-slate-100 hover:border-slate-300'}`}
                       >
                         <div className={`p-3 rounded-xl ${paymentMethod === 'card' ? 'bg-[#6450f1] text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <CreditCard className="w-5 h-5" />
                         </div>
                         <span className={`font-bold ${paymentMethod === 'card' ? 'text-[#6450f1]' : 'text-slate-500'}`}>Card</span>
                       </div>
                       <div 
                         onClick={() => setPaymentMethod("e-wallet")}
                         className={`cursor-pointer p-5 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'e-wallet' ? 'border-[#6450f1] bg-[#6450f1]/5' : 'border-slate-100 hover:border-slate-300'}`}
                       >
                         <div className={`p-3 rounded-xl ${paymentMethod === 'e-wallet' ? 'bg-[#6450f1] text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <Wallet className="w-5 h-5" />
                         </div>
                         <span className={`font-bold ${paymentMethod === 'e-wallet' ? 'text-[#6450f1]' : 'text-slate-500'}`}>E-Wallet</span>
                       </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {paymentMethod === 'card' ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                         <div className="space-y-2">
                           <Label className="text-xs font-bold text-slate-400 pl-1 uppercase tracking-widest">Card Details</Label>
                           <Input className="rounded-2xl border-slate-100 bg-slate-50/50 p-6 font-mono" placeholder="0000 0000 0000 0000" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <Input className="rounded-2xl border-slate-100 bg-slate-50/50 p-6" placeholder="MM/YY" />
                           <Input className="rounded-2xl border-slate-100 bg-slate-50/50 p-6" placeholder="CVC" />
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }}
                        className="p-6 bg-slate-50 rounded-[1.5rem] flex items-center gap-4 border border-slate-100"
                      >
                         <div className="bg-white p-3 rounded-2xl shadow-sm italic font-bold text-[#6450f1]">G)</div>
                         <p className="text-sm font-medium text-slate-600">You will be redirected to <span className="font-bold text-slate-900">GCash/Maya</span> to complete your authentication.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-2 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-xs text-green-600 font-bold bg-green-50/80 p-3 rounded-xl border border-green-100">
                       <ShieldCheck className="w-3.5 h-3.5" /> Secure SSL Encrypted System
                    </div>
                    <Button 
                      className="w-full bg-[#6450f1] text-white py-8 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-[#523ee0] transition-all transform active:scale-95 mb-4"
                      onClick={handleFinalReserve}
                    >
                      Process ₱{calculateTotal(selectedExperience.price).total}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
