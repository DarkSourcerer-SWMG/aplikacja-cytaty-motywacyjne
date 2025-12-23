import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding quotes from ZenQuotes...");

  const res = await fetch("https://zenquotes.io/api/quotes");
  const quotes: { q: string; a: string }[] = await res.json();

  // optional default tag
  const defaultTag = await prisma.tag.upsert({
    where: { name: "motivation" },
    update: {},
    create: { name: "motivation" },
  });

  for (const quote of quotes) {
    // 1️⃣ upsert author
    const author = await prisma.author.upsert({
      where: { name: quote.a },
      update: {},
      create: { name: quote.a },
    });

    // 2️⃣ prevent duplicate quotes
    const existing = await prisma.quote.findFirst({
      where: { text: quote.q },
    });

    if (existing) continue;

    // 3️⃣ create quote
    await prisma.quote.create({
      data: {
        text: quote.q,
        language: "en",
        authorId: author.id,
        tags: {
          connect: { id: defaultTag.id },
        },
      },
    });
  }

  console.log("✅ ZenQuotes seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
