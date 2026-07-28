import AdminHeader from "@/components/admin/AdminHeader";
import BlogManager from "@/components/admin/BlogManager";

export default function AdminBlogsPage() {
  return (
    <>
      <AdminHeader
        title="Blog management"
        description="Create SEO-friendly blog posts with rich content, FAQ, and metadata."
      />
      <div className="p-6">
        <BlogManager />
      </div>
    </>
  );
}
