export type StepKind = "single" | "multi" | "text" | "contact";

export interface FinderStep {
  id: string;
  kind: StepKind;
  title: string;
  help: string;
  options?: string[];
  placeholder?: string;
}

export interface ContactAnswers {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
}

export type StepAnswers = Record<string, string | string[] | undefined>;

export const CATEGORIES = [
  {
    label: "EUDR Software",
    blurb: "Deforestation due diligence, geolocation and compliance reporting",
  },
  {
    label: "Product Lifecycle Management (PLM)",
    blurb: "Tech packs, BOM, materials and supplier collaboration",
  },
  {
    label: "Digital Battery Passport (DBP)",
    blurb: "Traceability, carbon data and the QR-linked passport",
  },
] as const;

const CATEGORY_STEP: FinderStep = {
  id: "category",
  kind: "single",
  title: "Which software are you looking for?",
  help: "Pick a category and we ask the questions that matter for it.",
  options: [
    "EUDR Software",
    "Product Lifecycle Management (PLM)",
    "Digital Battery Passport (DBP)",
  ],
};

const CONTACT_STEP: FinderStep = {
  id: "contact",
  kind: "contact",
  title: "Where should we send your matches?",
  help: "All fields are required. Please use your work email so we can match you to a company.",
};

export function getSteps(category: string | null, catPreset: boolean): FinderStep[] {
  const cat = category || "";
  const isEudr = cat.indexOf("EUDR") > -1;
  const isDbp = cat.indexOf("Battery") > -1;

  if (isEudr) {
    const eudrSteps: FinderStep[] = [
      {
        id: "industry",
        kind: "multi",
        title: "What products do you import or sell?",
        help: "The EUDR commodities in scope for you. Choose all that apply.",
        options: ["Coffee", "Cocoa", "Rubber", "Soy", "Palm oil", "Wood", "Cattle", "Other"],
      },
      {
        id: "role",
        kind: "single",
        title: "What's your role in the supply chain?",
        help: "This decides which obligations fall on you.",
        options: ["Importer", "Manufacturer", "Trader", "Distributor", "Downstream operator"],
      },
      {
        id: "manage",
        kind: "single",
        title: "How many suppliers do you need to cover?",
        help: "A rough number is fine.",
        options: ["Under 25", "25–100", "100–500", "500–2,000", "More than 2,000"],
      },
      {
        id: "skus",
        kind: "single",
        title: "How many SKUs fall in scope?",
        help: "Only the products covered by the regulation.",
        options: ["Under 50", "50–500", "500–5,000", "More than 5,000", "Not sure yet"],
      },
      {
        id: "regions",
        kind: "multi",
        title: "Where are your suppliers located?",
        help: "Sourcing regions shape the risk work and the languages you need.",
        options: [
          "West Africa",
          "East Africa",
          "South America",
          "Southeast Asia",
          "South Asia",
          "Europe",
          "North America",
          "Other",
        ],
      },
      {
        id: "geo",
        kind: "single",
        title: "Do you already collect plot geolocation data?",
        help: "Polygons or coordinates for the plots of land your goods come from.",
        options: ["Yes, for most suppliers", "For some suppliers", "Not yet", "Not sure"],
      },
      {
        id: "current",
        kind: "text",
        title: "What ERP or procurement system do you run?",
        help: "Providers will tell you what they integrate with.",
        placeholder: "e.g. SAP S/4HANA and Coupa",
      },
      {
        id: "missing",
        kind: "text",
        title: "What's the hardest part right now?",
        help: "The single most useful thing you can tell a provider.",
        placeholder: "e.g. chasing farm coordinates from traders by email",
      },
      {
        id: "timing",
        kind: "single",
        title: "When do you need to be compliant?",
        help: "This tells providers how to respond.",
        options: ["Already overdue", "Within 3 months", "3–6 months", "6–12 months", "Just researching"],
      },
      CONTACT_STEP,
    ];
    return catPreset ? eudrSteps : [CATEGORY_STEP, ...eudrSteps];
  }

  let profile: FinderStep;
  let scope: FinderStep;
  if (isDbp) {
    profile = {
      id: "industry",
      kind: "multi",
      title: "Where do you sit in the battery chain?",
      help: "Pick the closest match. You can choose more than one.",
      options: [
        "Cell manufacturer",
        "Pack assembler",
        "Automotive OEM",
        "Energy storage",
        "Materials supplier",
        "Recycler",
        "Other",
      ],
    };
    scope = {
      id: "manage",
      kind: "multi",
      title: "What does the passport need to carry?",
      help: "The data your DBP has to hold and report on.",
      options: [
        "Material traceability",
        "Carbon footprint",
        "Due diligence data",
        "State of health",
        "Compliance reporting",
        "QR passport and access rules",
        "Supply chain data collection",
        "Other",
      ],
    };
  } else {
    profile = {
      id: "industry",
      kind: "multi",
      title: "What type of company are you?",
      help: "Pick the closest match. You can choose more than one.",
      options: [
        "Fashion / Apparel",
        "Footwear",
        "Automotive",
        "Aerospace",
        "Medical Devices",
        "Consumer Goods",
        "Industrial Manufacturing",
        "Other",
      ],
    };
    scope = {
      id: "manage",
      kind: "multi",
      title: "What are you looking to manage?",
      help: "The areas your PLM has to cover.",
      options: [
        "Product development",
        "Tech packs",
        "BOM",
        "Materials",
        "Supplier collaboration",
        "Costing",
        "Sampling",
        "Sustainability",
        "Other",
      ],
    };
  }

  const currentPlaceholder = isDbp
    ? "e.g. ERP data plus manual supplier questionnaires"
    : "e.g. Excel and shared drives, plus a PDM we outgrew";
  const missingPlaceholder = isDbp
    ? "e.g. no way to collect upstream material data"
    : "e.g. no supplier collaboration, tech packs live in email";

  const questions: FinderStep[] = [
    profile,
    scope,
    {
      id: "current",
      kind: "text",
      title: "What are you using today?",
      help: "Spreadsheets, a legacy system, nothing yet: all useful to know.",
      placeholder: currentPlaceholder,
    },
    {
      id: "missing",
      kind: "text",
      title: "What's missing from it?",
      help: "The single most useful thing you can tell a provider.",
      placeholder: missingPlaceholder,
    },
    {
      id: "users",
      kind: "single",
      title: "How many people need access?",
      help: "A rough number is fine.",
      options: ["1–5", "6–20", "21–50", "51–200", "200+"],
    },
    {
      id: "timing",
      kind: "single",
      title: "When are you looking to implement?",
      help: "This tells providers how to respond.",
      options: ["Immediately", "1–3 months", "3–6 months", "6–12 months", "Just researching"],
    },
    CONTACT_STEP,
  ];
  return catPreset ? questions : [CATEGORY_STEP, ...questions];
}

export const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.co.uk",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "gmx.de",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "web.de",
  "free.fr",
  "orange.fr",
  "qq.com",
  "163.com",
  "126.com",
];

export function validateStep(
  step: FinderStep,
  answers: StepAnswers,
  contact: ContactAnswers,
): string | null {
  const a = answers[step.id];
  if (step.kind === "multi") {
    return Array.isArray(a) && a.length ? null : "Pick at least one option to continue.";
  }
  if (step.kind === "single") {
    return a ? null : "Pick one option to continue.";
  }
  if (step.kind === "text") {
    return typeof a === "string" && a.trim().length > 1 ? null : "A short answer here is required.";
  }
  if (step.kind === "contact") {
    const trim = (v?: string) => (v || "").trim();
    if (!trim(contact.name)) return "Please add your name.";
    if (!trim(contact.company)) return "Please add your company name.";
    const email = trim(contact.email).toLowerCase();
    if (!email) return "Please add your work email.";
    if (!/^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/.test(email)) return "That email address does not look valid.";
    const domain = email.split("@")[1];
    if (FREE_EMAIL_DOMAINS.indexOf(domain) > -1) {
      return "Please use your work email. Personal addresses such as Gmail, Hotmail, Outlook and Yahoo cannot be matched to a company.";
    }
    const phone = trim(contact.phone).replace(/[^0-9]/g, "");
    if (!phone) return "Please add a phone number. Providers use it to reach you.";
    if (phone.length < 7) return "That phone number looks too short.";
    return null;
  }
  return null;
}

export function shortCategoryLabel(category: string | null): string {
  const cat = category || "";
  if (cat.indexOf("EUDR") > -1) return "EUDR software";
  if (cat.indexOf("PLM") > -1) return "PLM";
  if (cat.indexOf("Battery") > -1) return "DBP software";
  return "";
}

export const MATCH_COUNT = 3;

export function leadDetailRows(
  category: string | null,
  answers: Record<string, string | string[] | undefined>,
): { label: string; value: string }[] {
  const val = (v: string | string[] | undefined) => {
    if (Array.isArray(v)) return v.length ? v.join(", ") : "Not given";
    return v && String(v).trim() ? v : "Not given";
  };
  const cat = category || "";
  if (cat.indexOf("EUDR") > -1) {
    return [
      { label: "Products in scope", value: val(answers.industry) },
      { label: "Role", value: val(answers.role) },
      { label: "Suppliers", value: val(answers.manage) },
      { label: "SKUs in scope", value: val(answers.skus) },
      { label: "Sourcing regions", value: val(answers.regions) },
      { label: "Geolocation data", value: val(answers.geo) },
      { label: "ERP / procurement", value: val(answers.current) },
      { label: "Hardest part", value: val(answers.missing) },
      { label: "Compliance deadline", value: val(answers.timing) },
    ];
  }
  const isDbp = cat.indexOf("Battery") > -1;
  return [
    { label: isDbp ? "Position in chain" : "Company type", value: val(answers.industry) },
    { label: isDbp ? "Passport must carry" : "Needs to manage", value: val(answers.manage) },
    { label: "Using today", value: val(answers.current) },
    { label: "What's missing", value: val(answers.missing) },
    { label: "Users", value: val(answers.users) },
    { label: "Timeline", value: val(answers.timing) },
  ];
}
