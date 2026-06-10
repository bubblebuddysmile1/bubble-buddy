"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import { Download, FileText, Database, ShoppingCart, Package, Users } from "lucide-react";
import { useState } from "react";

export default function ExportReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (reportType: string, exportName: string, format: string = "csv") => {
    setLoading(exportName);
    try {
      const exportTypeMap: Record<string, string> = {
        "Daily Sales Report": "daily",
        "Monthly Sales Report": "monthly",
        "Yearly Sales Report": "yearly",
        "Custom Date Range": "custom",
        "Current Inventory": "current",
        "Low Stock Alert": "low-stock",
        "Stock Valuation": "valuation",
        "Inventory Movement": "movement",
        "Customer List": "all",
        "Customer Orders": "orders",
        "Customer Analytics": "analytics",
        "New Customers": "new",
        "Revenue Summary": "revenue",
        "Tax Report": "tax",
        "Profit & Loss": "profit",
        "Payment Methods": "payment",
        "Product Catalog": "catalog",
        "Best Sellers": "best-sellers",
        "Product Performance": "performance",
        "Category Analysis": "category",
      };

      const exportType = exportTypeMap[exportName] || "all";

      const response = await fetch("/admin/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          exportType,
          format,
        }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-${exportType}-${Date.now()}.${format === "excel" ? "xls" : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const reportTypes = [
    {
      title: "Sales Reports",
      reportType: "sales",
      description: "Export sales data including orders, revenue, and customer information.",
      icon: ShoppingCart,
      formats: ["CSV", "Excel"],
      availableExports: [
        { name: "Daily Sales Report", description: "Sales data for a specific day" },
        { name: "Monthly Sales Report", description: "Aggregated sales for a month" },
        { name: "Yearly Sales Report", description: "Annual sales summary" },
      ],
    },
    {
      title: "Inventory Reports",
      reportType: "inventory",
      description: "Export inventory data including stock levels, product details, and valuations.",
      icon: Package,
      formats: ["CSV", "Excel"],
      availableExports: [
        { name: "Current Inventory", description: "All products with current stock" },
        { name: "Low Stock Alert", description: "Products below threshold" },
      ],
    },
    {
      title: "Customer Reports",
      reportType: "customers",
      description: "Export customer data including demographics, order history, and insights.",
      icon: Users,
      formats: ["CSV", "Excel"],
      availableExports: [
        { name: "Customer List", description: "All registered customers" },
        { name: "New Customers", description: "Recently registered customers" },
      ],
    },
    {
      title: "Financial Reports",
      reportType: "financial",
      description: "Export financial data including revenue, expenses, and profit analysis.",
      icon: FileText,
      formats: ["CSV", "Excel"],
      availableExports: [
        { name: "Revenue Summary", description: "Total revenue breakdown" },
      ],
    },
    {
      title: "Product Reports",
      reportType: "products",
      description: "Export product data including performance, ratings, and sales metrics.",
      icon: Database,
      formats: ["CSV", "Excel"],
      availableExports: [
        { name: "Product Catalog", description: "Complete product list" },
        { name: "Best Sellers", description: "Top performing products" },
      ],
    },
  ];

  return (
    <>
      <AdminHeader
        title="Export Reports"
        description="Generate and download reports in various formats for analysis and record-keeping."
      />

      <div className="space-y-6 p-6">
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Available Reports</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a report type to view available export options and formats.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          {reportTypes.map((reportType) => {
            const Icon = reportType.icon;
            return (
              <section key={reportType.title} className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{reportType.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{reportType.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {reportType.formats.map((format) => (
                        <span
                          key={format}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Available Exports</h4>
                  {reportType.availableExports.map((exportOption) => (
                    <div
                      key={exportOption.name}
                      className="flex items-center justify-between rounded-3xl bg-background/80 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{exportOption.name}</p>
                        <p className="text-xs text-muted-foreground">{exportOption.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {reportType.formats.map((format) => (
                          <button
                            key={format}
                            onClick={() => handleExport(reportType.reportType, exportOption.name, format.toLowerCase())}
                            disabled={loading === exportOption.name}
                            className="flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading === exportOption.name ? (
                              <>
                                <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                Exporting...
                              </>
                            ) : (
                              <>
                                <Download className="size-3" />
                                {format}
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-foreground">Export History</h2>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Your recent export history will appear here. This feature tracks all reports you've downloaded
              for easy access and audit purposes.
            </p>
            <div className="mt-4 rounded-3xl bg-background/80 px-4 py-8 text-center">
              <Download className="mx-auto size-12 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">No exports yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Your export history will appear here</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
