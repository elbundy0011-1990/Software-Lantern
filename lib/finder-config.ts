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
  title: "Where should providers reach you?",
  help: "All fields are required. Please use your work email so we can match you to a company.",
};

function usingSoftwareStep(help: string): FinderStep {
  return {
    id: "usingSoftware",
    kind: "single",
    title: "Are you currently using software for this?",
    help,
    options: ["Yes", "No"],
  };
}

function vendorStep(placeholder: string): FinderStep {
  return {
    id: "vendor",
    kind: "text",
    title: "Which vendor?",
    help: "The name of the system or provider you use today.",
    placeholder,
  };
}

const CONTRACT_END_STEP: FinderStep = {
  id: "contractEnd",
  kind: "single",
  title: "When does your current contract or partnership end?",
  help: "A rough timeframe is fine.",
  options: ["Less than 3 months", "3–6 months", "6–12 months", "More than 12 months", "Not sure"],
};

// If they said they're currently using software, ask which vendor and when
// that contract/partnership ends; otherwise skip straight past both.
function currentSoftwareSteps(
  usingSoftwareAnswer: string | undefined,
  helpText: string,
  vendorPlaceholder: string,
): FinderStep[] {
  const steps: FinderStep[] = [usingSoftwareStep(helpText)];
  if (usingSoftwareAnswer === "Yes") {
    steps.push(vendorStep(vendorPlaceholder), CONTRACT_END_STEP);
  }
  return steps;
}

export function getSteps(
  category: string | null,
  catPreset: boolean,
  usingSoftwareAnswer?: string,
): FinderStep[] {
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
      ...currentSoftwareSteps(
        usingSoftwareAnswer,
        "This helps providers understand what they'd be replacing or integrating with.",
        "e.g. your ERP or procurement system provider",
      ),
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

  const vendorPlaceholder = isDbp ? "e.g. your current DBP provider" : "e.g. your current PLM provider";
  const missingPlaceholder = isDbp
    ? "e.g. no way to collect upstream material data"
    : "e.g. no supplier collaboration, tech packs live in email";

  const questions: FinderStep[] = [
    profile,
    scope,
    ...currentSoftwareSteps(
      usingSoftwareAnswer,
      "Helps providers understand what they'd be replacing or working alongside.",
      vendorPlaceholder,
    ),
    {
      id: "missing",
      kind: "text",
      title: "What's the hardest part right now?",
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

// Dedicated landing pages that exist per category. Categories without one
// here fall back to the generic "how it works" section rather than linking
// to a page that doesn't exist (or worse, always linking to /plm regardless
// of category). Add an entry here as each category's page ships.
const CATEGORY_INFO_PAGES: Record<string, { label: string; href: string }> = {
  "Product Lifecycle Management (PLM)": { label: "Read about fashion PLM software", href: "/plm" },
};

const GENERIC_INFO_LINK = { label: "Read about how it works", href: "/#how-it-works" };

export function categoryInfoLink(category: string | null): { label: string; href: string } {
  if (!category) return GENERIC_INFO_LINK;
  return CATEGORY_INFO_PAGES[category] || GENERIC_INFO_LINK;
}

export function leadDetailRows(
  category: string | null,
  answers: Record<string, string | string[] | undefined>,
): { label: string; value: string }[] {
  const val = (v: string | string[] | undefined) => {
    if (Array.isArray(v)) return v.length ? v.join(", ") : "Not given";
    return v && String(v).trim() ? v : "Not given";
  };
  const currentSoftwareRows = (): { label: string; value: string }[] => {
    const rows = [{ label: "Currently using software", value: val(answers.usingSoftware) }];
    if (answers.usingSoftware === "Yes") {
      rows.push({ label: "Vendor", value: val(answers.vendor) });
      rows.push({ label: "Contract/partnership ends", value: val(answers.contractEnd) });
    }
    return rows;
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
      ...currentSoftwareRows(),
      { label: "Hardest part", value: val(answers.missing) },
      { label: "Compliance deadline", value: val(answers.timing) },
    ];
  }
  const isDbp = cat.indexOf("Battery") > -1;
  return [
    { label: isDbp ? "Position in chain" : "Company type", value: val(answers.industry) },
    { label: isDbp ? "Passport must carry" : "Needs to manage", value: val(answers.manage) },
    ...currentSoftwareRows(),
    { label: "What's missing", value: val(answers.missing) },
    { label: "Users", value: val(answers.users) },
    { label: "Timeline", value: val(answers.timing) },
  ];
}
