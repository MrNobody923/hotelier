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
import { Search, PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      toast.error("Please fill in all fields for the new customer.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/register.php', {
        full_name: newCustomerData.full_name,
        email: newCustomerData.email,
        username: newCustomerData.username,
        password: newCustomerData.password,
        role: "customer",
      });

      const data = response.data;
      if (data.status === "success") {
        toast.success('Customer successfully created!');
        const newCustomer = {
          id: customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
          full_name: newCustomerData.full_name,
          email: newCustomerData.email,
          username: newCustomerData.username,
          role: "customer",
        };
        setCustomers([...customers, newCustomer]);
        setCreateOpen(false);
        setNewCustomerData({ full_name: "", email: "", username: "", password: "", role: "customer" });
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to add customer:", error);
      toast.error(error.response?.data?.message || "Network error. Ensure register.php exists.");
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await axios.post('http://localhost:8000/edit_user.php', selectedCustomer);
      const data = response.data;

      if (data.status === "success") {
        setCustomers(
          customers.map((customer) =>
            customer.id === selectedCustomer.id ? selectedCustomer : customer
          )
        );
        setEditOpen(false);
        setSelectedCustomer(null);
        toast.success("Customer updated successfully.");
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error(error.response?.data?.message || "Network error. Ensure edit_user.php exists.");
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const response = await axios.post('http://localhost:8000/delete_user.php', { id: customerId });
        const data = response.data;

        if (data.status === "success") {
          setCustomers(customers.filter((customer) => customer.id !== customerId));
          console.log(`SUCCESS: Customer with ID ${customerId} was deleted.`);
          toast.success("Customer deleted successfully.");
        } else {
          toast.error(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Failed to delete customer:", error);
        toast.error(error.response?.data?.message || "Network error. Ensure delete_user.php exists in your hotel-api folder!");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Guest Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="transition-transform duration-300 ease-in-out hover:scale-105">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer-fullname-create">Full Name</Label>
                  <Input
                    id="customer-fullname-create"
                    value={newCustomerData.full_name}
                    onChange={(e) =>
                      setNewCustomerData({
                        ...newCustomerData,
                        full_name: e.target.value,
                      })
                    }
                    placeholder="e.g., Jane Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer-email-create">Email Address</Label>
                  <Input
                    id="customer-email-create"
                    type="email"
                    value={newCustomerData.email}
                    onChange={(e) =>
                      setNewCustomerData({
                        ...newCustomerData,
                        email: e.target.value,
                      })
                    }
                    placeholder="e.g., jane@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer-username-create">Username</Label>
                  <Input
                    id="customer-username-create"
                    value={newCustomerData.username}
                    onChange={(e) =>
                      setNewCustomerData({
                        ...newCustomerData,
                        username: e.target.value,
                      })
                    }
                    placeholder="e.g., janedoe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer-password-create">Password</Label>
                  <Input
                    id="customer-password-create"
                    type="password"
                    value={newCustomerData.password}
                    onChange={(e) =>
                      setNewCustomerData({
                        ...newCustomerData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter password"
                  />
                </div>
                <Button className="w-full" onClick={handleCreateCustomer}>
                  Save Guest
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
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Username</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="p-4">{customer.full_name}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.username}</td>
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
                            setSelectedCustomer(customer);
                            setEditOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCustomer(customer.id)}
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
            <DialogTitle>Edit Guest</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="customer-name-edit">Full Name</Label>
                <Input
                  id="customer-name-edit"
                  value={selectedCustomer.full_name}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer-email-edit">Email Address</Label>
                <Input
                  id="customer-email-edit"
                  type="email"
                  value={selectedCustomer.email}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer-username-edit">Username</Label>
                <Input
                  id="customer-username-edit"
                  value={selectedCustomer.username}
                  onChange={(e) =>
                    setSelectedCustomer({
                      ...selectedCustomer,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <Button className="w-full" onClick={handleEditCustomer}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}