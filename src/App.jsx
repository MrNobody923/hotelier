import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BedDouble, Utensils, Users, LayoutDashboard } from "lucide-react";
import Dashboard from "@/pages/Dashboard";
import Rooms from "@/pages/Rooms";
import Restaurant from "@/pages/Restaurant";
import Staff from "@/pages/Staff";
import Customers from "@/pages/Customers";

const API_BASE_URL = "http://localhost:8000";

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [menu, setMenu] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [staff, setStaff] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);

  // Real User State starts as null or from localStorage to persist after refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    role: "customer", // Default role for users/customers
  });
  const [formData, setFormData] = useState({
    guest_name: "",
    check_in: "",
    check_out: "",
  });
  const [newRoomData, setNewRoomData] = useState({
    number: "",
    type: "Standard",
    price: "",
  });
  const [isCreateRoomOpen, setCreateRoomOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchMenu();
    fetchRestaurants();
    fetchStaff();
    fetchCustomers();
    fetchBookings();
    fetchFoodOrders();

    // 🚀 REAL-TIME ENGINE: Poll for dynamic data every 5 seconds
    const syncInterval = setInterval(() => {
      fetchFoodOrders();
      fetchBookings();
      fetchRooms();
    }, 5000);

    return () => clearInterval(syncInterval);
  }, []);

  const fetchRooms = () => {
    axios.get(`${API_BASE_URL}/get_rooms.php`)
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("Error fetching rooms:", err));
  };

  const fetchRestaurants = () => {
    axios.get(`${API_BASE_URL}/get_restaurants.php`)
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error("Error fetching restaurants:", err));
  };

  const fetchStaff = () => {
    axios.get(`${API_BASE_URL}/get_staff.php`)
      .then((res) => setStaff(res.data))
      .catch((err) => console.error("Error fetching staff:", err));
  };

  const fetchCustomers = () => {
    axios.get(`${API_BASE_URL}/get_customers.php`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Error fetching customers:", err));
  };

  const fetchBookings = () => {
    axios.get(`${API_BASE_URL}/get_bookings.php`)
      .then((res) => {
        if (Array.isArray(res.data)) setBookings(res.data);
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  };

  const fetchFoodOrders = () => {
    axios.get(`${API_BASE_URL}/get_orders.php`)
      .then((res) => {
        if (res.data.error) {
           console.error("Order fetch error:", res.data.error);
           toast.error(res.data.error);
        } else if (Array.isArray(res.data)) {
           setFoodOrders(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching food orders:", err);
        toast.error("Failed to fetch food orders");
      });
  };

  const fetchMenu = () => {
    axios.get(`${API_BASE_URL}/get_menu.php`)
      .then((res) => {
        if (Array.isArray(res.data)) setMenu(res.data);
        else console.error("API Error: Response is not an array.", res.data);
      })
      .catch((err) => console.error("Error fetching menu:", err));
  };

  const handleCreateMenuItem = (itemData) => {
    axios.post(`${API_BASE_URL}/create_menu_item.php`, itemData)
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(`Item "${itemData.item_name}" added to menu!`);
          fetchMenu();
        } else {
          toast.error(res.data.message || "Failed to add item");
        }
      })
      .catch((err) => {
        console.error("Error adding menu item:", err);
        toast.error("Network error adding menu item");
      });
  };

  const handleEditMenuItem = (itemData) => {
    axios.post(`${API_BASE_URL}/edit_menu_item.php`, itemData)
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(`Item "${itemData.item_name}" updated!`);
          fetchMenu();
        } else {
          toast.error(res.data.message || "Failed to update item");
        }
      })
      .catch((err) => {
        console.error("Error updating menu item:", err);
        toast.error("Network error updating menu item");
      });
  };

  const handleDeleteMenuItem = (itemId) => {
    axios.post(`${API_BASE_URL}/delete_menu_item.php`, { id: itemId })
      .then(() => {
        toast.success("Item removed from menu.");
        fetchMenu();
      })
      .catch((err) => {
        console.error("Error deleting menu item:", err);
        toast.error("Error deleting menu item");
      });
  };

  // Handle the Login request to PHP
  const handleLogin = () => {
    axios
      .post(`${API_BASE_URL}/login.php`, loginForm)
      .then((res) => {
        if (res.data.status === "success") {
          const userData = res.data.user;
          setUser(userData); 
          localStorage.setItem("loggedInUser", JSON.stringify(userData));
          toast.success("Logged in successfully");
        } else {
          toast.error(res.data.message); // Shows "Invalid credentials" if wrong
        }
      })
      .catch((err) => {
        console.error("Error logging in:", err);
        toast.error("Error logging in");
      });
  };

  // Handle Create Account request
  const handleRegister = () => {
    axios
      .post(`${API_BASE_URL}/register.php`, registerForm)
      .then((res) => {
        if (res.data.status === "success") {
          toast.success("Account created successfully! You can now login.");
          setIsRegistering(false); // Switch back to login view
        } else {
          toast.error(res.data.message || "Failed to create account.");
        }
      })
      .catch((err) => {
        console.error("Error creating account:", err);
        toast.error(err.response?.data?.error || "Failed to create account.");
      });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    axios
      .post(`${API_BASE_URL}/update_order_status.php`, { id: orderId, status: newStatus })
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(`Order #${orderId} updated to ${newStatus}`);
          fetchFoodOrders(); // Refresh local list
        } else {
          toast.error(res.data.message || "Failed to update order status");
        }
      })
      .catch((err) => {
        console.error("Error updating order status:", err);
        toast.error("Failed to update order status");
      });
  };

  const handleOrder = (orderData) => {
    if (!orderData || !orderData.room_number) return; 

    axios
      .post(`${API_BASE_URL}/place_order.php`, orderData)
      .then(() => {
        toast.success(`Order for ${orderData.quantity || 1}x ${orderData.item_name} sent to Room ${orderData.room_number}! Kitchen notified.`);
        fetchFoodOrders(); // Refresh orders after placing one
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        toast.error("Error placing order");
      });
  };

  const handleBooking = (roomId) => {
    const bookingPayload = {
      ...formData,
      guest_name: user?.role === 'customer' ? user.full_name : formData.guest_name,
      room_id: roomId,
    };
    axios
      .post(`${API_BASE_URL}/make_reservation.php`, bookingPayload)
      .then(() => {
        toast.success("Room Reserved and Status Updated!");
        updateRoomStatus(roomId, "Occupied");
      })
      .catch((err) => {
        console.error("Error making reservation:", err);
        toast.error("Error making reservation");
      });
  };

  const handleDashboardReserve = async (checkIn, checkOut) => {
    const availableRoom = rooms.find(r => r.status === "Available");
    if (!availableRoom) {
      toast.error("Sorry, no rooms are currently available!");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/make_reservation.php`, {
        guest_name: user?.full_name || "Guest Customer",
        check_in: checkIn,
        check_out: checkOut,
        room_id: availableRoom.id,
      });
      toast.success(`Successfully reserved Room ${availableRoom.number}!`);
      setRooms(rooms.map(room => room.id === availableRoom.id ? { ...room, status: "Occupied" } : room));
      fetchBookings();
    } catch (err) {
      console.error("Dashboard Reserve Error:", err);
      toast.error("Failed to make dashboard reservation.");
    }
  };

  const updateRoomStatus = (roomId, newStatus) => {
    axios
      .post(`${API_BASE_URL}/update_room_status.php`, {
        id: roomId,
        status: newStatus,
      })
      .then(() => {
        setRooms(
          rooms.map((room) =>
            room.id === roomId ? { ...room, status: newStatus } : room
          )
        );
        toast.success(`Room status updated to ${newStatus}`);
      })
      .catch((err) => {
        console.error("Error updating status:", err);
        toast.error("Failed to update room status");
      });
  };

  const handleEditRoom = (roomData) => {
    axios
      .post(`${API_BASE_URL}/edit_room.php`, roomData)
      .then(() => {
        setRooms(rooms.map(r => r.id === roomData.id ? { ...r, ...roomData } : r));
        fetchRooms();
        toast.success(`Room ${roomData.number} updated successfully`);
      })
      .catch((err) => {
        console.error("Error editing room:", err);
        toast.error("Failed to update room");
      });
  };

  const handleCreateRoom = () => {
    if (!newRoomData.number || !newRoomData.type) {
      toast.error("Please fill in all fields for the new room.");
      return;
    }

    axios
      .post(`${API_BASE_URL}/create_room.php`, {
        number: newRoomData.number,
        type: newRoomData.type,
        price: newRoomData.price,
        status: "Available",
      })
      .then((res) => {
        const newRoom = {
          id: res.data.id || (rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1),
          number: parseInt(newRoomData.number),
          status: "Available",
          type: newRoomData.type,
          price: newRoomData.price,
        };
        setRooms([...rooms, newRoom]);
        setCreateRoomOpen(false);
        setNewRoomData({ number: "", type: "Standard", price: "" });
        toast.success("Room created successfully!");
      })
      .catch((err) => {
        console.error("Backend Error:", err.response?.data || err);
        toast.error(err.response?.data?.message || "Error creating room. Check console.");
      });
  };

  const addStaff = (newStaff) => {
    setStaff([...staff, newStaff]);
  };

  
  // VIEW 1: THE LOGIN SCREEN (If not logged in)

  if (!user) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Card className="w-[350px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {isRegistering ? "Create Account" : "Hi! Welcome"}
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              {isRegistering
                ? "Fill in the details below"
                : "Please Login to continue"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isRegistering ? (
              <>
                <input
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  placeholder="Full Name"
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, full_name: e.target.value })
                  }
                />
                <input
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  type="email"
                  placeholder="Email"
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                />
                <input
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  placeholder="Username"
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, username: e.target.value })
                  }
                />
                <input
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                />
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleRegister}
                >
                  Create Account
                </Button>
                <div className="text-center mt-4">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setIsRegistering(false)}
                  >
                    Already have an account? Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  placeholder="Username"
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                />
                <input
                  className="w-full p-2 border rounded focus:outline-blue-500"
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleLogin}
                >
                  Secure Login
                </Button>
                <div className="text-center mt-4">
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setIsRegistering(true)}
                  >
                    Don't have an account? Create one
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      </>
    );
  }

    // VIEW 2: THE MAIN DASHBOARD (If logged in)
 
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-slate-50 p-8">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Hotel Central Hub
          </h1>
          <p className="text-slate-500">
            Logged in as:{" "}
            <span className="font-semibold text-blue-600">
              {user.full_name} ({user.role})
            </span>
          </p>
        </div>
        {/* Logout button now clears the user state and localStorage */}
        <Button variant="outline" onClick={() => {
          setUser(null);
          localStorage.removeItem("loggedInUser");
        }}>
          Logout
        </Button>
      </header>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* ROLE-BASED SIDEBAR / TAB LIST */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8 shadow-sm">
            {/* Everyone can see the Dashboard */}
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </TabsTrigger>

            {/* Guests and Staff see Rooms */}
            {(user.role === "super_admin" ||
              user.role === "admin" ||
              user.role === "user_booking" ||
              user.role === "customer") && (
              <TabsTrigger value="rooms">
                <BedDouble className="mr-2 h-4 w-4" /> Rooms
              </TabsTrigger>
            )}

            {/* Guests and Staff see Food */}
            {(user.role === "super_admin" ||
              user.role === "admin" ||
              user.role === "user_ordering" ||
              user.role === "customer") && (
              <TabsTrigger value="food">
                <Utensils className="mr-2 h-4 w-4" /> Restaurant
              </TabsTrigger>
            )}

            {/* Only Super Admin sees User Management */}
            {user.role === "super_admin" && (
              <>
                <TabsTrigger value="staff">
                  <Users className="mr-2 h-4 w-4" /> Staff
                </TabsTrigger>
                <TabsTrigger value="customers">
                  <Users className="mr-2 h-4 w-4" /> Guests
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard
              rooms={rooms}
              staff={staff}
              restaurants={restaurants}
              user={user}
              customers={customers}
              bookings={bookings}
              onDashboardReserve={handleDashboardReserve}
              updateRoomStatus={updateRoomStatus}
            />
          </TabsContent>

          <TabsContent value="rooms">
            <Rooms
              rooms={rooms}
              user={user}
              handleBooking={handleBooking}
              updateRoomStatus={updateRoomStatus}
              handleEditRoom={handleEditRoom}
              handleCreateRoom={handleCreateRoom}
              isCreateRoomOpen={isCreateRoomOpen}
              setCreateRoomOpen={setCreateRoomOpen}
              newRoomData={newRoomData}
              setNewRoomData={setNewRoomData}
              formData={formData}
              setFormData={setFormData}
            />
          </TabsContent>

          {/* FOOD CONTENT */}
          <TabsContent value="food">
            <Restaurant 
              menu={menu} 
              handleOrder={handleOrder} 
              handleUpdateOrderStatus={handleUpdateOrderStatus}
              user={user} 
              orders={foodOrders}
              rooms={rooms}
              bookings={bookings}
              handleCreateMenuItem={handleCreateMenuItem}
              handleEditMenuItem={handleEditMenuItem}
              handleDeleteMenuItem={handleDeleteMenuItem}
            />
          </TabsContent>

          <TabsContent value="staff">
            <Staff staff={staff} addStaff={addStaff} setStaff={setStaff} />
          </TabsContent>

          <TabsContent value="customers">
            <Customers customers={customers} setCustomers={setCustomers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
}