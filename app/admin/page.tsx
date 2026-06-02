import { getMatches } from "@/lib/actions/match";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  // Fetch matches from the server
  const matches = await getMatches();

  return <AdminDashboard initialMatches={matches} />;
}
