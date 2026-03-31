import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, PlusCircle, Maximize2, Users, BedDouble, ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

const getStatusVariant = (status) => {
  switch (status) {
    case "Available":
      return "default";
    case "Occupied":
      return "destructive";
    case "Cleaning":
      return "secondary";
    default:
      return "outline";
  }
};

const getRoomImage = (type, id = 0) => {
  const standardImages = [
    "/standard_room.png",
    "/standard_room_2.png",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop",
  ];

  const deluxeImages = [
    "/deluxe_room.png",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?q=80&w=1470&auto=format&fit=crop",
  ];

  const suiteImages = [
    "/ocean_view_suite.png",
    "https://images.unsplash.com/photo-1584132967334-10e028b17bce?q=80&w=1470&auto=format&fit=crop",
  ];

  const index = Number(id) || 0;

  switch (type) {
    case "Standard": return standardImages[index % standardImages.length];
    case "Deluxe": return deluxeImages[index % deluxeImages.length];
    case "Suite": return suiteImages[index % suiteImages.length];
    default: return standardImages[0];
  }
};

const getRoomDetailsContext = (type) => {
  const commonAmenities = ["High-speed WiFi", "Smart TV", "Air Conditioning", "Mini Bar", "Coffee Maker"];
  switch (type) {
    case "Standard": 
      return { 
        guests: 2, 
        size: "300 sq ft", 
        bed: "1 Queen Bed", 
        desc: "A clean, modern standard hotel room with minimal functional design and warm lighting.",
        amenities: [...commonAmenities, "Dedicated Desk"]
      };
    case "Deluxe": 
      return { 
        guests: 4, 
        size: "500 sq ft", 
        bed: "1 King Bed, 1 Sofa", 
        desc: "A luxurious deluxe hotel room with premium furnishings, upscale decor, and elegant lighting.",
        amenities: [...commonAmenities, "Balcony View", "Bath Tub", "24/7 Room Service"]
      };
    case "Suite": 
      return { 
        guests: 6, 
        size: "900 sq ft", 
        bed: "2 King Beds, Lounge", 
        desc: "A bright, airy luxury ocean view hotel suite with floor-to-ceiling windows showing the blue ocean.",
        amenities: [...commonAmenities, "Private Pool", "Living Area", "Kitchenette", "Premium Toiletries"]
      };
    default: 
      return { 
        guests: 2, 
        size: "300 sq ft", 
        bed: "1 Queen Bed", 
        desc: "A modern hotel room.",
        amenities: commonAmenities
      };
  }
};

const getRoomParts = (type) => {
  switch (type) {
    case "Standard":
      return [
        { name: "Bedroom", image: "/standard_room.png" },
        { name: "Bathroom", image: "/standard_bathroom.png" },
        { name: "Balcony", image: "/standard_balcony.png" }
      ];
    case "Deluxe":
      return [
        { name: "Bedroom", image: "/deluxe_room.png" },
        { name: "Bathroom", image: "/deluxe_bathroom.png" },
        { name: "Living Area", image: "/deluxe_seating.png" },
        { name: "Kitchenette", image: "/hotel_kitchenette.png" },
        { name: "Balcony", image: "/standard_balcony.png" }
      ];
    case "Suite":
      return [
        { name: "Master Bedroom", image: "/ocean_view_suite.png" },
        { name: "Luxury Bath", image: "/luxury_hotel_bathroom.png" },
        { name: "Living Room", image: "/presidential_penthouse.png" },
        { name: "Full Kitchen", image: "/full_kitchen.png" },
        { name: "Private Dining", image: "/private_dining.png" },
        { name: "Balcony", image: "/suite_balcony.png" }
      ];
    default:
      return [
        { name: "Bedroom", image: "/standard_room.png" },
        { name: "Bathroom", image: "/standard_bathroom.png" },
        { name: "Balcony", image: "/standard_balcony.png" }
      ];
  }
};

const RoomFeaturesCarousel = ({ parts }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Timer auto-sliding every 4 seconds
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % parts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [parts.length]);

  const handleDragEnd = (e, { offset }) => {
    const swipe = offset.x;
    if (swipe < -60) {
      setIndex((current) => (current + 1) % parts.length);
    } else if (swipe > 60) {
      setIndex((current) => (current - 1 + parts.length) % parts.length);
    }
  };

  const nextSlide = () => setIndex((current) => (current + 1) % parts.length);
  const prevSlide = () => setIndex((current) => (current - 1 + parts.length) % parts.length);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-56 bg-slate-900 group select-none transition-all">
       <AnimatePresence initial={false} mode="wait">
         <motion.div
           key={index}
           className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -50 }}
           transition={{ duration: 0.3, ease: "easeInOut" }}
           drag="x"
           dragConstraints={{ left: 0, right: 0 }}
           onDragEnd={handleDragEnd}
         >
           <img src={parts[index].image} className="w-full h-full object-cover pointer-events-none" alt={parts[index].name} />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none"></div>
           <div className="absolute bottom-5 left-5 text-white">
              <span className="font-bold text-xl drop-shadow-md">{parts[index].name}</span>
           </div>
         </motion.div>
       </AnimatePresence>
       
       <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md">
         <ChevronLeft className="w-5 h-5" />
       </button>
       <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-md">
         <ChevronRight className="w-5 h-5" />
       </button>
       
       <div className="absolute bottom-4 right-5 flex gap-2 z-10">
          {parts.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 shadow-sm ${i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`} 
            />
          ))}
       </div>
    </div>
  );
};

export default function Rooms({
  rooms,
  user,
  handleBooking,
  updateRoomStatus,
  handleCreateRoom,
  isCreateRoomOpen,
  setCreateRoomOpen,
  newRoomData,
  setNewRoomData,
  formData,
  setFormData,
}) {
  const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);

  const isAdmin = user && (user.role === "admin" || user.role === "super_admin" || user.role === "user_booking");

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Rooms Administration</h2>
          {(user.role === "admin" || user.role === "super_admin") && (
            <Dialog open={isCreateRoomOpen} onOpenChange={setCreateRoomOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#6450f1] hover:bg-[#523ee0] text-white">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Room
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Create a New Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="room-number-create">Room Number</Label>
                    <Input
                      id="room-number-create"
                      value={newRoomData.number}
                      onChange={(e) =>
                        setNewRoomData({ ...newRoomData, number: e.target.value })
                      }
                      placeholder="e.g., 101"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="room-type-create">Room Type</Label>
                    <Select
                      value={newRoomData.type}
                      onValueChange={(value) =>
                        setNewRoomData({ ...newRoomData, type: value })
                      }
                    >
                      <SelectTrigger id="room-type-create">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-[#6450f1] text-white hover:bg-[#523ee0]" onClick={handleCreateRoom}>
                    Save Room
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Room Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">No rooms available.</TableCell>
                  </TableRow>
                ) : (
                  rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-bold text-slate-700">Room {room.number}</TableCell>
                      <TableCell>
                        <span className="bg-slate-100 text-slate-700 font-medium px-2 py-1 rounded text-xs">{room.type}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(room.status)} className="shadow-none">
                          {room.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {room.status === "Available" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-[#6450f1] hover:bg-[#523ee0] text-white">
                                <PlusCircle className="mr-1 h-3 w-3" /> Book Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-2xl">
                              <DialogHeader>
                                <DialogTitle>New Booking for Room {room.number}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 pt-4 text-left">
                                <div className="grid gap-2">
                                  <Label>Guest Full Name</Label>
                                  <Input
                                    placeholder="Enter guest name"
                                    className="rounded-xl"
                                    onChange={(e) =>
                                      setFormData({
                                        ...formData,
                                        guest_name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label>Check In</Label>
                                    <Input
                                      type="date"
                                      className="rounded-xl"
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          check_in: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label>Check Out</Label>
                                    <Input
                                      type="date"
                                      className="rounded-xl"
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          check_out: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <Button
                                  className="w-full rounded-xl bg-[#6450f1] hover:bg-[#523ee0]"
                                  onClick={() => handleBooking(room.id)}
                                >
                                  Complete Booking
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {room.status === "Occupied" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => updateRoomStatus(room.id, "Available")}>
                              Check Out
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => updateRoomStatus(room.id, "Cleaning")}>
                              <Wrench className="w-3 h-3 mr-1" /> Cleaning
                            </Button>
                          </>
                        )}
                        {room.status === "Cleaning" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateRoomStatus(room.id, "Available")}>
                            Mark Clean
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-4xl font-extrabold font-serif text-[#2d2a3c] tracking-tight">Rooms</h2>
          <p className="text-slate-500 mt-1 font-medium">Experience the epitome of luxury and comfort.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="flex flex-col h-full"
          >
            <Card className="flex flex-col h-full shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-slate-100 group rounded-[2rem] bg-white">
              <div onClick={() => setSelectedRoomDetails(room)} className="cursor-pointer">
                <div className="relative h-56 w-full overflow-hidden">
                  <img src={getRoomImage(room.type, room.id)} alt={room.type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4">
                    <Badge variant={getStatusVariant(room.status)} className="shadow-sm font-bold tracking-wider backdrop-blur-xl bg-white/80 text-slate-900 border-white/40 border text-[10px] px-3 py-1 uppercase">
                      {room.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2 pt-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-serif text-[#2d2a3c]">Suite {room.number}</CardTitle>
                    <div className="text-right">
                       <span className="text-xl font-bold text-slate-900">₱{room.type === "Suite" ? "8,500" : (room.type === "Deluxe" ? "4,500" : "2,800")}</span>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">per night</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#6450f1] tracking-widest uppercase">{room.type}</p>
                </CardHeader>
                <CardContent className="pb-6 pt-2">
                  <div className="flex gap-6 text-xs font-bold text-slate-400">
                     <span className="flex items-center"><Users className="w-4 h-4 mr-2 text-slate-300" /> {getRoomDetailsContext(room.type).guests} Guests</span>
                     <span className="flex items-center"><Maximize2 className="w-4 h-4 mr-2 text-slate-300" /> {getRoomDetailsContext(room.type).size}</span>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="flex flex-col space-y-2 mt-auto pb-5 relative z-20">
                {room.status === "Available" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg">
                        Reserve Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Booking for Room {room.number}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input
                          placeholder="Guest Name"
                          className="rounded-xl"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guest_name: e.target.value,
                            })
                          }
                        />
                        <div className="grid gap-2">
                          <Label htmlFor={`check-in-${room.id}`}>Check In</Label>
                          <Input
                            id={`check-in-${room.id}`}
                            type="date"
                            className="rounded-xl"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                check_in: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`check-out-${room.id}`}>Check Out</Label>
                          <Input
                            id={`check-out-${room.id}`}
                            type="date"
                            className="rounded-xl"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                check_out: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button
                          className="w-full rounded-xl bg-[#6450f1] hover:bg-[#523ee0]"
                          onClick={() => handleBooking(room.id)}
                        >
                          Confirm Reservation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {room.status === "Occupied" && user.role !== "customer" && (
                  <Button
                    onClick={() => updateRoomStatus(room.id, "Available")}
                    className="w-full rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700"
                    variant="outline"
                  >
                    Check Out
                  </Button>
                )}
                {room.status === "Occupied" && user.role !== "customer" && (
                  <Button
                    variant="outline"
                    onClick={() => updateRoomStatus(room.id, "Cleaning")}
                    className="w-full rounded-xl"
                  >
                    <Wrench className="mr-2 h-4 w-4" />
                    Mark for Cleaning
                  </Button>
                )}
                {room.status === "Cleaning" && user.role !== "customer" && (
                  <Button
                    onClick={() => updateRoomStatus(room.id, "Available")}
                    className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-md"
                  >
                    Mark as Clean
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedRoomDetails} onOpenChange={(val) => { if (!val) setSelectedRoomDetails(null); }}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-visible rounded-[3rem] border-0 shadow-2xl bg-white">
          {selectedRoomDetails && (() => {
            const details = getRoomDetailsContext(selectedRoomDetails.type);
            const parts = getRoomParts(selectedRoomDetails.type);
            return (
              <div className="flex flex-col max-h-[95vh] overflow-hidden rounded-[3rem]">
                <DialogHeader className="sr-only">
                  <DialogTitle>Suite {selectedRoomDetails.number}</DialogTitle>
                  <DialogDescription>
                    Explore the full details and premium features of this luxury suite.
                  </DialogDescription>
                </DialogHeader>
                <div className="relative h-64 sm:h-80 flex-shrink-0 group">
                  <img src={getRoomImage(selectedRoomDetails.type, selectedRoomDetails.id)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Selected Room" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a3c] via-[#2d2a3c]/40 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white max-w-xl">
                    <div className="flex gap-2 mb-4">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-0 uppercase tracking-widest text-[9px] font-bold px-3 py-1">{selectedRoomDetails.type}</Badge>
                      <Badge className="bg-[#6450f1] text-white border-0 uppercase tracking-widest text-[9px] font-bold px-3 py-1">Featured</Badge>
                    </div>
                    <DialogTitle className="text-4xl sm:text-5xl font-serif font-extrabold tracking-tight text-white mb-3">Suite {selectedRoomDetails.number}</DialogTitle>
                    <p className="text-white/80 text-sm sm:text-base font-medium leading-relaxed drop-shadow-sm">{details.desc}</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 sm:p-10 bg-white hide-scrollbar">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                      { icon: <Users className="w-5 h-5 text-[#6450f1]" />, label: "Occupancy", val: `${details.guests} Guests` },
                      { icon: <BedDouble className="w-5 h-5 text-[#6450f1]" />, label: "Bedroom", val: details.bed },
                      { icon: <Maximize2 className="w-5 h-5 text-[#6450f1]" />, label: "Area", val: details.size },
                      { icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />, label: "Rating", val: "4.9/5.0" }
                    ].map((feat, i) => (
                      <div key={i} className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3">
                          {feat.icon}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{feat.label}</span>
                        <span className="text-sm font-extrabold text-[#2d2a3c]">{feat.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="font-extrabold text-[#2d2a3c] text-xl mb-5 font-serif flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-500" /> Premium Amenities
                      </h3>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                        {details.amenities.map((amenity, i) => (
                          <div key={i} className="flex items-center text-sm font-semibold text-slate-600">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#6450f1] mr-3 shadow-[0_0_8px_rgba(100,80,241,0.5)]"></div>
                             {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#2d2a3c] text-xl mb-5 font-serif flex items-center">
                        <Maximize2 className="w-5 h-5 mr-2 text-indigo-500" /> Space Configuration
                      </h3>
                      <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-100">
                        <RoomFeaturesCarousel parts={parts} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-[#2d2a3c] rounded-[2.5rem] p-8 mt-12 gap-6 shadow-2xl shadow-slate-200">
                    <div className="flex flex-col text-center sm:text-left">
                       <span className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-2 font-serif">Current Rate</span>
                       <div className="flex items-end gap-2">
                         <span className="text-4xl font-extrabold text-white leading-none">₱{selectedRoomDetails.type === "Suite" ? "8,500" : (selectedRoomDetails.type === "Deluxe" ? "4,500" : "2,800")}</span>
                         <span className="text-sm font-bold text-white/40 uppercase mb-1">/ Night</span>
                       </div>
                    </div>
                    <Button 
                      className="w-full sm:w-auto rounded-2xl px-12 py-8 bg-[#6450f1] text-white font-extrabold text-lg hover:bg-white hover:text-[#6450f1] transition-all duration-500 shadow-xl shadow-indigo-500/20" 
                      onClick={() => setSelectedRoomDetails(null)}
                    >
                      Close Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}