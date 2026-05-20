const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.promotion.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      title: "Welcome Offer",
      description: "Get 10% off on your first order.",
      discountType: "PERCENTAGE",
      discountValue: 10.0,
      minOrderAmount: 0,
      activeFrom: new Date(),
      isActive: true,
    },
  });

  const categories = [
    { name: "Skin Care", slug: "skin-care", description: "Cleansers, serums & moisturizers." },
    { name: "Hair Care", slug: "hair-care", description: "Nourishing shampoos, conditioners & treatments." },
    { name: "Beauty", slug: "beauty", description: "Makeup, glow products, and finishing touches." },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
  }

  const skinCare = await prisma.category.findUnique({ where: { slug: "skin-care" } });
  const hairCare = await prisma.category.findUnique({ where: { slug: "hair-care" } });
  const beauty = await prisma.category.findUnique({ where: { slug: "beauty" } });

  await prisma.product.upsert({
    where: { sku: "BB-SKIN-001" },
    update: {},
    create: {
      sku: "BB-SKIN-001",
      name: "Glow Serum",
      slug: "glow-serum",
      description: "A lightweight serum for hydration, brightening, and smooth skin.",
      price: 28.0,
      compareAtPrice: 35.0,
      currency: "USD",
      stockQuantity: 120,
      featured: true,
      categoryId: skinCare.id,
      thumbnail: "/category/1.jpg",
      images: {
        create: [{ url: "/category/1.jpg", altText: "Glow Serum" }],
      },
    },
  });

  await prisma.product.upsert({
    where: { sku: "BB-HAIR-001" },
    update: {},
    create: {
      sku: "BB-HAIR-001",
      name: "Nourishing Shampoo",
      slug: "nourishing-shampoo",
      description: "A gentle shampoo that restores shine and body.",
      price: 22.0,
      currency: "USD",
      stockQuantity: 90,
      featured: true,
      categoryId: hairCare.id,
      thumbnail: "/category/2.jpg",
      images: {
        create: [{ url: "/category/2.jpg", altText: "Nourishing Shampoo" }],
      },
    },
  });

  await prisma.product.upsert({
    where: { sku: "BB-BEAUTY-001" },
    update: {},
    create: {
      sku: "BB-BEAUTY-001",
      name: "Radiant Lip Tint",
      slug: "radiant-lip-tint",
      description: "Buildable color with hydrating finish.",
      price: 18.0,
      currency: "USD",
      stockQuantity: 150,
      featured: false,
      categoryId: beauty.id,
      thumbnail: "/category/3.jpg",
      images: {
        create: [{ url: "/category/3.jpg", altText: "Radiant Lip Tint" }],
      },
    },
  });

  console.log("Seed data created successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
