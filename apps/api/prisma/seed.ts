import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

/**
 * Image paths follow a convention so the frontend can render a placeholder until
 * a real file is dropped in. Put files under `apps/web/public/` matching these
 * paths and they appear automatically:
 *
 *   products     /images/products/<slug>.jpg
 *   packages     /images/packages/<slug>.jpg
 *   solutions    /images/solutions/<slug>.jpg
 *   projects     /images/projects/<slug>-before.jpg  /  -after.jpg
 *   blog         /images/blog/<slug>.jpg
 *   testimonials /images/testimonials/<slug>.jpg
 *   hero         /images/hero.jpg
 */
const img = {
  product: (slug: string) => `/images/products/${slug}.jpg`,
  package: (slug: string) => `/images/packages/${slug}.jpg`,
  solution: (slug: string) => `/images/solutions/${slug}.jpg`,
  projectBefore: (slug: string) => `/images/projects/${slug}-before.jpg`,
  projectAfter: (slug: string) => `/images/projects/${slug}-after.jpg`,
  blog: (slug: string) => `/images/blog/${slug}.jpg`,
  testimonial: (slug: string) => `/images/testimonials/${slug}.jpg`,
};

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

  // ---- product categories -------------------------------------------------
  const categories = [
    { slug: 'cameras', name: 'Security Cameras', sort: 1 },
    { slug: 'recorders', name: 'DVR & NVR Recorders', sort: 2 },
    { slug: 'storage', name: 'Hard Drives & Storage', sort: 3 },
    { slug: 'monitors', name: 'Monitors & Displays', sort: 4 },
    { slug: 'doorbells', name: 'Video Doorbells & Intercoms', sort: 5 },
    { slug: 'networking', name: 'Networking & PoE', sort: 6 },
    { slug: 'power', name: 'Power & Cabling', sort: 7 },
    { slug: 'accessories', name: 'Mounts & Accessories', sort: 8 },
  ];

  for (const category of categories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  // ---- products -----------------------------------------------------------
  type SeedProduct = {
    slug: string;
    name: string;
    sku: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    isQuoteOnly?: boolean;
    specs: Record<string, string>;
  };

  const products: SeedProduct[] = [
    // Cameras
    {
      slug: 'bullet-4mp-poe',
      name: '4MP Bullet IP Camera (PoE)',
      sku: 'CAM-BUL-4MP',
      description:
        'A dependable outdoor bullet camera for driveways, gates and perimeters. Powered over Ethernet for a single-cable install.',
      category: 'cameras',
      price: 89,
      stock: 42,
      specs: {
        Resolution: '4MP (2560 × 1440)',
        Lens: '2.8mm fixed',
        'Night vision': '30m infrared',
        'Weather rating': 'IP67',
        Connectivity: 'PoE (802.3af)',
        'Field of view': '104° horizontal',
      },
    },
    {
      slug: 'dome-4mp-poe',
      name: '4MP Turret Dome IP Camera',
      sku: 'CAM-DOM-4MP',
      description:
        'Discreet vandal-resistant turret dome with wide coverage — ideal for doorways, corridors and shop floors.',
      category: 'cameras',
      price: 95,
      stock: 38,
      specs: {
        Resolution: '4MP (2560 × 1440)',
        Lens: '2.8mm fixed',
        'Night vision': '30m infrared',
        'Weather rating': 'IP67 / IK10',
        Connectivity: 'PoE (802.3af)',
        'Field of view': '112° horizontal',
      },
    },
    {
      slug: 'dome-8mp-4k',
      name: '8MP 4K Dome IP Camera',
      sku: 'CAM-DOM-8MP',
      description:
        'Sharp 4K detail for reading plates and faces. Great for entrances where identification matters.',
      category: 'cameras',
      price: 149,
      stock: 24,
      specs: {
        Resolution: '8MP 4K (3840 × 2160)',
        Lens: '2.8mm fixed',
        'Night vision': '30m infrared',
        'Weather rating': 'IP67',
        Connectivity: 'PoE (802.3af)',
        'Smart features': 'Human & vehicle detection',
      },
    },
    {
      slug: 'bullet-8mp-colorvu',
      name: '8MP 4K Bullet Camera (Colour Night Vision)',
      sku: 'CAM-BUL-4KC',
      description:
        'Full-colour images at night using a warm floodlight — no black-and-white footage after dark.',
      category: 'cameras',
      price: 179,
      stock: 19,
      specs: {
        Resolution: '8MP 4K (3840 × 2160)',
        Lens: '2.8mm fixed',
        'Night vision': 'Full colour, 30m',
        'Weather rating': 'IP67',
        Connectivity: 'PoE (802.3af)',
        Audio: 'Built-in mic & speaker',
      },
    },
    {
      slug: 'ptz-5mp-optical-zoom',
      name: '5MP PTZ Camera, 4× Optical Zoom',
      sku: 'CAM-PTZ-5MP',
      description:
        'Pan, tilt and zoom three ways remotely. One camera can watch a whole yard or loading bay.',
      category: 'cameras',
      price: 329,
      stock: 11,
      specs: {
        Resolution: '5MP (2880 × 1620)',
        Zoom: '4× optical, 16× digital',
        'Pan / tilt': '355° / 90°',
        'Night vision': '50m infrared',
        'Weather rating': 'IP66',
        Connectivity: 'PoE+ (802.3at)',
      },
    },
    {
      slug: 'floodlight-2k',
      name: '2K Floodlight Camera with Siren',
      sku: 'CAM-FLD-2K',
      description:
        'Camera, motion-activated LED floodlight and 100dB siren in one unit. Deters intruders before they act.',
      category: 'cameras',
      price: 199,
      stock: 15,
      specs: {
        Resolution: '2K (2560 × 1440)',
        Light: '2000 lumen LED floodlight',
        Alarm: '100dB siren',
        'Weather rating': 'IP65',
        Connectivity: 'Wi-Fi 2.4GHz',
        Audio: 'Two-way talk',
      },
    },
    {
      slug: 'dome-vandal-5mp',
      name: '5MP Vandal-Resistant Indoor Dome',
      sku: 'CAM-IND-5MP',
      description:
        'Tamper-resistant dome for indoor use — tills, stockrooms, reception and server rooms.',
      category: 'cameras',
      price: 79,
      stock: 30,
      specs: {
        Resolution: '5MP (2592 × 1944)',
        Lens: '2.8mm fixed',
        'Night vision': '20m infrared',
        Rating: 'IK10 vandal-resistant',
        Connectivity: 'PoE (802.3af)',
        Audio: 'Built-in microphone',
      },
    },
    {
      slug: 'bullet-solar-4g',
      name: '4MP Solar 4G Camera (No Wi-Fi Needed)',
      sku: 'CAM-SOL-4G',
      description:
        'Runs on a solar panel and mobile data — perfect for farms, gates and sites with no power or internet.',
      category: 'cameras',
      price: 259,
      stock: 9,
      specs: {
        Resolution: '4MP (2560 × 1440)',
        Power: 'Solar panel + rechargeable battery',
        Connectivity: '4G LTE SIM',
        'Night vision': 'Full colour, 25m',
        Storage: 'microSD up to 256GB',
        'Weather rating': 'IP66',
      },
    },
    {
      slug: 'camera-analog-2mp',
      name: '2MP Analogue Turbo HD Bullet',
      sku: 'CAM-ANA-2MP',
      description:
        'Budget analogue camera for DVR kits. Coax + power, simple and reliable for smaller jobs.',
      category: 'cameras',
      price: 39,
      stock: 60,
      specs: {
        Resolution: '2MP (1920 × 1080)',
        Lens: '3.6mm fixed',
        'Night vision': '25m infrared',
        'Weather rating': 'IP66',
        Connectivity: 'HD-CVI / TVI / AHD',
        Power: '12V DC',
      },
    },

    // Recorders
    {
      slug: 'dvr-4ch-1080p',
      name: '4-Channel 1080p DVR',
      sku: 'REC-DVR-4CH',
      description:
        'Compact DVR for a small analogue system. Supports mobile viewing and motion alerts.',
      category: 'recorders',
      price: 119,
      stock: 22,
      specs: {
        Channels: '4',
        Resolution: '1080p per channel',
        Compression: 'H.265+',
        'Max HDD': '1 × 8TB',
        'Remote access': 'iOS / Android app',
        'HDMI output': '1080p',
      },
    },
    {
      slug: 'dvr-8ch-4mp',
      name: '8-Channel 4MP DVR (Turbo HD)',
      sku: 'REC-DVR-8CH',
      description:
        'Upgradeable 4MP DVR with room for eight analogue cameras — a cost-effective step up from 1080p.',
      category: 'recorders',
      price: 189,
      stock: 16,
      specs: {
        Channels: '8',
        Resolution: 'Up to 4MP per channel',
        Compression: 'H.265 Pro+',
        'Max HDD': '1 × 10TB',
        'Remote access': 'iOS / Android app',
        'Smart search': 'Motion & line-crossing',
      },
    },
    {
      slug: 'nvr-8ch-poe-4k',
      name: '8-Channel 4K NVR with 8-Port PoE',
      sku: 'REC-NVR-8CH',
      description:
        'IP recorder with built-in PoE switch — plug cameras straight in, no separate injectors or power supplies.',
      category: 'recorders',
      price: 249,
      stock: 20,
      specs: {
        Channels: '8',
        Resolution: 'Up to 4K per channel',
        Compression: 'H.265+',
        PoE: '8 ports, 802.3af/at',
        'Max HDD': '2 × 10TB',
        'Remote access': 'iOS / Android app',
      },
    },
    {
      slug: 'nvr-16ch-poe-4k',
      name: '16-Channel 4K NVR, 16-Port PoE',
      sku: 'REC-NVR-16CH',
      description:
        'For larger installations — sixteen 4K cameras on one recorder with dual-drive storage and RAID.',
      category: 'recorders',
      price: 429,
      stock: 8,
      specs: {
        Channels: '16',
        Resolution: 'Up to 4K per channel',
        Compression: 'H.265+',
        PoE: '16 ports, 802.3at',
        'Max HDD': '2 × 10TB',
        'RAID / backup': 'RAID 1 supported',
      },
    },

    // Storage
    {
      slug: 'hdd-purple-1tb',
      name: '1TB Surveillance Hard Drive',
      sku: 'STO-1TB',
      description:
        'Purpose-built for 24/7 write workloads. Roughly 2 weeks of continuous recording.',
      category: 'storage',
      price: 59,
      stock: 40,
      specs: {
        Capacity: '1TB',
        Interface: 'SATA 6Gb/s',
        'Designed for': 'Always-on surveillance',
        RPM: '5400 RPM',
        Warranty: '3 years',
      },
    },
    {
      slug: 'hdd-purple-4tb',
      name: '4TB Surveillance Hard Drive',
      sku: 'STO-4TB',
      description:
        'The sweet spot for most homes and shops — weeks of footage across several cameras.',
      category: 'storage',
      price: 109,
      stock: 34,
      specs: {
        Capacity: '4TB',
        Interface: 'SATA 6Gb/s',
        'Designed for': 'Always-on surveillance',
        RPM: '5400 RPM',
        Warranty: '3 years',
      },
    },
    {
      slug: 'hdd-purple-8tb',
      name: '8TB Surveillance Hard Drive',
      sku: 'STO-8TB',
      description:
        'Large-capacity drive for multi-camera sites and long retention windows.',
      category: 'storage',
      price: 199,
      stock: 18,
      specs: {
        Capacity: '8TB',
        Interface: 'SATA 6Gb/s',
        'Designed for': 'Always-on surveillance',
        'Cache / RPM': '256MB, 7200 RPM',
        Warranty: '3 years',
      },
    },

    // Monitors
    {
      slug: 'monitor-22-fhd',
      name: '22" Full HD Security Monitor',
      sku: 'MON-22',
      description:
        'Compact HDMI monitor for a reception or till point. Crisp 1080p picture, low power draw.',
      category: 'monitors',
      price: 129,
      stock: 17,
      specs: {
        Size: '21.5"',
        Resolution: '1920 × 1080',
        Inputs: 'HDMI, VGA',
        Panel: 'IPS',
        Mount: 'VESA 100 × 100',
      },
    },
    {
      slug: 'monitor-27-fhd',
      name: '27" Full HD Monitor',
      sku: 'MON-27',
      description:
        'Larger display for multi-camera grid views — see more feeds at once without squinting.',
      category: 'monitors',
      price: 179,
      stock: 12,
      specs: {
        Size: '27"',
        Resolution: '1920 × 1080',
        Inputs: 'HDMI ×2, VGA',
        Panel: 'IPS',
        Mount: 'VESA 100 × 100',
      },
    },

    // Doorbells
    {
      slug: 'video-doorbell-2k',
      name: '2K Video Doorbell (Wi-Fi)',
      sku: 'DBL-2K',
      description:
        'See and speak to visitors from your phone. Records the doorstep and triggers on the press of the bell.',
      category: 'doorbells',
      price: 129,
      stock: 26,
      specs: {
        Resolution: '2K (2560 × 1440)',
        Power: 'Battery or wired chime',
        'Field of view': '160°',
        Connectivity: 'Wi-Fi 2.4GHz',
        Audio: 'Two-way talk',
        Rating: 'IP65',
      },
    },
    {
      slug: 'intercom-2wire',
      name: '2-Wire Video Intercom Kit',
      sku: 'INT-2WIRE',
      description:
        'Indoor + outdoor station kit with two wires per run — a robust option for gates and apartment doors.',
      category: 'doorbells',
      price: 289,
      stock: 10,
      specs: {
        Stations: '1 outdoor, 1 indoor',
        Resolution: '1080p',
        Wiring: '2-wire (power + signal)',
        Unlock: 'Electric strike relay',
        Display: '7" indoor screen',
      },
    },

    // Networking
    {
      slug: 'poe-injector',
      name: 'PoE Injector (Single Port)',
      sku: 'NET-POE-INJ',
      description:
        'Add PoE to a non-PoE recorder or switch for a single camera. Plug-and-play.',
      category: 'networking',
      price: 22,
      stock: 50,
      specs: {
        Ports: '1 in, 1 out',
        Standard: '802.3af',
        Output: 'Up to 30W',
        'Data rate': '10/100/1000 Mbps',
      },
    },
    {
      slug: 'switch-8-port-poe',
      name: '8-Port Gigabit PoE Switch',
      sku: 'NET-SW-8P',
      description:
        'Central power and networking for eight IP cameras when the recorder has no built-in PoE.',
      category: 'networking',
      price: 139,
      stock: 14,
      specs: {
        Ports: '8 × PoE, 2 × uplink',
        Standard: '802.3af/at',
        'PoE budget': '120W total',
        'Data rate': 'Gigabit',
        Mount: 'Rack or desk',
      },
    },

    // Power & cabling
    {
      slug: 'psu-12v-10a',
      name: '12V 10A CCTV Power Supply (9-Way)',
      sku: 'PWR-12V10A',
      description:
        'Distribute 12V power to up to nine analogue cameras from one tidy fused box.',
      category: 'power',
      price: 45,
      stock: 28,
      specs: {
        Output: '12V 10A',
        Channels: '9-way, individually fused',
        Input: '100–240V AC',
        Housing: 'Lockable metal box',
      },
    },
    {
      slug: 'cat6-cable-305',
      name: 'CAT6 UTP Cable, 305m Box',
      sku: 'CBL-CAT6',
      description:
        'Solid-copper CAT6 for IP camera runs. Sold by the box for larger installations.',
      category: 'power',
      price: 89,
      stock: 20,
      specs: {
        Type: 'CAT6 UTP',
        Length: '305m box',
        Conductor: 'Solid bare copper',
        'Data rate': 'Up to 1Gbps',
        'Outer sheath': 'PVC, UV-resistant',
      },
    },
    {
      slug: 'bnc-connectors-pack',
      name: 'BNC Connectors & Cable Pack',
      sku: 'CBL-BNC-PK',
      description:
        'Twist-on BNC connectors plus low-loss coax and DC lead for analogue installs.',
      category: 'power',
      price: 25,
      stock: 44,
      specs: {
        Connectors: '10 × BNC, 10 × DC',
        Cable: '20m RG59 + power',
        Suits: 'Analogue / Turbo HD systems',
      },
    },

    // Accessories
    {
      slug: 'junction-box',
      name: 'Camera Junction Box',
      sku: 'ACC-JBOX',
      description:
        'Weatherproof box that hides connections and makes cable management neat and serviceable.',
      category: 'accessories',
      price: 12,
      stock: 80,
      specs: {
        Material: 'Aluminium',
        Rating: 'IP66',
        Fits: 'Bullet & turret bases',
        Finish: 'White',
      },
    },
    {
      slug: 'mount-wall-bracket',
      name: 'Adjustable Wall Mount Bracket',
      sku: 'ACC-BRACKET',
      description:
        'Tilt and swivel bracket for aiming a camera along a wall or around a corner.',
      category: 'accessories',
      price: 18,
      stock: 55,
      specs: {
        Material: 'Powder-coated steel',
        Adjust: '180° tilt / 360° swivel',
        Load: 'Up to 3kg',
        Finish: 'White',
      },
    },
    {
      slug: 'surge-protector',
      name: 'PoE & Coax Surge Protector',
      sku: 'ACC-SURGE',
      description:
        'Protects cameras and recorders from lightning-induced surges on long outdoor runs.',
      category: 'accessories',
      price: 34,
      stock: 26,
      specs: {
        Protects: '1 × PoE / coax run',
        Standards: 'IEEE 802.3af',
        Mounting: 'DIN or wall',
        Rating: 'IP54',
      },
    },
  ];

  for (const product of products) {
    const { category, specs, ...rest } = product;
    const data = {
      ...rest,
      specs,
      images: [img.product(product.slug)],
      isActive: true,
      isQuoteOnly: product.isQuoteOnly ?? true,
      category: { connect: { slug: category } },
    };
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
    });
  }

  // ---- packages -----------------------------------------------------------
  const packages = [
    {
      slug: 'basic',
      name: 'Basic Kit',
      tier: 'BASIC',
      summary: 'Entry coverage for a small home, flat, or single room.',
      features: [
        '4 × 4MP cameras',
        '4-channel DVR',
        '1TB surveillance HDD',
        'Full installation & setup',
        'Mobile viewing app',
        '1-year warranty',
      ],
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
        '8 × 4MP cameras',
        '8-channel PoE NVR',
        '4TB surveillance HDD',
        'Remote mobile viewing',
        'Full installation & setup',
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
        '16 × 4K cameras (colour night vision)',
        '16-channel 4K NVR',
        '8TB surveillance HDD',
        'Priority support & maintenance',
        'Full installation & setup',
        '3-year warranty',
      ],
      cameraCount: 16,
      priceMin: 1900,
      priceMax: 2800,
      sort: 3,
    },
  ];

  for (const pkg of packages) {
    const data = { ...pkg, image: img.package(pkg.slug) };
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: data,
      create: data,
    });
  }

  // ---- solutions ----------------------------------------------------------
  const solutions = [
    {
      slug: 'home',
      title: 'Home CCTV',
      summary: 'Protect your family, front door, and driveway.',
      body: 'Most homes need four to six cameras covering the front door, driveway, back garden, and any side access. We usually recommend 4MP cameras on a PoE NVR so a single cable carries both power and video, with mobile viewing so you can check in from anywhere.',
      typicalCameras: '4–8 cameras',
      startingPrice: 480,
      image: img.solution('home'),
      sort: 1,
    },
    {
      slug: 'shops',
      title: 'Shops & Restaurants',
      summary: 'Watch tills, entrances, and stock.',
      body: 'Retail systems focus on the till, the entrance, and stock areas, with enough resolution to identify faces and read number plates. We can add audio, a public-view monitor, and longer retention for dispute resolution.',
      typicalCameras: '6–12 cameras',
      startingPrice: 900,
      image: img.solution('shops'),
      sort: 2,
    },
    {
      slug: 'offices',
      title: 'Offices',
      summary: 'Secure entrances, corridors, and server rooms.',
      body: 'Office installs balance coverage with discretion — turret domes in corridors and reception, and access-controlled areas kept private. We integrate with existing door access and network infrastructure where possible.',
      typicalCameras: '8–16 cameras',
      startingPrice: 1250,
      image: img.solution('offices'),
      sort: 3,
    },
    {
      slug: 'warehouses',
      title: 'Warehouses',
      summary: 'Cover large perimeters and loading bays.',
      body: 'Large sites need a mix of long-range bullets, PTZ cameras for loading bays, and colour night vision across yards. Retention is sized to your operations, often 30 days or more.',
      typicalCameras: '16+ cameras',
      startingPrice: 1900,
      image: img.solution('warehouses'),
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

  // ---- testimonials -------------------------------------------------------
  const testimonials = [
    {
      key: 'priya-n',
      author: 'Priya N.',
      role: 'Homeowner',
      quote:
        'Survey was quick and the quote was clear. The team installed everything in a day and showed me the app before leaving.',
      rating: 5,
    },
    {
      key: 'daniel-r',
      author: 'Daniel R.',
      role: 'Restaurant owner',
      quote:
        'I can now check the till and the front door from my phone. The picture quality at night is excellent.',
      rating: 5,
    },
    {
      key: 'maria-s',
      author: 'Maria S.',
      role: 'Shop manager',
      quote:
        'They covered exactly what we needed without overselling. Footage is easy to find when we need it.',
      rating: 5,
    },
    {
      key: 'owen-t',
      author: 'Owen T.',
      role: 'Warehouse operations',
      quote:
        'Sixteen cameras across two loading bays, done over a weekend. Minimal disruption and tidy cabling.',
      rating: 5,
    },
    {
      key: 'hannah-k',
      author: 'Hannah K.',
      role: 'Office manager',
      quote:
        'Discreet cameras, no clutter, and the invoice matched the quote exactly. Would use again.',
      rating: 4,
    },
    {
      key: 'raj-p',
      author: 'Raj P.',
      role: 'Landlord',
      quote:
        'Fitted units at three of my properties. Consistent quality every time and support answers quickly.',
      rating: 5,
    },
    {
      key: 'ellen-b',
      author: 'Ellen B.',
      role: 'Homeowner',
      quote:
        'The camera calculator gave me a sensible starting point and the survey confirmed it. No pressure at all.',
      rating: 5,
    },
    {
      key: 'tom-w',
      author: 'Tom W.',
      role: 'Farm owner',
      quote:
        'Solar camera at the far gate works brilliantly where there is no power or internet. Great advice.',
      rating: 5,
    },
  ];

  const testimonialByKey = new Map<string, string>();
  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { author: t.author },
    });
    const record = existing
      ? await prisma.testimonial.update({
          where: { id: existing.id },
          data: {
            role: t.role,
            quote: t.quote,
            rating: t.rating,
            image: img.testimonial(t.key),
            isPublished: true,
          },
        })
      : await prisma.testimonial.create({
          data: {
            author: t.author,
            role: t.role,
            quote: t.quote,
            rating: t.rating,
            image: img.testimonial(t.key),
            isPublished: true,
          },
        });
    testimonialByKey.set(t.key, record.id);
  }

  // ---- projects -----------------------------------------------------------
  const projects = [
    {
      slug: 'family-home-front-door',
      title: 'Family home, full front and rear coverage',
      clientType: 'HOME' as const,
      location: 'Riverside',
      summary:
        'Six 4MP turret cameras on a PoE NVR, covering the driveway, front door, side access, and garden.',
      testimonial: 'priya-n',
      sort: 1,
    },
    {
      slug: 'restaurant-till-and-door',
      title: 'Restaurant till and entrance protection',
      clientType: 'RESTAURANT' as const,
      location: 'City centre',
      summary:
        'Eight cameras across the till, kitchen pass, store room, and both entrances, with audio at the counter.',
      testimonial: 'daniel-r',
      sort: 2,
    },
    {
      slug: 'boutique-retail-chain',
      title: 'Boutique retail — single shop, high detail',
      clientType: 'SHOP' as const,
      location: 'Market Street',
      summary:
        'Two 4K cameras at the till and door plus four turrets on the shop floor, sized for 30-day retention.',
      testimonial: 'maria-s',
      sort: 3,
    },
    {
      slug: 'distribution-warehouse',
      title: 'Distribution warehouse, two loading bays',
      clientType: 'WAREHOUSE' as const,
      location: 'Industrial Estate',
      summary:
        'Sixteen cameras including two PTZ on the bays, colour night vision across the yard, and RAID storage.',
      testimonial: 'owen-t',
      sort: 4,
    },
    {
      slug: 'professional-office-suite',
      title: 'Professional office suite',
      clientType: 'OFFICE' as const,
      location: 'Business Park',
      summary:
        'Ten discreet indoor and entrance cameras, integrated with existing door access, no exposed cabling.',
      testimonial: 'hannah-k',
      sort: 5,
    },
    {
      slug: 'farm-gate-solar',
      title: 'Remote farm gate on solar 4G',
      clientType: 'OTHER' as const,
      location: 'Valley Road',
      summary:
        'A solar-powered 4G camera at the lane entrance with no power or internet run required.',
      testimonial: 'tom-w',
      sort: 6,
    },
  ];

  for (const project of projects) {
    const data = {
      title: project.title,
      slug: project.slug,
      clientType: project.clientType,
      location: project.location,
      summary: project.summary,
      beforeImages: [img.projectBefore(project.slug)],
      afterImages: [img.projectAfter(project.slug)],
      testimonialId: testimonialByKey.get(project.testimonial) ?? null,
      isPublished: true,
      sort: project.sort,
    };
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: data,
      create: data,
    });
  }

  // ---- blog posts ---------------------------------------------------------
  const posts = [
    {
      slug: 'dvr-vs-nvr',
      title: 'DVR vs NVR: which recorder is right for you?',
      excerpt:
        'The two main families of CCTV recorder explained in plain English — and how to choose.',
      tags: ['Hardware', 'Buying guide'],
      body: 'A DVR records analogue cameras and is usually the cheaper option. An NVR records IP cameras, delivers higher resolution, and scales better as you add cameras.\n\nFor most new installs we recommend an NVR with PoE: one cable per camera carries both power and video, so installation is neater and there are fewer points of failure.\n\nIf you already have analogue cabling in place and a tight budget, a 4MP Turbo HD DVR can reuse it and still give a big jump in quality over 1080p.',
    },
    {
      slug: 'how-many-cameras',
      title: 'How many cameras does a home need?',
      excerpt:
        'Four well-placed cameras usually beat eight poor ones. Here is where to put them.',
      tags: ['Planning', 'Home'],
      body: 'Most homes need four to six cameras. Prioritise the front door, the driveway, the back garden, and any side or alley access.\n\nPlacement matters more than count. A camera at head height covering the approach captures usable faces; one aimed from too high just records the top of a hat.\n\nUse our camera calculator for a quick estimate, then let a free survey confirm the exact positions and cable routes.',
    },
    {
      slug: 'night-vision-explained',
      title: 'Night vision explained: IR vs full colour',
      excerpt:
        'Why some cameras go black-and-white at night while others stay in colour.',
      tags: ['Hardware'],
      body: 'Infrared (IR) cameras switch to black-and-white after dark and are affordable and reliable. Full-colour night vision uses a warm light and keeps colour, which helps identify clothing and vehicles.\n\nThe trade-off is a visible light and slightly higher cost. For entrances and tills we often recommend colour; for quiet perimeter coverage IR is usually enough.',
    },
    {
      slug: 'cctv-storage-guide',
      title: 'How much storage do you need?',
      excerpt:
        'A simple way to work out how many days of footage a given hard drive gives you.',
      tags: ['Storage', 'Planning'],
      body: 'Retention depends on camera count, resolution, frame rate, and how much motion there is. As a rule of thumb, H.265 compression roughly halves the space of older H.264.\n\nFor a typical eight-camera home at 4MP, a 4TB drive gives around three to four weeks of recording. Add capacity if you need 30-day retention across many cameras.',
    },
    {
      slug: 'poe-vs-analogue',
      title: 'PoE vs analogue: what is the difference on site?',
      excerpt:
        'One cable or two, and what that means for cost and future upgrades.',
      tags: ['Wiring', 'Buying guide'],
      body: 'PoE (Power over Ethernet) cameras need a single network cable that carries both power and data. Analogue cameras need a coax run for video plus a separate power pair.\n\nPoE is cleaner to install, easier to expand, and supports higher resolutions. Analogue wins when you are reusing existing cable or working to a tight budget.',
    },
  ];

  for (const post of posts) {
    const published = new Date();
    const data = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      coverImage: img.blog(post.slug),
      tags: post.tags,
      isPublished: true,
      publishedAt: published,
    };
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: data,
      create: data,
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
    {
      question: 'Can I view my cameras on my phone?',
      answer:
        'Yes. Every system we install includes a mobile app for live viewing and playback on iOS and Android, set up and demonstrated before we leave.',
      category: 'Usage',
      sort: 4,
    },
    {
      question: 'How long does installation take?',
      answer:
        'A typical home system is installed in a single day. Larger commercial jobs are usually completed over a weekend or in stages to avoid disrupting your business.',
      category: 'Installation',
      sort: 5,
    },
    {
      question: 'How much footage can I store?',
      answer:
        'It depends on camera count and resolution. As a guide, an 8-camera 4MP system with a 4TB drive keeps roughly three to four weeks of continuous recording.',
      category: 'Storage',
      sort: 6,
    },
    {
      question: 'Do cameras work at night and in bad weather?',
      answer:
        'Yes. Outdoor cameras are IP65–IP67 rated for rain and dust, and use infrared or full-colour night vision. We match the camera to the location.',
      category: 'Hardware',
      sort: 7,
    },
    {
      question: 'What happens if a camera goes offline?',
      answer:
        'Every install includes a warranty, and an optional AMC plan adds priority support, health checks, and faster call-outs. Raise a support ticket and we will take it from there.',
      category: 'Support',
      sort: 8,
    },
    {
      question: 'Will you publish my camera footage or address?',
      answer:
        'Never. Your footage and address stay private. We only use anonymised details, and only with your permission, for case studies.',
      category: 'Privacy',
      sort: 9,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({
      where: { question: faq.question },
    });
    if (existing) {
      await prisma.faq.update({ where: { id: existing.id }, data: faq });
    } else {
      await prisma.faq.create({ data: faq });
    }
  }

  const [categoryCount, productCount, packageCount, solutionCount, projectCount, postCount, faqCount, testimonialTotal] =
    await Promise.all([
      prisma.productCategory.count(),
      prisma.product.count(),
      prisma.package.count(),
      prisma.solution.count(),
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.faq.count(),
      prisma.testimonial.count(),
    ]);

  console.log('Seed complete.');
  console.table({
    categories: categoryCount,
    products: productCount,
    packages: packageCount,
    solutions: solutionCount,
    projects: projectCount,
    blogPosts: postCount,
    faqs: faqCount,
    testimonials: testimonialTotal,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
