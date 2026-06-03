import AdminHeader from "@/components/admin/AdminHeader";
import ReviewManager from "@/components/admin/ReviewManager";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminReviewsPage() {
  const session = await requireAdminSession("/admin/reviews");

  return (
    <div>
      <AdminHeader title="Reviews" description="Moderate and review customer feedback." />
      <div className="mt-6">
        {/* Client component handles fetching and moderation */}
        <ReviewManager />
      </div>
    </div>
  );
}
