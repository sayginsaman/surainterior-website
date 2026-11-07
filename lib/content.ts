import manifest from "./work-manifest.json";

export const site = {
  name: "SURA INTERIOR",
  legalName: "Sura Interior LLC",
  headline: "Thoughtful Design. Exceptional Living.",
  tagline: "Beyond design. Into detail.",
  promise: "We don't just design beautiful spaces. We bring them to life.",
  descriptor: ["Interior Architecture", "Custom Millwork", "Kitchen & Bath", "Renovation Coordination"],
  city: "Boca Raton, Florida",
  region: "South Florida",
  phone: "+1 (267) 770-2747",
  phoneHref: "tel:+12677702747",
  email: "suramimarlik@gmail.com",
  serviceArea: ["Boca Raton", "Delray Beach", "Boynton Beach", "Palm Beach County", "Broward", "Miami-Dade"],
  intro:
    "SURA INTERIOR creates thoughtfully designed residential interiors that balance functionality, craftsmanship and timeless aesthetics. From initial concepts and space planning to custom details, material selection and project coordination, we bring every space together through a cohesive design vision.",
};

export type Service = {
  n: string;
  title: string;
  short: string;
  items: string[];
  outcome: string;
  image: { project: string; index: number };
};

export const services: Service[] = [
  {
    n: "01",
    title: "Interior Architecture & Full-Service Interior Design",
    short: "Full-service design",
    items: [
      "Space planning and furniture layouts",
      "Existing-space assessment and design direction",
      "Concept development, mood boards and design presentations",
      "AutoCAD plans, elevations and design documentation",
      "3D visualization and photorealistic renderings",
      "Color, finish, material and lighting selections",
      "Furniture, rugs, window treatments and accessories",
      "FF&E specifications and purchasing coordination",
    ],
    outcome: "A cohesive design direction supported by clear visual and technical information.",
    image: { project: "biscayne-boulevard-residence", index: 0 },
  },
  {
    n: "02",
    title: "Kitchen, Bathroom & Custom Cabinetry Design",
    short: "Kitchen, bath & cabinetry",
    items: [
      "Kitchen and bathroom design",
      "Custom vanities, closets, pantries and laundry rooms",
      "Home-office cabinetry, built-ins and storage solutions",
      "Plans, elevations, sections and relevant design details",
      "Cabinet door, finish, hardware and interior-organization selections",
      "Countertop, backsplash and fixture coordination",
      "Design information prepared for review by fabricators and installers",
    ],
    outcome: "Spaces tailored to the home, your routines and the realities of fabrication and installation.",
    image: { project: "pembroke-pines-residence", index: 0 },
  },
  {
    n: "03",
    title: "Custom Furniture & Millwork",
    short: "Furniture & millwork",
    items: [
      "Custom TV units and media walls",
      "Built-in bookcases, shelving and display cabinetry",
      "Wardrobes, headboards and bedroom storage",
      "Decorative wall panels and specialty built-ins",
      "Custom desks, bars and other made-to-measure furniture",
      "Design development, material direction and fabrication coordination",
    ],
    outcome: "Distinctive, space-specific pieces instead of relying only on standard retail furniture.",
    image: { project: "boca-raton-residence", index: 0 },
  },
  {
    n: "04",
    title: "Renovation Design & Project Coordination",
    short: "Renovation coordination",
    items: [
      "Design development for residential renovations",
      "Finish and material schedules",
      "Design-intent communication with contractors and trades",
      "Coordination of cabinetry, countertop and finish decisions",
      "Product sourcing, order tracking and delivery scheduling",
      "Installation coordination and design reviews",
      "Final styling and completion support",
    ],
    outcome: "A more organized design process and one consistent point of contact for design decisions.",
    image: { project: "parkland-residence", index: 0 },
  },
  {
    n: "05",
    title: "Furniture, Lighting, Window Treatments & FF&E",
    short: "Furnishing & FF&E",
    items: [
      "Furniture and lighting selection",
      "Rugs, mirrors, artwork and decorative accessories",
      "Curtains, shades and window-treatment coordination",
      "Wallcoverings and decorative finishes",
      "Product sourcing, specification and purchasing coordination",
      "Room completion and styling",
    ],
    outcome: "A finished interior in which furnishings, lighting, textiles and accessories work together.",
    image: { project: "fort-lauderdale-kitchen", index: 2 },
  },
];

export const process = [
  { n: "01", title: "Discovery Call", text: "Your goals, the property, timing, priorities and an approximate budget." },
  { n: "02", title: "Consultation & Site Visit", text: "We study the space, take and verify measurements and document existing conditions." },
  { n: "03", title: "Written Proposal", text: "Services, deliverables, exclusions, fees, schedule, revision limits and payment stages, in writing." },
  { n: "04", title: "Design Development", text: "Concepts, layouts, renderings, drawings, material selections and specifications." },
  { n: "05", title: "Sourcing & Coordination", text: "Product information, suppliers, fabricators, delivery and installation scheduling." },
  { n: "06", title: "Installation Review & Styling", text: "Design-intent reviews during installation, then the final styling." },
];

export const differentiators = [
  { title: "Academic depth", text: "A PhD in Interior Architecture and more than twenty years of professional practice." },
  { title: "Design that considers fabrication", text: "Kitchens, closets, vanities and built-ins are drawn for how they are made and installed, not only for how they render." },
  { title: "Concepts connected to outcomes", text: "3D visualization, technical drawings and material specifications that lead to the finished room." },
  { title: "One coordinated experience", text: "Design, product selection and coordination in one studio. Construction and licensed trades stay with licensed professionals." },
  { title: "Personal, detail-focused", text: "A limited number of projects at a time, with direct communication throughout." },
];

type Img = { src: string; w: number; h: number; blur: string };

export type Project = {
  slug: string;
  title: string;
  location: string;
  year: number;
  category: string;
  scope: string[];
  summary: string;
  alts: string[];
  images: (Img & { alt: string })[];
  feature?: boolean;
};

const raw: Omit<Project, "images">[] = [
  {
    slug: "pembroke-pines-residence",
    title: "Pembroke Pines Residence",
    location: "Pembroke Pines, FL",
    year: 2023,
    category: "Kitchen",
    scope: ["Kitchen design", "Custom cabinetry", "Lighting"],
    summary:
      "A dark walnut kitchen built around a quartzite waterfall island. Open shelves are cut into the island and lit from within, and glass-front tall cabinets turn storage into display.",
    feature: true,
    alts: [
      "Dark walnut kitchen with a quartzite waterfall island and glass-front tall cabinets",
      "Waterfall island with lit open shelves cut into its end",
      "L-shaped walnut kitchen facing the garden windows",
      "Tall walnut cabinet wall with an integrated refrigerator",
      "Quartzite island facing the windows",
      "Range wall in walnut and quartzite beside the island",
      "Island end at the garden window",
      "Corner countertop with a coffee station",
      "Lit open shelves at the end of the island",
      "Island shelf detail seen from above",
      "Walnut shelf with concealed LED light",
      "Glass-front bar cabinet with interior lighting",
    ],
  },
  {
    slug: "biscayne-boulevard-residence",
    title: "Biscayne Boulevard Residence",
    location: "Miami, FL",
    year: 2025,
    category: "Kitchen",
    scope: ["Kitchen design", "Custom cabinetry", "Furniture"],
    summary:
      "Oak tall cabinets absorb the refrigerator and ovens so the room reads as one wall of timber. The island pairs fluted oak with a white quartz top and runs into a table on a single cylinder base.",
    feature: true,
    alts: [
      "Oak kitchen with a white quartz island and an attached cylinder-base table",
      "Island waterfall edge beside a round column",
      "Overhead view of the island and attached table",
      "Glass-front display cabinet with interior lighting",
      "White quartz countertop meeting fluted oak",
      "Display cabinet with glassware and ceramics",
      "Top-down view of the island",
      "Refrigerator and wall ovens set into oak tall cabinets",
    ],
  },
  {
    slug: "parkland-residence",
    title: "Parkland Residence",
    location: "Parkland, FL",
    year: 2025,
    category: "Kitchen, pantry & media wall",
    scope: ["Kitchen design", "Pantry organization", "Media wall", "Lighting"],
    summary:
      "One house, three rooms of custom work: a walnut kitchen with a marble-look quartz island, a walk-in pantry with lit floating shelves, and a floating media console washed in warm LED light.",
    feature: true,
    alts: [
      "Walnut kitchen with a marble-look quartz island and a pendant chandelier",
      "Island and chandelier from the dining side",
      "Island with a marble-look quartz top",
      "Island corner detail",
      "Coffee station against a subway tile backsplash",
      "Island toward the refrigerator wall",
      "Full-height walnut pantry doors beside the refrigerator",
      "Walk-in pantry with lit floating shelves",
      "Pantry shelves with oils and spices",
      "Pantry shelf detail",
      "LED strip under a pantry shelf",
      "Floating walnut media console with LED underlight and vertical panels",
      "Media console seen from the side",
      "Media console detail",
    ],
  },
  {
    slug: "fort-lauderdale-kitchen",
    title: "Fort Lauderdale Residence",
    location: "Fort Lauderdale, FL",
    year: 2025,
    category: "Kitchen",
    scope: ["Kitchen design", "Custom cabinetry", "Lighting"],
    summary:
      "A curved island wrapped in fluted walnut with a softly rounded table edge, walnut and white lacquer uppers, a stone backsplash and a single linear pendant drawn across the room.",
    feature: true,
    alts: [
      "Curved island with a fluted walnut base under a lit ceiling cove",
      "Curved island in afternoon daylight",
      "Island, dining chairs and walnut upper cabinets",
      "Faucet against a veined stone backsplash",
      "Linear pendant above walnut and white lacquer cabinets",
      "Linear pendant detail",
    ],
  },
  {
    slug: "boca-raton-residence",
    title: "Boca Raton Residence",
    location: "Boca Raton, FL",
    year: 2025,
    category: "Media wall",
    scope: ["Custom millwork", "Display cabinetry", "Lighting"],
    summary:
      "A media wall composed rather than assembled: vertical timber slats, lit display niches for the owners' ceramics, floating base cabinets and a warm line of LED light along the floor.",
    feature: true,
    alts: [
      "Media wall with vertical wood slats, lit display niches and an LED floor wash",
      "Angled view of the media wall and floating base cabinets",
      "Lit display cabinet with ceramic objects",
      "LED light washing the stone floor beneath the floating cabinets",
      "Display niche beside the doorway",
      "Vertical slat panel above the television",
    ],
  },
  {
    slug: "miami-beach-nursery",
    title: "Miami Beach Nursery",
    location: "Miami Beach, FL",
    year: 2024,
    category: "Custom furniture",
    scope: ["Custom furniture", "Millwork"],
    summary:
      "An arched nursery cabinet with open shelves for toys and keepsakes, drawers below and wave-shaped brass pulls.",
    alts: [
      "Arched nursery cabinet with open shelves and drawers",
      "Arched niche with shelves above drawers",
      "Side view of the arched cabinet",
      "Arched niche holding soft toys",
      "Open shelves seen from below",
      "Shelf and drawer detail",
      "Wave-shaped drawer pulls",
      "Wardrobe doors and drawers",
    ],
  },
  {
    slug: "crystal-tower-residence",
    title: "Crystal Tower Residence",
    location: "Hollywood Beach, FL",
    year: 2024,
    category: "Condo kitchen",
    scope: ["Kitchen design", "Condo renovation"],
    summary:
      "A compact condo kitchen in soft greige lacquer and veined stone, with under-cabinet light and an open niche that keeps the U-shape from feeling closed in.",
    alts: [
      "Compact U-shaped condo kitchen in soft greige",
      "Corner sink with under-cabinet lighting",
      "Open shelf niche above the sink",
      "Cooktop against a veined stone backsplash",
      "Sink wall with a stone backsplash",
      "Cooktop corner",
      "Kitchen seen from above",
      "Dishwasher and cabinetry run",
      "Under-cabinet light detail",
    ],
  },
];

const work = manifest as unknown as Record<string, Img[]> & { _bands: Record<string, Img> };

/** 16:9 full-bleed crops made from the large source photographs. */
export const bands = work._bands;


export const projects: Project[] = raw.map((p) => ({
  ...p,
  images: (work[p.slug] ?? []).map((img, i) => ({ ...img, alt: p.alts[i] ?? `${p.title}, image ${i + 1}` })),
}));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const photo = (slug: string, index = 0) => {
  const p = getProject(slug);
  if (!p) throw new Error(`Unknown project ${slug}`);
  return p.images[index];
};
