import AdminHeader from "@/components/admin/AdminHeader";
import CategoryManager from "@/components/admin/CategoryManager";

export default function AdminCategoriesPage() {
  return (
    <>
      <AdminHeader
        title="Category management"
        description="Create and organize product categories for your store."
      />
      <div className="p-6">
        <CategoryManager />
      </div>
    </>
  );
}
