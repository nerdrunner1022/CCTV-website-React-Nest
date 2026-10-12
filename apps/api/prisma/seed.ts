import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // ---- staff --------------------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin12345';

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      passwordHash: await argon2.hash(adminPassword),
      role: 'ADMIN',
    },
  });

  // ---- packages -----------------------------------------------------------
  const packages = [
    {
      slug: 'basic',
      name: 'Basic Kit',
      tier: 'BASIC',
      summary: 'Entry coverage for a small home or single room.',
      features: ['4 cameras', 'DVR + 500GB HDD', 'Installation', '1-year warranty'],
      cameraCount: 4,
      priceMin: 480,
      priceMax: 640,
      sort: 1,
    },
    {
      slug: 'recommended',
      name: 'Recommended Kit',
      tier: 'RECOMMENDED',
      summary: 'Best value for most homes, shops, and offices.',
      features: [
        '8 cameras',
        'NVR + 1TB HDD',
        'Remote mobile viewing',
        'Installation',
        '2-year warranty',
      ],
      cameraCount: 8,
      priceMin: 900,
      priceMax: 1250,
      sort: 2,
    },
    {
      slug: 'premium',
      name: 'Premium Kit',
      tier: 'PREMIUM',
      summary: 'Full coverage for larger sites and warehouses.',
      features: [
        '16+ cameras',
        'NVR + 4TB HDD',
        'Colour night vision',
        'Remote mobile viewing',
        'Priority support',
        '3-year warranty',
      ],
      cameraCount: 16,
      priceMin: 1900,
      priceMax: 2800,
      sort: 3,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }

  // ---- solutions ----------------------------------------------------------
  const solutions = [
    {
      slug: 'home',
      title: 'Home CCTV',
      summary: 'Protect your family and front door.',
      typicalCameras: '4–8 cameras',
      startingPrice: 480,
      sort: 1,
    },
    {
      slug: 'shops',
      title: 'Shops & Restaurants',
      summary: 'Watch tills, entrances, and stock.',
      typicalCameras: '6–12 cameras',
      startingPrice: 900,
      sort: 2,
    },
    {
      slug: 'offices',
      title: 'Offices',
      summary: 'Secure entrances, corridors, and server rooms.',
      typicalCameras: '8–16 cameras',
      startingPrice: 1250,
      sort: 3,
    },
    {
      slug: 'warehouses',
      title: 'Warehouses',
      summary: 'Cover large perimeters and loading bays.',
      typicalCameras: '16+ cameras',
      startingPrice: 1900,
      sort: 4,
    },
  ];

  for (const solution of solutions) {
    await prisma.solution.upsert({
      where: { slug: solution.slug },
      update: solution,
      create: solution,
    });
  }

  // ---- faqs ---------------------------------------------------------------
  const faqs = [
    {
      question: 'How many cameras does my home need?',
      answer:
        'Most homes need 4–6 cameras covering the front door, driveway, back garden, and any side access. Use our camera calculator for a quick estimate, then we confirm during a free survey.',
      category: 'Planning',
      sort: 1,
    },
    {
      question: 'DVR vs NVR — what is the difference?',
      answer:
        'A DVR works with analogue cameras and is usually cheaper. An NVR works with IP cameras, offers higher resolution, and scales better. We recommend based on your site and budget.',
      category: 'Hardware',
      sort: 2,
    },
    {
      question: 'Do you offer a free site survey?',
      answer:
        'Yes. Book a free survey and a technician will confirm the right cameras, cable routes, and a fixed quote before any work starts.',
      category: 'Service',
      sort: 3,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (existing) {
      await prisma.faq.update({ where: { id: existing.id }, data: faq });
    } else {
      await prisma.faq.create({ data: faq });
    }
  }

  // ---- testimonials -------------------------------------------------------
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          author: 'A. Customer',
          role: 'Homeowner',
          quote: 'Survey was quick and the quote was clear. Installed in a day.',
          rating: 5,
        },
        {
          author: 'B. Owner',
          role: 'Restaurant owner',
          quote: 'Now I can check the till and the door from my phone.',
          rating: 5,
        },
      ],
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
