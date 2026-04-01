import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, PlusCircle, MoreHorizontal, Edit, Trash2, Users, UserCheck, Mail, ShieldCheck, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Customers({ customers, setCustomers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomerData, setNewCustomerData] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    role: "customer",
  });

  const filteredCustomers = customers.filter((customer) =>
    (customer.full_name || customer.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = async () => {
    if (!newCustomerData.full_name || !newCustomerData.email || !newCustomerData.username || !newCustomerData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/register.php', {
        ...newCustomerData,
        role: "customer"
      });

      if (response.data.status === "success") {
        toast.success('Guest registered successfully!');
        const res = await axios.get('http://localhost:8000/get_customers.php');
        if (Array.isArray(res.data)) setCustomers(res.data);
        setCreateOpen(false);
        setNewCustomerData({ full_name: "", email: "", username: "", password: "", role: "customer" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Network error. Could not register guest.");
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await axios.post('http://localhost:8000/edit_user.php', selectedCustomer);
      if (response.data.status === "success") {
        setCustomers(customers.map(c => c.id === selectedCustomer.id ? selectedCustomer : c));
        setEditOpen(false);
        setSelectedCustomer(null);
        toast.success("Guest profile updated.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Network error. Could not update guest.");
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (confirm("Permanently remove this guest record?")) {
      try {
        const response = await axios.post('http://localhost:8000/delete_user.php', { id: customerId });
        if (response.data.status === "success") {
          setCustomers(customers.filter(c => c.id !== customerId));
          toast.success("Guest record deleted.");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Network error. Could not delete guest.");
      }
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'G';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold font-serif text-[#2d2a3c] tracking-tight">Guest Management</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Monitor and manage your hotel's esteemed guests.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search guests by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 w-full md:w-72 rounded-[1.25rem] border-slate-200 bg-white shadow-sm focus:ring-[#6450f1]/20"
            />
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6450f1] hover:bg-[#523ee0] text-white rounded-[1.25rem] px-6 py-6 font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] sm:max-w-[450px] p-0 border-0 overflow-hidden shadow-2xl">
              <div className="bg-[#2d2a3c] p-8 text-white relative">
                <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/5" />
                <DialogTitle className="text-2xl font-serif font-extrabold mb-2">New Guest Profile</DialogTitle>
                <DialogDescription className="text-white/60 text-sm">Initialize a new guest account within the repository.</DialogDescription>
              </div>
              <div className="p-8 space-y-5 bg-white">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</Label>
                  <Input
                    className="rounded-xl border-slate-100 bg-slate-50/50"
                    value={newCustomerData.full_name}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, full_name: e.target.value })}
                    placeholder="e.g., Alexandra V"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</Label>
                  <Input
                    type="email"
                    className="rounded-xl border-slate-100 bg-slate-50/50"
                    value={newCustomerData.email}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                    placeholder="alex@suite.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Credentials</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50/50"
                      value={newCustomerData.username}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, username: e.target.value })}
                      placeholder="Username"
                    />
                    <Input
                      type="password"
                      className="rounded-xl border-slate-100 bg-slate-50/50"
                      value={newCustomerData.password}
                      onChange={(e) => setNewCustomerData({ ...newCustomerData, password: e.target.value })}
                      placeholder="Password"
                    />
                  </div>
                </div>
                <Button className="w-full bg-[#6450f1] text-white py-8 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-[#523ee0]" onClick={handleCreateCustomer}>
                  Complete Registration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Users className="w-5 h-5 text-indigo-500" />, label: "Total Guests", val: customers.length, color: "bg-indigo-50" },
          { icon: <UserCheck className="w-5 h-5 text-green-500" />, label: "Recently Joined", val: "4 New", color: "bg-green-50" },
          { icon: <ShieldCheck className="w-5 h-5 text-amber-500" />, label: "Verified Profiles", val: `${Math.round(customers.length * 0.9)}%`, color: "bg-amber-50" }
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm rounded-[2rem] bg-white overflow-hidden group">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 font-serif tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-[#2d2a3c] leading-none mt-1">{stat.val}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CUSTOMER GRID / TABLE */}
      <Card className="border-0 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left p-6 lg:p-8 font-serif text-slate-400 font-bold uppercase text-[10px] tracking-widest">Guest Identity</th>
                  <th className="text-left p-6 lg:p-8 font-serif text-slate-400 font-bold uppercase text-[10px] tracking-widest">Contact Info</th>
                  <th className="text-left p-6 lg:p-8 font-serif text-slate-400 font-bold uppercase text-[10px] tracking-widest">Account Status</th>
                  <th className="text-right p-6 lg:p-8 font-serif text-slate-400 font-bold uppercase text-[10px] tracking-widest">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map((customer, idx) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-6 lg:p-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm group-hover:shadow-md transition-all">
                          {getInitials(customer.full_name)}
                        </div>
                        <div>
                          <p className="font-bold text-[#2d2a3c] text-lg leading-none mb-1">{customer.full_name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">@{customer.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 lg:p-8">
                      <div className="flex items-center text-slate-600 font-semibold text-sm">
                        <Mail className="w-4 h-4 mr-2 text-slate-300" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="p-6 lg:p-8">
                      <Badge className="bg-green-50 text-green-600 border-0 font-bold tracking-wider uppercase text-[10px] px-3 py-1">Verified</Badge>
                    </td>
                    <td className="p-6 lg:p-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md transition-all">
                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 p-2 shadow-xl w-40">
                          <DropdownMenuItem
                            className="rounded-xl p-3 font-semibold text-slate-600 cursor-pointer"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setEditOpen(true);
                            }}
                          >
                            <Edit className="mr-3 h-4 w-4 text-indigo-500" />
                            Modify
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-xl p-3 font-semibold text-red-500 cursor-pointer hover:!bg-red-50"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Expunge
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-[2.5rem] sm:max-w-[450px] p-0 border-0 overflow-hidden shadow-2xl">
          <div className="bg-[#2d2a3c] p-8 text-white relative">
            <Edit className="absolute top-4 right-4 w-12 h-12 text-white/5" />
            <DialogTitle className="text-2xl font-serif font-extrabold mb-2">Refine Guest Profile</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">Update the identity and access details for this guest.</DialogDescription>
          </div>
          {selectedCustomer && (
            <div className="p-8 space-y-6 bg-white">
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</Label>
                <Input
                  className="rounded-xl border-slate-100 bg-slate-50/50"
                  value={selectedCustomer.full_name}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, full_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Electronic Mail</Label>
                <Input
                  className="rounded-xl border-slate-100 bg-slate-50/50"
                  value={selectedCustomer.email}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">User Identifier</Label>
                <Input
                  className="rounded-xl border-slate-100 bg-slate-50/50"
                  value={selectedCustomer.username}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, username: e.target.value })}
                />
              </div>
              <Button className="w-full bg-[#6450f1] text-white py-8 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-[#523ee0] transition-all" onClick={handleEditCustomer}>
                Consolidate Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}