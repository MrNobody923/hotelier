import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingCart,
  User,
  Hash,
  AlertCircle,
  UtensilsCrossed,
  ClipboardList,
  Clock,
  Minus,
  Plus,
  Star,
  Sparkles,
  Pencil,
  Trash2,
  PlusCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

// categories constant removed from top level to be handled dynamically inside the component

const getItemImage = (itemName, category) => {
  const images = {
    steak:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=60",
    pasta:
      "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800&auto=format&fit=crop&q=60",
    salad:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60",
    pizza:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
    dessert:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60",
    burger:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60",
    cocktail:
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&auto=format&fit=crop&q=60",
    sushi:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60",
    appetizer:
      "https://images.unsplash.com/photo-1541014741259-df549fa9ba6f?w=800&auto=format&fit=crop&q=60",
    beverage:
      "https://images.unsplash.com/photo-1544145945-f904253d0c71?w=800&auto=format&fit=crop&q=60",
  };

  const name = itemName.toLowerCase();
  const cat = category.toLowerCase();

  if (name.includes("steak") || name.includes("beef") || name.includes("meat"))
    return images.steak;
  if (
    name.includes("pasta") ||
    name.includes("spaghetti") ||
    name.includes("noodle")
  )
    return images.pasta;
  if (name.includes("salad")) return images.salad;
  if (name.includes("pizza")) return images.pizza;
  if (name.includes("cake") || name.includes("dessert") || cat === "dessert")
    return images.dessert;
  if (name.includes("burger") || name.includes("sandwich"))
    return images.burger;
  if (name.includes("sushi")) return images.sushi;
  if (
    name.includes("coffee") ||
    name.includes("tea") ||
    name.includes("juice") ||
    cat === "drinks"
  )
    return images.cocktail;
  if (
    name.includes("soup") ||
    name.includes("appetizer") ||
    cat === "appetizer"
  )
    return images.appetizer;

  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60";
};

export default function Restaurant({
  menu,
  handleOrder,
  handleUpdateOrderStatus,
  user,
  orders = [],
  handleCreateMenuItem,
  handleEditMenuItem,
  handleDeleteMenuItem,
  rooms = [],
  bookings = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Determine if current user has an active, occupied room (checking names case-insensitively for robustness)
  const activeBooking = [...bookings]
    .reverse()
    .find(
      (b) =>
        b.guest_name?.trim().toLowerCase() ===
        user?.full_name?.trim().toLowerCase(),
    );
  const activeRoom = activeBooking
    ? rooms.find(
        (r) => r.id == activeBooking.room_id && r.status === "Occupied",
      )
    : null;

  // Dynamically derive unique categories from the actual menu items in the database
  const uniqueInDb = [
    ...new Set(menu.map((item) => item.category).filter(Boolean)),
  ];
  const hasNullCat = menu.some((item) => !item.category);
  const defaultCats = ["Breakfast", "Lunch", "Dinner", "Snacks", "Drinks"];

  // Combine user-requested defaults with unique categories from database
  const categories = [
    "All",
    ...new Set([...defaultCats, ...uniqueInDb]),
    ...(hasNullCat ? ["General"] : []),
  ];

  const selectOptions = [...new Set([...defaultCats, ...uniqueInDb])];

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderForm, setOrderForm] = useState({
    guest_name: "",
    room_number: "",
    quantity: 1,
    special_instructions: "",
  });

  // Admin Item Form State
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [itemForm, setItemForm] = useState({
    id: null,
    item_name: "",
    category: "Breakfast",
    description: "",
    price: "",
  });

  const filteredMenu = menu.filter((item) => {
    const matchSearch = item.item_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const itemCat = item.category || "General";
    const matchCategory =
      selectedCategory === "All" ||
      itemCat.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  const openOrderModal = (item) => {
    setSelectedItem(item);
    setOrderForm({
      guest_name: user?.full_name || "",
      room_number: activeRoom?.number || "",
      quantity: 1,
      special_instructions: "",
    });
    setOrderModalOpen(true);
  };

  const updateQuantity = (val) => {
    setOrderForm((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + val),
    }));
  };

  const handleSubmitOrder = () => {
    if (!orderForm.room_number || !orderForm.guest_name) {
      toast.error(
        "Please provide both Guest Name and Room Number to place an order.",
      );
      return;
    }

    // 🔒 RESTRICTION: Declined if room doesn't match active booking
    if (
      user.role === "customer" &&
      activeRoom &&
      String(orderForm.room_number) !== String(activeRoom.number)
    ) {
      toast.error(
        `Transaction Declined: You can only order for your booked Suite ${activeRoom.number}.`,
      );
      return;
    }

    handleOrder({
      ...orderForm,
      item_id: selectedItem?.id,
      item_name: selectedItem?.item_name,
      price: selectedItem?.price,
      total_price: selectedItem?.price * orderForm.quantity,
      status: "pending",
    });
    setOrderModalOpen(false);
  };

  const openAddItemModal = () => {
    setIsEditing(false);
    setItemForm({
      id: null,
      item_name: "",
      category: "Breakfast",
      description: "",
      price: "",
    });
    setItemModalOpen(true);
  };

  const openEditItemModal = (item) => {
    setIsEditing(true);
    setItemForm({ ...item });
    setItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (isEditing) {
      handleEditMenuItem(itemForm);
    } else {
      handleCreateMenuItem(itemForm);
    }
    setItemModalOpen(false);
  };

  const isAdmin =
    user && (user.role === "admin" || user.role === "super_admin");

  // SIMPLE ADMIN VIEW
  if (isAdmin) {
    return (
      <div className="space-y-12 bg-[#fcfbfd] p-8 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] min-h-screen">
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-4">
            <div>
              <h2 className="text-4xl font-serif font-extrabold text-[#2d2a3c] tracking-tight leading-none mb-3">
                Culinary Inventory
              </h2>
              <p className="text-slate-400 font-medium italic">
                Curate your fine dining menu and refine the guest gastronomic
                experience.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={isItemModalOpen} onOpenChange={setItemModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#6450f1] hover:bg-[#523ee0] text-white rounded-2xl px-8 py-7 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95"
                    onClick={openAddItemModal}
                  >
                    <PlusCircle className="mr-3 h-5 w-5" /> Add Master Selection
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      {isEditing ? "Edit Menu Item" : "Create New Item"}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the details below to{" "}
                      {isEditing ? "update" : "add a new dish to"} your hotel
                      menu.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 pt-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="item-name"
                        className="text-slate-600 font-medium"
                      >
                        Item Name
                      </Label>
                      <Input
                        id="item-name"
                        className="rounded-xl border-slate-200 focus:ring-indigo-500"
                        value={itemForm.item_name}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            item_name: e.target.value,
                          })
                        }
                        placeholder="e.g., Ribeye Steak"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="item-category"
                          className="text-slate-600 font-medium"
                        >
                          Category
                        </Label>
                        <Select
                          value={itemForm.category}
                          onValueChange={(value) =>
                            setItemForm({ ...itemForm, category: value })
                          }
                        >
                          <SelectTrigger
                            id="item-category"
                            className="rounded-xl border-slate-200"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectOptions.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="item-price"
                          className="text-slate-600 font-medium"
                        >
                          Price (₱)
                        </Label>
                        <Input
                          id="item-price"
                          type="number"
                          className="rounded-xl border-slate-200 focus:ring-indigo-500"
                          value={itemForm.price}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, price: e.target.value })
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="item-desc"
                        className="text-slate-600 font-medium"
                      >
                        Description
                      </Label>
                      <textarea
                        id="item-desc"
                        className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        value={itemForm.description}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the dish, ingredients, etc."
                      />
                    </div>
                    <Button
                      className="w-full bg-[#6450f1] text-white hover:bg-[#523ee0] py-6 rounded-xl font-bold text-lg"
                      onClick={handleSaveItem}
                    >
                      {isEditing ? "Update Item" : "Save Item"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Admin Category Tabs */}
          <div className="flex flex-wrap items-center gap-3 mb-10 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-2xl px-6 py-2 h-10 text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === category
                    ? "bg-[#2d2a3c] text-white shadow-lg shadow-slate-200"
                    : "text-slate-400 hover:text-[#6450f1] hover:bg-slate-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          <Card className="rounded-[2.5rem] shadow-sm border-slate-100 overflow-hidden bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b border-slate-50">
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                      Symmetry ID
                    </TableHead>
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                      Selection Name
                    </TableHead>
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                      Classification
                    </TableHead>
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] text-right">
                      Premium Rate
                    </TableHead>
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] text-right">
                      Operations
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMenu.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-slate-400"
                      >
                        No menu items found in this category.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMenu.map((item, idx) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-slate-50/50 transition group border-b border-slate-50"
                      >
                        <TableCell className="py-8 px-8 font-black text-[10px] text-slate-300">
                          #00{item.id}
                        </TableCell>
                        <TableCell className="py-8 px-8 font-extrabold text-[#2d2a3c] text-base">
                          {item.item_name}
                        </TableCell>
                        <TableCell className="py-8 px-8">
                          <Badge
                            variant="outline"
                            className="bg-[#6450f1]/5 text-[#6450f1] border-[#6450f1]/10 font-bold uppercase text-[9px] tracking-widest px-3"
                          >
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-8 px-8 text-right font-black text-slate-800 text-lg">
                          ₱{item.price}
                        </TableCell>
                        <TableCell className="py-8 px-8 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                              onClick={() => openEditItemModal(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              onClick={() => handleDeleteMenuItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="pt-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-serif font-extrabold text-[#2d2a3c] tracking-tight leading-none mb-3">
                Active Orders
              </h2>
              <p className="text-slate-400 font-medium italic">
                Track real-time courier status and guest fulfillment.
              </p>
            </div>
          </div>
          <Card className="rounded-[2.5rem] shadow-sm border-slate-100 overflow-hidden bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b border-slate-50">
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                      Timestamp
                    </TableHead>
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                      Guest Details
                    </TableHead>
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                      Designation
                    </TableHead>
                    <TableHead className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                      Selection Details
                    </TableHead>
                    <th className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] text-center">
                      Operational Status
                    </th>
                    <th className="py-6 px-8 font-serif font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] text-right">
                      Operational Notes
                    </th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Clock className="w-8 h-8 opacity-20" />
                          <span>No orders have been placed yet.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order, idx) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-slate-50/50 transition border-b border-slate-50"
                      >
                        <TableCell className="py-8 px-8">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                              <Clock className="w-4 h-4 text-orange-500" />
                            </div>
                            <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">
                              {new Date(order.created_at).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-8 px-8 font-extrabold text-[#2d2a3c] text-base">
                          {order.guest_name}
                        </TableCell>
                        <TableCell className="py-8 px-8">
                          <Badge className="bg-[#6450f1]/5 text-[#6450f1] border-0 shadow-none font-bold uppercase tracking-widest text-[10px] px-3 py-1">
                            Room {order.room_number}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-8 px-8">
                          <span className="font-extrabold text-[#2d2a3c] text-sm italic">
                            {order.quantity}x {order.item_name}
                          </span>
                        </TableCell>
                        <TableCell className="py-8 px-8 text-center min-w-[200px]">
                          <Select
                            defaultValue={order.status}
                            onValueChange={(val) => handleUpdateOrderStatus(order.id, val)}
                          >
                            <SelectTrigger className={`rounded-xl border-0 shadow-sm font-bold text-[10px] uppercase tracking-widest h-10 px-4 ${
                              order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                              order.status === 'Preparing' ? 'bg-indigo-100 text-indigo-700' :
                              order.status === 'On the Way' ? 'bg-blue-100 text-blue-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                              <SelectItem value="Pending" className="font-bold text-[10px] uppercase tracking-widest">Pending</SelectItem>
                              <SelectItem value="Preparing" className="font-bold text-[10px] uppercase tracking-widest">Preparing</SelectItem>
                              <SelectItem value="On the Way" className="font-bold text-[10px] uppercase tracking-widest">On the Way</SelectItem>
                              <SelectItem value="Delivered" className="font-bold text-[10px] uppercase tracking-widest">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-8 px-8 text-right text-xs text-slate-400 font-medium italic max-w-xs truncate">
                          {order.special_instructions ||
                            "No specific guest requests."}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  // LUXURY CUSTOMER GUEST VIEW
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[350px] w-full rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl group">
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          alt="Fine Dining"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-4 bg-amber-400/90 text-black border-0 font-bold tracking-widest uppercase text-[10px] py-1 px-3">
              Gourmet Selection
            </Badge>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight shadow-sm">
              Fine Dining
              <br />
              <span className="text-amber-200">At Your Doorstep</span>
            </h1>
            <p className="text-slate-200 text-lg max-w-md font-medium leading-relaxed opacity-90 drop-shadow-md">
              Indulge in our curated selection of world-class cuisine, prepared
              fresh by our executive chefs and delivered directly to your room.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🛵 GUEST ORDER TRACKING  */}
      {!isAdmin && (
        <section className="mb-16 px-4">
          {orders.filter(o => o.guest_name?.trim().toLowerCase() === user?.full_name?.trim().toLowerCase()).length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-extrabold text-[#2d2a3c] tracking-tight mb-2">Track Your Order</h2>
                  <p className="text-slate-400 font-medium italic text-sm">Real-time status of your order.</p>
                </div>
                <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Live Updates</span>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders
                  .filter(o => o.guest_name?.trim().toLowerCase() === user?.full_name?.trim().toLowerCase())
                  .slice(0, 3) // Show top 3 recent orders
                  .map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 border border-slate-50 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                          <UtensilsCrossed className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Order #{order.id}</p>
                          <h3 className="font-bold text-slate-800 text-sm">{order.item_name}</h3>
                        </div>
                      </div>
                      <Badge className={`border-0 shadow-sm font-bold uppercase tracking-widest text-[9px] px-3 py-1 ${
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'Preparing' ? 'bg-indigo-100 text-indigo-700' :
                        order.status === 'On the Way' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {order.status}
                      </Badge>
                    </div>

                    {/* STATUS TIMELINE */}
                    <div className="relative pt-8 mb-4">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-100" />
                      <div className={`absolute top-0 left-0 h-[2px] bg-indigo-500 transition-all duration-1000 ${
                        order.status === 'Pending' ? 'w-[5%]' :
                        order.status === 'Preparing' ? 'w-[33%]' :
                        order.status === 'On the Way' ? 'w-[66%]' :
                        'w-[100%]'
                      }`} />
                      
                      <div className="flex justify-between -mt-[11px]">
                         {[
                           { s: 'Pending', i: Clock },
                           { s: 'Preparing', i: Sparkles },
                           { s: 'On the Way', i: UtensilsCrossed },
                           { s: 'Delivered', i: Star }
                         ].map((step, idx) => {
                           const isActive = 
                             (order.status === 'Pending' && step.s === 'Pending') ||
                             (order.status === 'Preparing' && (step.s === 'Pending' || step.s === 'Preparing')) ||
                             (order.status === 'On the Way' && (step.s === 'Pending' || step.s === 'Preparing' || step.s === 'On the Way')) ||
                             (order.status === 'Delivered');
                           
                           return (
                             <div key={idx} className="flex flex-col items-center gap-3">
                               <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 border-2 transition-colors ${isActive ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-slate-100 text-slate-200'}`}>
                                  <step.i className="w-2.5 h-2.5" />
                               </div>
                               <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'text-indigo-600' : 'text-slate-300'}`}>{step.s}</span>
                             </div>
                           )
                         })}
                      </div>
                    </div>
                    
                    {order.status === 'Preparing' && (
                      <p className="text-[10px] text-indigo-500 font-medium italic text-center mt-4">Our world-class chefs are perfecting your dish...</p>
                    )}
                    {order.status === 'On the Way' && (
                      <p className="text-[10px] text-blue-500 font-medium italic text-center mt-4">Your order is being delivered to Suite {order.room_number}.</p>
                    )}
                    {order.status === 'Delivered' && (
                      <p className="text-[10px] text-emerald-500 font-bold italic text-center mt-4">Bon Appétit! Your order has arrived.</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-xl px-6 py-2 h-10 transition-all font-bold text-xs uppercase tracking-tighter ${selectedCategory === category ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "text-slate-500 hover:text-slate-900"}`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-slate-900" />
          <Input
            type="text"
            placeholder="Search our menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 w-full rounded-2xl border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all focus-visible:ring-slate-900 focus-visible:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMenu.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="group overflow-hidden rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border-0 bg-white ring-1 ring-slate-100 flex flex-col h-full active:scale-95">
              <div className="p-0 relative h-56 overflow-hidden">
                <img
                  src={getItemImage(item.item_name, item.category)}
                  alt={item.item_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-extrabold text-slate-900 shadow-xl border border-slate-100">
                  ₱{item.price}
                </div>
                {idx % 3 === 0 && (
                  <div className="absolute top-4 left-4 bg-amber-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-black" /> Popular
                  </div>
                )}
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold text-slate-900 font-serif leading-tight">
                    {item.item_name}
                  </CardTitle>
                </div>
                <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1 italic">
                  {item.description}
                </p>
                <Button
                  className={`w-full rounded-2xl py-6 shadow-lg transition-all flex justify-center items-center group-hover:-translate-y-1 ${!activeRoom && user.role === "customer" ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200"}`}
                  onClick={() => {
                    if (!activeRoom && user.role === "customer") {
                      toast.error(
                        "You must be checked into a room to avail delivery services.",
                      );
                      return;
                    }
                    openOrderModal(item);
                  }}
                  disabled={!activeRoom && user.role === "customer"}
                >
                  <ShoppingCart
                    className={`w-5 h-5 mr-3 transition-transform ${activeRoom || user.role !== "customer" ? "group-hover:rotate-12" : ""}`}
                  />
                  {!activeRoom && user.role === "customer"
                    ? "Checked-in Access Only"
                    : "Order Delivery"}
                </Button>
                {!activeRoom && user.role === "customer" && (
                  <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-3">
                    Active stay required for room service
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2.5rem] border-0 shadow-2xl">
          {selectedItem && (
            <>
              <div className="relative h-48 w-full">
                <img
                  src={getItemImage(
                    selectedItem.item_name,
                    selectedItem.category,
                  )}
                  className="w-full h-full object-cover"
                  alt="Food Header"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-amber-400 text-black border-0 font-bold text-[10px] uppercase">
                      Gourmet Delivery
                    </Badge>
                  </div>
                  <DialogTitle className="text-3xl font-bold font-serif text-white mb-1">
                    {selectedItem.item_name}
                  </DialogTitle>
                </div>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                      <User className="w-3.5 h-3.5 mr-2 text-slate-300" /> Guest
                      Name
                    </label>
                    <Input
                      placeholder="Jane Doe"
                      className="border-slate-100 bg-slate-50/50 h-12 rounded-xl focus-visible:ring-slate-900 focus-visible:bg-white transition-all font-bold"
                      value={orderForm.guest_name}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          guest_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                      <Hash className="w-3.5 h-3.5 mr-2 text-slate-300" /> Room
                      No.
                    </label>
                    <Input
                      placeholder="101"
                      className="border-slate-100 bg-slate-50/50 h-12 rounded-xl focus-visible:ring-slate-900 focus-visible:bg-white transition-all font-bold"
                      value={orderForm.room_number}
                      readOnly={!!activeRoom && user.role === "customer"}
                      onChange={(e) =>
                        setOrderForm({
                          ...orderForm,
                          room_number: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-2 text-slate-300" />{" "}
                    Quantity
                  </label>
                  <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100 w-max">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-10 w-10 hover:bg-white hover:shadow-sm"
                      onClick={() => updateQuantity(-1)}
                    >
                      <Minus className="w-4 h-4 text-slate-600" />
                    </Button>
                    <span className="px-6 font-black text-lg text-slate-900 tabular-nums">
                      {orderForm.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-10 w-10 hover:bg-white hover:shadow-sm"
                      onClick={() => updateQuantity(1)}
                    >
                      <Plus className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    Special Instructions
                  </label>
                  <textarea
                    placeholder="Allergies, preferences, etc..."
                    className="w-full flex min-h-[100px] rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:bg-white transition-all resize-none font-medium"
                    value={orderForm.special_instructions}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        special_instructions: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter className="bg-slate-50/50 p-6 border-t border-slate-100 flex items-center justify-between sm:justify-between rounded-b-[2.5rem]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    ₱
                    {(selectedItem.price * orderForm.quantity).toLocaleString()}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="ghost"
                    className="rounded-2xl h-12 font-bold px-6 text-slate-500"
                    onClick={() => setOrderModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 px-8 font-bold shadow-xl shadow-slate-200"
                    onClick={handleSubmitOrder}
                  >
                    Confirm Delivery
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
