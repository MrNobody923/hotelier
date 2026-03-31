import CustomerLanding from "@/components/dashboard/CustomerLanding";
import SuperAdminOverview from "@/components/dashboard/SuperAdminOverview";
import NormalAdminOverview from "@/components/dashboard/NormalAdminOverview";

export default function Dashboard({ rooms, staff, restaurants, user, customers = [], bookings = [], onDashboardReserve, updateRoomStatus }) {
  if (user.role === "customer") {
    return <CustomerLanding onDashboardReserve={onDashboardReserve} />;
  }

  if (user.role === "super_admin") {
    return (
      <div className="space-y-6">
        <SuperAdminOverview user={user} rooms={rooms} bookings={bookings} updateRoomStatus={updateRoomStatus} />
      </div>
    );
  }

  // Fallback / standard admin view
  return (
    <NormalAdminOverview 
      user={user} 
      rooms={rooms} 
      staff={staff} 
      restaurants={restaurants} 
      customers={customers} 
      updateRoomStatus={updateRoomStatus}
    />
  );
}