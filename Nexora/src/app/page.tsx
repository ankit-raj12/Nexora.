import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryboyDashboard from "@/components/DeliveryboyDashboard";
import EditRoleMobile from "@/components/EditRoleMobile";
import Footer from "@/components/Footer";
import GeoUpdater from "@/components/GeoUpdater";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import connectDB from "@/lib/database";
import User from "@/models/user.model";
import { redirect } from "next/navigation";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const user = await User.findById(session?.user?.id).select("-password");
  if (!user) {
    redirect("/api/session-cleanup");
  }

  const incomplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");

  if (incomplete) {
    return <EditRoleMobile />;
  }
  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <>
      <Nav user={plainUser} currentPage="HomePage"/>
      <GeoUpdater userId={plainUser._id}/>
      {user.role === "user" ? (
        <UserDashboard />
      ) : user.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryboyDashboard />
      )}
      <Footer />
    </>
  );
}
