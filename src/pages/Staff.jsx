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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, PlusCircle, MoreHorizontal, Edit, Trash2, Briefcase, ShieldAlert, UserCheck, UserPlus, Mail, Fingerprint, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Staff({ staff, addStaff, setStaff }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaffData, setNewStaffData] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    role: "user_booking",
  });

  const filteredStaff = staff.filter((member) =>
    (member.full_name || member.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateStaff = async () => {
    if (!newStaffData.full_name || !newStaffData.email || !newStaffData.username || !newStaffData.password || !newStaffData.role) {
      toast.error("Please provide all required credentials.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/register.php', newStaffData);
      if (response.data.status === "success") {
        toast.success('New staff member added to the team!');
        // Re-fetch staff to ensure ID synchronization
        const res = await axios.get('http://localhost:8000/get_staff.php');
        if (Array.isArray(res.data)) setStaff(res.data);
        setCreateOpen(false);
        setNewStaffData({ full_name: "", email: "", username: "", password: "", role: "user_booking" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Network error. Could not register staff.");
    }
  };

  const handleEditStaff = async () => {
    if (!selectedStaff) return;

    try {
      const response = await axios.post('http://localhost:8000/edit_user.php', selectedStaff);
      if (response.data.status === "success") {
        setStaff(staff.map(s => s.id === selectedStaff.id ? selectedStaff : s));
        setEditOpen(false);
        setSelectedStaff(null);
        toast.success("Staff profile updated.");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Network error. Could not update profile.");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (confirm("Permanently deactivate this staff account?")) {
      try {
        const response = await axios.post('http://localhost:8000/delete_user.php', { id: staffId });
        if (response.data.status === "success") {
          setStaff(staff.filter(s => s.id !== staffId));
          toast.success("Staff record removed.");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Network error. Could not delete record.");
      }
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'S';
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'super_admin': return <Badge className="bg-purple-50 text-purple-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2 group-hover:bg-purple-100 transition-colors">Super Admin</Badge>;
      case 'admin': return <Badge className="bg-blue-50 text-blue-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2">Manager</Badge>;
      case 'user_booking': return <Badge className="bg-emerald-50 text-emerald-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2">Booking</Badge>;
      case 'user_ordering': return <Badge className="bg-amber-50 text-amber-600 border-0 font-bold uppercase text-[9px] tracking-widest px-2">Dining</Badge>;
      default: return <Badge className="bg-slate-50 text-slate-500 border-0 font-bold uppercase text-[9px] tracking-widest px-2">Staff</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold font-serif text-[#2d2a3c] tracking-tight">Staff Operations</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Manage permissions and team member information.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 w-full md:w-72 rounded-[1.25rem] border-slate-200 bg-white shadow-sm focus:ring-[#6450f1]/20"
            />
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6450f1] hover:bg-[#523ee0] text-white rounded-[1.25rem] px-6 py-6 font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                <UserPlus className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] sm:max-w-[480px] p-0 border-0 overflow-hidden shadow-2xl">
              <div className="bg-[#2d2a3c] p-8 text-white relative">
                <Briefcase className="absolute top-4 right-4 w-12 h-12 text-white/5" />
                <DialogTitle className="text-2xl font-serif font-extrabold mb-2 text-white">New Staff Onboarding</DialogTitle>
                <DialogDescription className="text-white/60 text-sm">Assign roles and credentials for your team.</DialogDescription>
              </div>
              <div className="p-8 space-y-5 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Legal Name</Label>
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50/50"
                      value={newStaffData.full_name}
                      onChange={(e) => setNewStaffData({ ...newStaffData, full_name: e.target.value })}
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email</Label>
                    <Input
                      type="email"
                      className="rounded-xl border-slate-100 bg-slate-50/50"
                      value={newStaffData.email}
                      onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                      placeholder="work@hotel.com"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Access Control Role</Label>
                  <Select
                    value={newStaffData.role}
                    onValueChange={(value) => setNewStaffData({ ...newStaffData, role: value })}
                  >
                    <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 py-6">
                      <SelectValue placeholder="Assign Permission Level" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 p-2">
                      <SelectItem value="super_admin" className="rounded-xl py-3 px-4 font-semibold text-purple-600">Super Admin</SelectItem>
                      <SelectItem value="admin" className="rounded-xl py-3 px-4 font-semibold text-blue-600">Administrator</SelectItem>
                      <SelectItem value="user_booking" className="rounded-xl py-3 px-4 font-semibold text-emerald-600">Booking Desk</SelectItem>
                      <SelectItem value="user_ordering" className="rounded-xl py-3 px-4 font-semibold text-amber-600">Dining Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Identifier</Label>
                    <Input
                      className="rounded-xl border-slate-100 bg-slate-50/50"
                      value={newStaffData.username}
                      onChange={(e) => setNewStaffData({ ...newStaffData, username: e.target.value })}
                      placeholder="Username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Secure Pin</Label>
                    <Input
                      type="password"
                      className="rounded-xl border-slate-100 bg-slate-50/50"
                      value={newStaffData.password}
                      onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                      placeholder="Password"
                    />
                  </div>
                </div>
                <Button className="w-full bg-[#6450f1] text-white py-8 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-[#523ee0] mt-2 transition-all active:scale-[0.98]" onClick={handleCreateStaff}>
                  Grant System Access
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Briefcase className="w-5 h-5 text-indigo-500" />, label: "Total Workforce", val: staff.length, color: "bg-indigo-50" },
          { icon: <UserCheck className="w-5 h-5 text-emerald-500" />, label: "Active Admins", val: staff.filter(s=>s.role.includes('admin')).length, color: "bg-emerald-50" },
          { icon: <ShieldAlert className="w-5 h-5 text-purple-500" />, label: "Security Level", val: "High", color: "bg-purple-50" }
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm rounded-[2rem] bg-white group hover:shadow-md transition-all">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 font-serif tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-[#2d2a3c] leading-none mt-1">{stat.val}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* STAFF DIRECTORY TABLE */}
      <Card className="border-0 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left p-6 lg:p-8 font-serif text-slate-400 font-bold uppercase text-[10px] tracking-widest">Team Member</th>
                  <th className="text-left p-6 lg:p-8 font-serif text-slate-400 font-bold uppercase text-[10px] tracking-widest">Assigned Role</th>
                  <th className="text-left p-6 lg:p-8 font-serif text-slate-400 font-bold uppercase text-[10px] tracking-widest">Digital ID</th>
                  <th className="text-right p-6 lg:p-8 font-serif text-slate-400 font-bold uppercase text-[10px] tracking-widest">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStaff.map((member, idx) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-6 lg:p-8">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-sm shadow-sm group-hover:scale-105 transition-all">
                          {getInitials(member.full_name)}
                        </div>
                        <div>
                          <p className="font-bold text-[#2d2a3c] text-lg leading-none mb-1">{member.full_name || member.username}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter italic">Employee ID: HQ-00{member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 lg:p-8">
                       {getRoleBadge(member.role)}
                    </td>
                    <td className="p-6 lg:p-8">
                      <div className="flex items-center text-slate-500 font-bold text-xs font-mono">
                        <Fingerprint className="w-3.5 h-3.5 mr-2 text-slate-300" />
                        {member.username}
                      </div>
                    </td>
                    <td className="p-6 lg:p-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md transition-all">
                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 p-2 shadow-2xl w-44">
                          <DropdownMenuItem
                            className="rounded-xl p-3 font-semibold text-slate-600 cursor-pointer"
                            onClick={() => {
                              setSelectedStaff(member);
                              setEditOpen(true);
                            }}
                          >
                            <Edit className="mr-3 h-4 w-4 text-indigo-500" />
                            Refine Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-xl p-3 font-semibold text-red-500 cursor-pointer hover:!bg-red-50"
                            onClick={() => handleDeleteStaff(member.id)}
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Revoke Access
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
        <DialogContent className="rounded-[2.5rem] sm:max-w-[480px] p-0 border-0 overflow-hidden shadow-2xl bg-white">
          <div className="bg-[#2d2a3c] p-8 text-white relative">
            <Edit className="absolute top-4 right-4 w-12 h-12 text-white/5" />
            <DialogTitle className="text-2xl font-serif font-extrabold mb-2 text-white">Adjust Permissions</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">Modify security roles and identity details for this team member.</DialogDescription>
          </div>
          {selectedStaff && (
            <div className="p-8 space-y-6">
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</Label>
                <Input
                  className="rounded-xl border-slate-100 bg-slate-50/50 p-6 font-semibold"
                  value={selectedStaff.full_name}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, full_name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Security Role</Label>
                <Select
                  value={selectedStaff.role}
                  onValueChange={(value) => setSelectedStaff({ ...selectedStaff, role: value })}
                >
                  <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 py-6">
                    <SelectValue placeholder="Update Privilege Level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 p-2">
                    <SelectItem value="super_admin" className="rounded-xl py-3 px-4 font-semibold text-purple-600 font-serif">Super Admin</SelectItem>
                    <SelectItem value="admin" className="rounded-xl py-3 px-4 font-semibold text-blue-600 font-serif">Administrator</SelectItem>
                    <SelectItem value="user_booking" className="rounded-xl py-3 px-4 font-semibold text-emerald-600 font-serif">Booking Desk</SelectItem>
                    <SelectItem value="user_ordering" className="rounded-xl py-3 px-4 font-semibold text-amber-600 font-serif">Dining Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#6450f1] text-white py-8 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-[#523ee0] transition-all transform active:scale-95" onClick={handleEditStaff}>
                Consolidate Profile
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}