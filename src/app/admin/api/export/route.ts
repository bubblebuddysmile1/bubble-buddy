import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportType, exportType, format } = body;

    let data: any[] = [];
    let filename = "";

    switch (reportType) {
      case "sales":
        data = await getSalesData(exportType);
        filename = `sales-${exportType}-${Date.now()}`;
        break;
      case "inventory":
        data = await getInventoryData(exportType);
        filename = `inventory-${exportType}-${Date.now()}`;
        break;
      case "customers":
        data = await getCustomerData(exportType);
        filename = `customers-${exportType}-${Date.now()}`;
        break;
      case "financial":
        data = await getFinancialData(exportType);
        filename = `financial-${exportType}-${Date.now()}`;
        break;
      case "products":
        data = await getProductData(exportType);
        filename = `products-${exportType}-${Date.now()}`;
        break;
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    if (format === "csv") {
      const csv = convertToCSV(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
        },
      });
    } else if (format === "excel") {
      const csv = convertToCSV(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "application/vnd.ms-excel",
          "Content-Disposition": `attachment; filename="${filename}.xls"`,
        },
      });
    } else if (format === "json") {
      return NextResponse.json(data, {
        headers: {
          "Content-Disposition": `attachment; filename="${filename}.json"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

async function getSalesData(exportType: string) {
  const where: any = { paymentStatus: "PAID" };
  
  if (exportType === "daily") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    where.placedAt = { gte: today };
  } else if (exportType === "monthly") {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    where.placedAt = { gte: thisMonth };
  } else if (exportType === "yearly") {
    const thisYear = new Date();
    thisYear.setMonth(0, 1);
    thisYear.setHours(0, 0, 0, 0);
    where.placedAt = { gte: thisYear };
  }

  const orders = await prisma.order.findMany({
    where,
    select: {
      orderNumber: true,
      totalAmount: true,
      taxAmount: true,
      shippingAmount: true,
      discountAmount: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      placedAt: true,
      user: { select: { email: true, name: true } },
    },
    orderBy: { placedAt: "desc" },
  });

  return orders.map((order) => ({
    "Order Number": order.orderNumber,
    "Customer Name": order.user?.name || "Guest",
    "Customer Email": order.user?.email || "N/A",
    "Total Amount": order.totalAmount.toString(),
    "Tax Amount": order.taxAmount.toString(),
    "Shipping Amount": order.shippingAmount.toString(),
    "Discount Amount": order.discountAmount.toString(),
    "Status": order.status,
    "Payment Status": order.paymentStatus,
    "Payment Method": order.paymentMethod || "N/A",
    "Order Date": order.placedAt?.toISOString() || "N/A",
  }));
}

async function getInventoryData(exportType: string) {
  const products = await prisma.product.findMany({
    select: {
      name: true,
      sku: true,
      price: true,
      stockQuantity: true,
      isActive: true,
      featured: true,
      averageRating: true,
      reviewCount: true,
      category: { select: { name: true } },
      createdAt: true,
    },
    orderBy: { stockQuantity: "asc" },
  });

  let filteredProducts = products;
  
  if (exportType === "low-stock") {
    filteredProducts = products.filter((p) => p.stockQuantity <= 10);
  } else if (exportType === "out-of-stock") {
    filteredProducts = products.filter((p) => p.stockQuantity === 0);
  }

  return filteredProducts.map((product) => ({
    "Product Name": product.name,
    "SKU": product.sku,
    "Category": product.category?.name || "N/A",
    "Price": product.price.toString(),
    "Stock Quantity": product.stockQuantity,
    "Stock Value": (product.price.toNumber() * product.stockQuantity).toFixed(2),
    "Active": product.isActive ? "Yes" : "No",
    "Featured": product.featured ? "Yes" : "No",
    "Average Rating": product.averageRating || 0,
    "Review Count": product.reviewCount,
    "Created Date": product.createdAt.toISOString(),
  }));
}

async function getCustomerData(exportType: string) {
  const where: any = { role: "CUSTOMER" };
  
  if (exportType === "new") {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    where.createdAt = { gte: thirtyDaysAgo };
  }

  const customers = await prisma.user.findMany({
    where,
    select: {
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      orders: {
        select: {
          totalAmount: true,
          status: true,
          placedAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return customers.map((customer) => {
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalAmount.toNumber(), 0);
    const orderCount = customer.orders.length;
    
    return {
      "Customer Name": customer.name || "N/A",
      "Email": customer.email,
      "Phone": customer.phone || "N/A",
      "Role": customer.role,
      "Total Orders": orderCount,
      "Total Spent": totalSpent.toFixed(2),
      "Average Order Value": orderCount > 0 ? (totalSpent / orderCount).toFixed(2) : "0.00",
      "Registration Date": customer.createdAt.toISOString(),
    };
  });
}

async function getFinancialData(exportType: string) {
  const orders = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
    select: {
      totalAmount: true,
      taxAmount: true,
      shippingAmount: true,
      discountAmount: true,
      paymentMethod: true,
      status: true,
      placedAt: true,
    },
    orderBy: { placedAt: "desc" },
  });

  if (exportType === "revenue") {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount.toNumber(), 0);
    const totalTax = orders.reduce((sum, order) => sum + order.taxAmount.toNumber(), 0);
    const totalShipping = orders.reduce((sum, order) => sum + order.shippingAmount.toNumber(), 0);
    const totalDiscounts = orders.reduce((sum, order) => sum + order.discountAmount.toNumber(), 0);
    const netRevenue = totalRevenue - totalTax - totalShipping + totalDiscounts;

    return [
      {
        "Metric": "Total Revenue",
        "Value": totalRevenue.toFixed(2),
      },
      {
        "Metric": "Total Tax",
        "Value": totalTax.toFixed(2),
      },
      {
        "Metric": "Total Shipping",
        "Value": totalShipping.toFixed(2),
      },
      {
        "Metric": "Total Discounts",
        "Value": totalDiscounts.toFixed(2),
      },
      {
        "Metric": "Net Revenue",
        "Value": netRevenue.toFixed(2),
      },
    ];
  }

  return orders.map((order) => ({
    "Total Amount": order.totalAmount.toString(),
    "Tax Amount": order.taxAmount.toString(),
    "Shipping Amount": order.shippingAmount.toString(),
    "Discount Amount": order.discountAmount.toString(),
    "Payment Method": order.paymentMethod || "N/A",
    "Status": order.status,
    "Date": order.placedAt?.toISOString() || "N/A",
  }));
}

async function getProductData(exportType: string) {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      stockQuantity: true,
      isActive: true,
      featured: true,
      averageRating: true,
      reviewCount: true,
      description: true,
      category: { select: { name: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (exportType === "best-sellers") {
    const bestSelling = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    const productIds = bestSelling.map((item) => item.productId);
    const topProducts = products.filter((p) => productIds.includes(p.id));
    
    const productsMap = new Map(topProducts.map((p) => [p.id, p]));
    
    return bestSelling.map((item) => {
      const product = productsMap.get(item.productId);
      return {
        "Product Name": product?.name || "Unknown",
        "SKU": product?.sku || "N/A",
        "Category": product?.category?.name || "N/A",
        "Price": product?.price.toString() || "0",
        "Quantity Sold": item._sum.quantity || 0,
        "Total Revenue": (item._sum.totalPrice?.toNumber() || 0).toFixed(2),
      };
    });
  }

  return products.map((product) => ({
    "Product Name": product.name,
    "SKU": product.sku,
    "Slug": product.slug,
    "Category": product.category?.name || "N/A",
    "Price": product.price.toString(),
    "Compare At Price": product.compareAtPrice?.toString() || "N/A",
    "Stock Quantity": product.stockQuantity,
    "Active": product.isActive ? "Yes" : "No",
    "Featured": product.featured ? "Yes" : "No",
    "Average Rating": product.averageRating || 0,
    "Review Count": product.reviewCount,
    "Description": product.description?.substring(0, 100) || "N/A",
    "Created Date": product.createdAt.toISOString(),
  }));
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}
