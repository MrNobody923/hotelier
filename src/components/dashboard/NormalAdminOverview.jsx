import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Building,
  BedDouble,
  UserCheck,
  Users,
  CookingPot,
} from "lucide-react";

export default function NormalAdminOverview({ user, rooms = [], staff = [], restaurants = [], customers = [] }) {
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === "Available").length;
  const occupiedRooms = rooms.filter((room) => room.status === "Occupied").length;
  const totalStaff = staff.length;
  const totalCustomers = customers.length;
  const openRestaurants = restaurants.length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Hotel Staff Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-6">
        {(user.role === "admin" || user.role === "user_booking") && (
          <>
            <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{totalRooms}</div></CardContent>
            </Card>
            <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{availableRooms}</div></CardContent>
            </Card>
            <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{occupiedRooms}</div></CardContent>
            </Card>
          </>
        )}
        {user.role === "super_admin" && (
          <>
            <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{totalStaff}</div></CardContent>
            </Card>
            <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{totalCustomers}</div></CardContent>
            </Card>
          </>
        )}
        {(user.role === "super_admin" || user.role === "admin" || user.role === "user_ordering") && (
          <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Restaurants</CardTitle>
              <CookingPot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{openRestaurants}</div></CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
