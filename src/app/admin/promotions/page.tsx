import AdminHeader from "@/components/admin/AdminHeader";
import PromotionManager from "@/components/admin/PromotionManager";

export default function AdminPromotionsPage() {
  return (
    <>
      <AdminHeader
        title="Promotion management"
        description="Create and manage coupon codes and limited-time offers for your store."
      />
      <div className="p-6">
        <PromotionManager />
      </div>
    </>
  );
}
