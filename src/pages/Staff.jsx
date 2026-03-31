import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      toast.error("Please fill in all fields for the new staff member.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/register.php', {
        full_name: newStaffData.full_name,
        email: newStaffData.email,
        username: newStaffData.username,
        password: newStaffData.password,
        role: newStaffData.role,
      });

      const data = response.data;
      if (data.status === "success") {
        toast.success('User successfully created!');
        const newStaff = {
          id: staff.length > 0 ? Math.max(...staff.map((s) => s.id)) + 1 : 1,
          full_name: newStaffData.full_name,
          email: newStaffData.email,
          username: newStaffData.username,
          role: newStaffData.role,
        };
        addStaff(newStaff);
        setCreateOpen(false);
        setNewStaffData({ full_name: "", email: "", username: "", password: "", role: "user_booking" });
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error(error.response?.data?.message || "Network error. Ensure register.php exists.");
    }
  };

  const handleEditStaff = async () => {
    if (!selectedStaff) return;

    try {
      const response = await axios.post('http://localhost:8000/edit_user.php', selectedStaff);
      const data = response.data;

      if (data.status === "success") {
        setStaff(
          staff.map((member) =>
            member.id === selectedStaff.id ? selectedStaff : member
          )
        );
        setEditOpen(false);
        setSelectedStaff(null);
        toast.success("Staff member updated successfully.");
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error.response?.data?.message || "Network error. Ensure edit_user.php exists.");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        const response = await axios.post('http://localhost:8000/delete_user.php', { id: staffId });
        const data = response.data;

        if (data.status === "success") {
          // Remove from UI state only after successful database deletion
          setStaff(staff.filter((member) => member.id !== staffId));
          console.log(`SUCCESS: Staff member with ID ${staffId} was deleted.`);
          toast.success("Staff member deleted successfully.");
        } else {
          toast.error(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error(error.response?.data?.message || "Network error. Ensure delete_user.php exists in your hotel-api folder!");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Staff Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="transition-transform duration-300 ease-in-out hover:scale-105">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="staff-fullname-create">Full Name</Label>
                  <Input
                    id="staff-fullname-create"
                    value={newStaffData.full_name}
                    onChange={(e) =>
                      setNewStaffData({
                        ...newStaffData,
                        full_name: e.target.value,
                      })
                    }
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="staff-email-create">Email Address</Label>
                  <Input
                    id="staff-email-create"
                    type="email"
                    value={newStaffData.email}
                    onChange={(e) =>
                      setNewStaffData({
                        ...newStaffData,
                        email: e.target.value,
                      })
                    }
                    placeholder="e.g., john@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="staff-username-create">Username</Label>
                  <Input
                    id="staff-username-create"
                    value={newStaffData.username}
                    onChange={(e) =>
                      setNewStaffData({
                        ...newStaffData,
                        username: e.target.value,
                      })
                    }
                    placeholder="e.g., johndoe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="staff-password-create">Password</Label>
                  <Input
                    id="staff-password-create"
                    type="password"
                    value={newStaffData.password}
                    onChange={(e) =>
                      setNewStaffData({
                        ...newStaffData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="staff-role-create">Role</Label>
                  <Select
                    value={newStaffData.role}
                    onValueChange={(value) =>
                      setNewStaffData({ ...newStaffData, role: value })
                    }
                  >
                    <SelectTrigger id="staff-role-create">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user_booking">
                        Booking Staff
                      </SelectItem>
                      <SelectItem value="user_ordering">
                        Restaurant Staff
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleCreateStaff}>
                  Save Staff Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((member) => (
                <tr
                  key={member.id}
                  className="border-b hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="p-4">{member.full_name || member.username}</td>
                  <td className="p-4 capitalize">
                    {member.role.replace(/_/g, " ")}
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedStaff(member);
                            setEditOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteStaff(member.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {selectedStaff && (
            <div className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="staff-name-edit">Full Name</Label>
                <Input
                  id="staff-name-edit"
                  value={selectedStaff.full_name}
                  onChange={(e) =>
                    setSelectedStaff({
                      ...selectedStaff,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="staff-role-edit">Role</Label>
                <Select
                  value={selectedStaff.role}
                  onValueChange={(value) =>
                    setSelectedStaff({ ...selectedStaff, role: value })
                  }
                >
                  <SelectTrigger id="staff-role-edit">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user_booking">Booking Staff</SelectItem>
                    <SelectItem value="user_ordering">
                      Restaurant Staff
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleEditStaff}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}