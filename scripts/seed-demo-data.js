// One-off seeding script: creates REAL employer accounts (real Supabase Auth
// signups) each posting ONE real job, through the same public anon-key
// client and RLS-protected inserts the app itself uses. No service_role key,
// no fabricated metrics — every row is a genuine record created by a real
// (scripted) account, same as if a person had done it through the UI.
//
// Usage: node scripts/seed-demo-data.js  (run from the project root, with a
// real .env.local present — see .env.local.example)
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const raw = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const STAMP = Date.now();

const COMPANIES = [
  {
    slug: "northwind",
    fullName: "Priya Anand",
    companyName: "Northwind Data",
    website: "https://northwinddata.example.com",
    description: "Analytics infrastructure for mid-market SaaS companies.",
    job: {
      title: "Staff Engineer, Platform",
      location: "Remote (US/EU)",
      mode: "remote",
      level: "lead",
      salaryMin: 175000,
      salaryMax: 215000,
      tags: ["Go", "Kubernetes", "Distributed Systems", "Postgres"],
      description:
        "Northwind Data runs the ingestion pipeline behind our analytics product, processing roughly 40TB of event data a day. We're looking for a staff engineer to own the reliability and scaling of that pipeline as we move from a single-region deployment to a multi-region one over the next two quarters. You'll work closely with our SRE and data platform teams, and you'll have real influence over architecture decisions rather than just implementing someone else's spec.",
      responsibilities: [
        "Design and implement the multi-region failover strategy for the ingestion pipeline",
        "Set and enforce SLOs for pipeline latency and data completeness across teams",
        "Mentor two senior engineers currently rotating onto the platform team",
        "Review architecture proposals from other teams that touch shared infrastructure",
      ],
      requirements: [
        "7+ years building distributed backend systems in production",
        "Deep experience with Kubernetes operators or custom controllers",
        "Track record leading a multi-quarter infrastructure migration",
        "Comfortable writing Go; willing to learn our internal tooling in Rust",
      ],
    },
  },
  {
    slug: "fieldstone",
    fullName: "Marcus Chen",
    companyName: "Fieldstone Labs",
    website: "https://fieldstonelabs.example.com",
    description: "Scheduling software for independent healthcare clinics.",
    job: {
      title: "Frontend Engineer (React)",
      location: "Remote (Worldwide)",
      mode: "remote",
      level: "mid",
      salaryMin: 95000,
      salaryMax: 120000,
      tags: ["React", "TypeScript", "Accessibility", "Design Systems"],
      description:
        "Fieldstone Labs builds scheduling software for independent healthcare clinics. Our frontend team owns a shared component library used across three internal products, and we're hiring a mid-level engineer to help extend it while shipping features in our main scheduling app. Most of our clinics' staff are not tech-savvy, so accessibility and plain-language error states aren't a nice-to-have here, they're the actual job.",
      responsibilities: [
        "Ship features in the scheduling app end-to-end, from design handoff to production",
        "Extend and document components in the shared design system library",
        "Pair with our one designer on accessibility passes for existing screens",
        "Triage and fix bugs reported by clinic staff through our support channel",
      ],
      requirements: [
        "3+ years with React in a production codebase",
        "Experience with WCAG-level accessibility work, not just theoretical knowledge",
        "Comfortable reading and writing TypeScript across a mid-sized codebase",
        "Has shipped something used by non-technical end users before",
      ],
    },
  },
  {
    slug: "ledger",
    fullName: "Dana Whitfield",
    companyName: "Ledger & Co",
    website: "https://ledgerandco.example.com",
    description: "Reconciliation software for small accounting firms.",
    job: {
      title: "Product Designer",
      location: "Boston, MA (Hybrid, 2 days/week)",
      mode: "hybrid",
      level: "mid",
      salaryMin: 92000,
      salaryMax: 118000,
      tags: ["Product Design", "Figma", "Fintech", "Research"],
      description:
        "Ledger & Co is a 22-person team building reconciliation software for small accounting firms. We're hiring our second product designer to work directly with the founding team on a redesign of our core ledger view, which hasn't changed meaningfully in two years. You'll run your own customer interviews rather than working from a research team's handoff, since we don't have one yet.",
      responsibilities: [
        "Lead end-to-end redesign of the core ledger reconciliation view",
        "Run and synthesize customer interviews with practicing accountants",
        "Build and maintain our Figma component library alongside engineering",
        "Present design rationale directly to the two founders in weekly reviews",
      ],
      requirements: [
        "4+ years of product design experience, ideally on a data-dense product",
        "A portfolio that shows research-informed decisions, not just visuals",
        "Comfortable working without a dedicated research or content team",
        "Based within commuting distance of Boston for twice-weekly office days",
      ],
    },
  },
  {
    slug: "meridian",
    fullName: "Tom Alvarez",
    companyName: "Meridian Cloud",
    website: "https://meridiancloud.example.com",
    description: "Managed hosting for mid-sized e-commerce companies.",
    job: {
      title: "DevOps Engineer",
      location: "Austin, TX (Onsite)",
      mode: "onsite",
      level: "senior",
      salaryMin: null,
      salaryMax: null,
      tags: ["AWS", "Terraform", "CI/CD"],
      description:
        "Meridian Cloud provides managed hosting for mid-sized e-commerce companies. We're looking for a senior DevOps engineer to help modernize our deployment pipeline, which is currently a mix of Jenkins and hand-run scripts. You'd join a small infrastructure team of three and have a lot of latitude to propose and implement changes.",
      responsibilities: [
        "Migrate existing Jenkins pipelines to a modern CI/CD platform",
        "Introduce Terraform for infrastructure currently managed by hand",
        "Reduce average deployment time, currently around 40 minutes",
      ],
      requirements: [
        "5+ years in a DevOps or infrastructure engineering role",
        "Hands-on experience with AWS and Terraform in production",
        "Has led at least one CI/CD migration before",
      ],
    },
  },
  {
    slug: "brightpeak",
    fullName: "Casey Nolan",
    companyName: "BrightPeak",
    website: "",
    description: "Growth marketing for consumer apps.",
    job: {
      title: "Growth Marketing Manager",
      location: "Remote",
      mode: "remote",
      level: "mid",
      salaryMin: null,
      salaryMax: null,
      tags: ["Growth", "Marketing", "Fast-Paced", "Self-Starter"],
      description:
        "BrightPeak is looking for a growth marketing manager to join our fast-paced, high-energy team. You'll wear many hats and help drive user acquisition across channels. Must be a self-starter with a growth mindset who thrives in ambiguity.",
      responsibilities: ["Own growth", "Drive acquisition", "Other duties as assigned"],
      requirements: ["Self-starter", "Growth mindset", "Thick skin"],
    },
  },
  {
    slug: "vantage",
    fullName: "Renee Foster",
    companyName: "Vantage Systems",
    website: "",
    description: "Internal tooling for logistics providers.",
    job: {
      title: "Junior QA Analyst",
      location: "Columbus, OH (Onsite)",
      mode: "onsite",
      level: "junior",
      salaryMin: 19000,
      salaryMax: 21000,
      tags: ["QA", "Manual Testing"],
      description:
        "Vantage Systems needs a junior QA analyst to help test our internal tools. Full-time position, onsite only, five days a week.",
      responsibilities: ["Run manual test cases", "Log bugs in the tracker"],
      requirements: ["Attention to detail"],
    },
  },
  {
    slug: "solstice",
    fullName: "J. Bishop",
    companyName: "Solstice Tech Park",
    website: "",
    description: "",
    job: {
      title: "Software Engineer (Night Shift, Onsite Only)",
      location: "Onsite Only",
      mode: "onsite",
      level: "mid",
      salaryMin: null,
      salaryMax: null,
      tags: ["Full Stack", "Fast-Paced", "Rockstar"],
      description:
        "We are a leading company in the industry looking for a rockstar engineer. As part of our process, you'll complete an unpaid take-home assessment: a full working feature, built and deployed, due within 24 hours of receiving the brief. Reply-all to the entire hiring team once submitted so everyone can review simultaneously. Please note: any broken link in your submission will result in instant rejection, no exceptions.",
      responsibilities: ["Complete assigned tasks", "Available on short notice", "Other duties as assigned"],
      requirements: ["Self-starter", "Comfortable in a fast-paced environment"],
    },
  },
  {
    slug: "anchorpoint",
    fullName: "Wendy Suh",
    companyName: "Anchorpoint",
    website: "https://anchorpoint.example.com",
    description: "Inventory software for independent bookstores.",
    job: {
      title: "Customer Success Associate",
      location: "Remote (US)",
      mode: "remote",
      level: "junior",
      salaryMin: 52000,
      salaryMax: 62000,
      tags: ["Customer Success", "SaaS", "Onboarding"],
      description:
        "Anchorpoint makes inventory software for independent bookstores. We're hiring our first dedicated customer success associate to handle onboarding calls and support tickets as our customer base grows past 300 stores. You'd report directly to the founder for now, with a plan to build out a small team under you within the year if things go well.",
      responsibilities: [
        "Run onboarding calls for new bookstore customers",
        "Triage and resolve support tickets within a one-business-day target",
        "Document common issues to build out our public help center",
      ],
      requirements: [
        "1-2 years in a customer-facing support or success role",
        "Comfortable being the first hire on a new function",
      ],
    },
  },
  {
    slug: "buzzwave",
    fullName: "K. Ramos",
    companyName: "BuzzWave Media",
    website: "",
    description: "",
    job: {
      title: "Marketing Intern (Unpaid)",
      location: "Onsite",
      mode: "onsite",
      level: "junior",
      salaryMin: null,
      salaryMax: null,
      tags: ["Marketing", "Social Media"],
      description:
        "Confidential client in the media space seeks an unpaid intern for an immediate start. Must be available to start the trial project tonight and submit by tomorrow morning. Great exposure opportunity for the right candidate.",
      responsibilities: ["Support the marketing team", "Other duties as assigned"],
      requirements: ["Available immediately"],
    },
  },
  {
    slug: "cartography",
    fullName: "Elena Popescu",
    companyName: "Cartography Insights",
    website: "https://cartographyinsights.example.com",
    description: "Delivery network modeling for logistics companies.",
    job: {
      title: "Data Analyst",
      location: "Denver, CO (Hybrid, 3 days/week)",
      mode: "hybrid",
      level: "mid",
      salaryMin: 78000,
      salaryMax: 95000,
      tags: ["SQL", "dbt", "Analytics"],
      description:
        "Cartography Insights helps mid-sized logistics companies model their delivery networks. We're hiring a data analyst to join our small analytics team and take ownership of a handful of recurring reporting pipelines built in dbt, plus ad hoc analysis for our customer success team.",
      responsibilities: [
        "Maintain and extend existing dbt models for delivery network reporting",
        "Build ad hoc analyses requested by the customer success team",
        "Flag data quality issues upstream before they reach dashboards",
      ],
      requirements: [
        "2+ years working with SQL in a production analytics context",
        "Some exposure to dbt or a similar transformation tool",
      ],
    },
  },
  {
    slug: "rivergate",
    fullName: "Sam O'Doherty",
    companyName: "Rivergate Labs",
    website: "https://rivergatelabs.example.com",
    description: "Compliance tracking software for construction firms.",
    job: {
      title: "Full-Stack Engineer",
      location: "Remote (US)",
      mode: "remote",
      level: "senior",
      salaryMin: 140000,
      salaryMax: 165000,
      tags: ["Node.js", "React", "Postgres", "GraphQL"],
      description:
        "Rivergate Labs builds compliance tracking software for construction firms. We're hiring a senior full-stack engineer to work across our Node.js API and React frontend, with a focus on a permitting workflow feature that's currently our top customer request. You'd work in a team of five, with direct access to the two engineers who built the original system.",
      responsibilities: [
        "Design and ship the new permitting workflow feature end-to-end",
        "Work across the Node.js API and React frontend as needed",
        "Pair with newer engineers on the team during onboarding",
        "Participate in an on-call rotation covering roughly one week in five",
      ],
      requirements: [
        "5+ years of full-stack experience with Node.js and React",
        "Experience with GraphQL APIs in production",
        "Comfortable being part of a small on-call rotation",
      ],
    },
  },
  {
    slug: "skyline",
    fullName: "Grace Liu",
    companyName: "Skyline Robotics",
    website: "https://skylinerobotics.example.com",
    description: "Autonomous inspection robots for industrial sites.",
    job: {
      title: "Embedded Systems Engineer",
      location: "Pittsburgh, PA (Onsite)",
      mode: "onsite",
      level: "senior",
      salaryMin: 130000,
      salaryMax: 160000,
      tags: ["C++", "Embedded Linux", "Robotics", "Sensors"],
      description:
        "Skyline Robotics builds autonomous inspection robots that climb industrial storage tanks to check for corrosion. We're hiring a senior embedded systems engineer to own the firmware that coordinates our sensor array and drive motors. You'd work in our Pittsburgh lab alongside two mechanical engineers and one other firmware engineer, with real field-test trips roughly once a month.",
      responsibilities: [
        "Own firmware for sensor fusion and motor control on the inspection robot",
        "Debug field-reported issues using logs pulled from real deployments",
        "Work directly with mechanical engineering on hardware-firmware tradeoffs",
        "Travel roughly monthly to client sites for field testing",
      ],
      requirements: [
        "6+ years writing embedded C++ for real-time systems",
        "Experience with embedded Linux and sensor integration",
        "Comfortable debugging issues that only reproduce in the field",
      ],
    },
  },
  {
    slug: "pinehurst",
    fullName: "Omar Haddad",
    companyName: "Pinehurst Legal Tech",
    website: "https://pinehurstlegal.example.com",
    description: "Document review software for small law firms.",
    job: {
      title: "Backend Engineer",
      location: "Remote (US)",
      mode: "remote",
      level: "mid",
      salaryMin: null,
      salaryMax: null,
      tags: ["Python", "Django", "Postgres"],
      description:
        "Pinehurst Legal Tech builds document review software for small law firms. We're hiring a backend engineer to help scale our document indexing pipeline as we onboard larger firms with bigger case files.",
      responsibilities: [
        "Improve throughput of the document indexing pipeline",
        "Build API endpoints for the firm-facing search feature",
        "Write migrations for an aging Django ORM schema",
      ],
      requirements: [
        "3+ years with Python and a web framework in production",
        "Experience with Postgres performance tuning",
      ],
    },
  },
  {
    slug: "wanderlust",
    fullName: "Priya Deshmukh",
    companyName: "Wanderlust Travel Co",
    website: "",
    description: "",
    job: {
      title: "Support Specialist",
      location: "Remote",
      mode: "remote",
      level: "junior",
      salaryMin: null,
      salaryMax: null,
      tags: ["Support", "Fast-Paced"],
      description: "Join our fast-paced team helping travelers on the go. Great growth opportunity for a hustler.",
      responsibilities: ["Handle tickets", "Other duties as assigned"],
      requirements: ["Self-starter", "Hustle"],
    },
  },
  {
    slug: "cobalt",
    fullName: "Nina Petrova",
    companyName: "Cobalt Health",
    website: "https://cobalthealth.example.com",
    description: "Clinical data platform for hospital networks.",
    job: {
      title: "Data Engineer",
      location: "Seattle, WA (Hybrid, 2 days/week)",
      mode: "hybrid",
      level: "senior",
      salaryMin: 145000,
      salaryMax: 175000,
      tags: ["Python", "Airflow", "Healthcare", "Postgres"],
      description:
        "Cobalt Health builds a clinical data platform used by three regional hospital networks to track patient outcomes across departments. We're hiring a senior data engineer to redesign our Airflow pipelines, which currently break several times a month under load from a new hospital system we onboarded last quarter.",
      responsibilities: [
        "Redesign the core Airflow DAGs to handle current data volume reliably",
        "Set up monitoring so pipeline failures are caught before clinicians notice",
        "Partner with the compliance team on HIPAA-relevant data handling",
        "Onboard the data pipeline for a fourth hospital network later this year",
      ],
      requirements: [
        "5+ years building production data pipelines",
        "Experience with Airflow or a comparable orchestration tool",
        "Comfortable working under healthcare compliance constraints",
      ],
    },
  },
  {
    slug: "greenleaf",
    fullName: "Derek Owusu",
    companyName: "GreenLeaf Logistics",
    website: "https://greenleaflogistics.example.com",
    description: "Regional freight scheduling for perishable goods.",
    job: {
      title: "Operations Analyst",
      location: "Chicago, IL (Onsite)",
      mode: "onsite",
      level: "mid",
      salaryMin: 68000,
      salaryMax: 82000,
      tags: ["Operations", "Excel", "Logistics"],
      description:
        "GreenLeaf Logistics schedules refrigerated freight for regional produce distributors. We're hiring an operations analyst to help our dispatch team spot scheduling inefficiencies before they turn into late deliveries, working from our Chicago office five days a week.",
      responsibilities: [
        "Review daily dispatch schedules for routing inefficiencies",
        "Build weekly reports on on-time delivery performance",
        "Work with drivers and dispatchers to resolve recurring delay patterns",
      ],
      requirements: [
        "2+ years in logistics, dispatch, or operations analysis",
        "Advanced Excel skills; comfortable with large schedule datasets",
      ],
    },
  },
  {
    slug: "fastlane",
    fullName: "Chris Doyle",
    companyName: "Fastlane Ventures",
    website: "",
    description: "",
    job: {
      title: "Growth Hacker",
      location: "Remote",
      mode: "remote",
      level: "mid",
      salaryMin: null,
      salaryMax: null,
      tags: ["Growth", "Unpaid Trial"],
      description:
        "We move fast and expect the same from you. Before we extend an offer, complete an unpaid two-week trial project on your own time. We need someone available immediately who can turn things around within 12 hours of a request, no exceptions.",
      responsibilities: ["Own growth experiments", "Other duties as assigned"],
      requirements: ["Available immediately", "Comfortable with ambiguity"],
    },
  },
  {
    slug: "harborview",
    fullName: "Ana Beaumont",
    companyName: "Harborview Studio",
    website: "https://harborviewstudio.example.com",
    description: "Independent UX research studio for B2B products.",
    job: {
      title: "UX Researcher",
      location: "Remote (US/Canada)",
      mode: "remote",
      level: "mid",
      salaryMin: 100000,
      salaryMax: 125000,
      tags: ["UX Research", "B2B", "Qualitative"],
      description:
        "Harborview Studio is an independent research studio that runs UX research engagements for B2B software teams who don't have an in-house researcher yet. We're hiring our third researcher to run interview studies and usability tests across two to three client engagements at a time, with direct client contact from day one rather than working through an account manager layer.",
      responsibilities: [
        "Run qualitative interview studies and usability tests for client engagements",
        "Present findings directly to client product teams, not just internally",
        "Help refine our internal research repository and methodology docs",
        "Manage two to three concurrent client engagements",
      ],
      requirements: [
        "3+ years running qualitative UX research in a B2B context",
        "Comfortable presenting directly to external clients",
        "Experience managing multiple concurrent research engagements",
      ],
    },
  },
  {
    slug: "ironclad",
    fullName: "Victor Reyes",
    companyName: "Ironclad Security",
    website: "https://ironcladsecurity.example.com",
    description: "Security monitoring for financial services companies.",
    job: {
      title: "Security Engineer",
      location: "Remote (US)",
      mode: "remote",
      level: "senior",
      salaryMin: 155000,
      salaryMax: 190000,
      tags: ["Security", "SIEM", "Incident Response", "Cloud"],
      description:
        "Ironclad Security provides managed security monitoring for mid-sized financial services companies. We're hiring a senior security engineer to help build out detection rules in our SIEM and lead incident response for client environments, working within a small on-call team of four engineers covering roughly one week in four.",
      responsibilities: [
        "Build and tune detection rules across client SIEM deployments",
        "Lead incident response engagements for client security events",
        "Participate in a one-week-in-four on-call rotation",
        "Mentor two junior analysts on detection engineering",
      ],
      requirements: [
        "5+ years in security engineering or incident response",
        "Hands-on experience with a SIEM platform in production",
        "Comfortable being part of a small on-call rotation",
      ],
    },
  },
  {
    slug: "milltown",
    fullName: "Barb Ellison",
    companyName: "Milltown Foods",
    website: "",
    description: "",
    job: {
      title: "Junior Accountant",
      location: "Onsite",
      mode: "onsite",
      level: "junior",
      salaryMin: null,
      salaryMax: null,
      tags: ["Accounting"],
      description: "Looking for a junior accountant to join our team.",
      responsibilities: ["General accounting duties"],
      requirements: ["Accounting degree"],
    },
  },
  {
    slug: "alderbrook",
    fullName: "Mei Lin",
    companyName: "Alderbrook Studios",
    website: "https://alderbrookstudios.example.com",
    description: "Independent narrative game studio.",
    job: {
      title: "Game Designer",
      location: "Remote (US/Canada)",
      mode: "remote",
      level: "mid",
      salaryMin: 90000,
      salaryMax: 115000,
      tags: ["Game Design", "Narrative", "Unity"],
      description:
        "Alderbrook Studios is a nine-person team finishing our first narrative-driven adventure game for a 2027 release. We're hiring a mid-level game designer to own puzzle and pacing design for the game's back half, working closely with our writer and one other designer already on the team.",
      responsibilities: [
        "Design and iterate on puzzle and pacing for the game's second half",
        "Build and maintain level layouts in Unity alongside engineering",
        "Playtest weekly with the internal team and incorporate feedback",
        "Collaborate directly with the writer on how mechanics reinforce story beats",
      ],
      requirements: [
        "3+ years of game design experience, ideally narrative-focused",
        "Comfortable working in Unity, even if not primarily an engineer",
        "Has shipped at least one game, even a small one",
      ],
    },
  },
  {
    slug: "prairiemutual",
    fullName: "Hank Sorensen",
    companyName: "Prairie Mutual Insurance",
    website: "https://prairiemutual.example.com",
    description: "Regional insurer serving the upper Midwest.",
    job: {
      title: "Actuarial Analyst",
      location: "Omaha, NE (Onsite)",
      mode: "onsite",
      level: "mid",
      salaryMin: 75000,
      salaryMax: 92000,
      tags: ["Actuarial", "Insurance", "Excel"],
      description:
        "Prairie Mutual Insurance underwrites home and auto policies across five Midwest states. We're hiring an actuarial analyst to support pricing reviews and reserve estimates for our home insurance line, working in our Omaha office alongside two senior actuaries.",
      responsibilities: [
        "Support quarterly reserve estimates for the home insurance line",
        "Build pricing models for new state market entries",
        "Prepare summary reports for state regulatory filings",
      ],
      requirements: [
        "2+ years in an actuarial or quantitative analyst role",
        "Progress toward ASA credential preferred",
        "Advanced Excel and comfort with large policy datasets",
      ],
    },
  },
  {
    slug: "bytewave",
    fullName: "Sofia Marchetti",
    companyName: "Bytewave Cloud",
    website: "https://bytewavecloud.example.com",
    description: "Infrastructure monitoring for mid-market SaaS companies.",
    job: {
      title: "Site Reliability Engineer",
      location: "Remote (US/EU)",
      mode: "remote",
      level: "senior",
      salaryMin: 150000,
      salaryMax: 180000,
      tags: ["SRE", "Kubernetes", "Observability", "Go"],
      description:
        "Bytewave Cloud runs the monitoring backend behind an infrastructure observability product used by about 200 mid-market SaaS companies. We're hiring a senior SRE to reduce on-call load, which is currently higher than the team wants, by fixing the root causes behind our most common pages rather than just responding to them faster.",
      responsibilities: [
        "Identify and fix root causes behind the team's most frequent on-call pages",
        "Improve our own internal observability of the monitoring pipeline itself",
        "Participate in a one-week-in-five on-call rotation",
        "Mentor two engineers newer to production incident response",
      ],
      requirements: [
        "5+ years in an SRE, infrastructure, or backend role with production on-call experience",
        "Strong Kubernetes and Go experience",
        "Has led at least one significant reliability improvement effort before",
      ],
    },
  },
  {
    slug: "comet",
    fullName: "Devon Marsh",
    companyName: "Comet Retail Group",
    website: "",
    description: "",
    job: {
      title: "Merchandising Coordinator",
      location: "Onsite",
      mode: "onsite",
      level: "junior",
      salaryMin: null,
      salaryMax: null,
      tags: ["Retail", "Fast-Paced"],
      description:
        "Join our fast-paced retail team as a merchandising coordinator. Great opportunity to wear many hats in a growing company.",
      responsibilities: ["Support merchandising team", "Other duties as assigned"],
      requirements: ["Self-starter", "Team player"],
    },
  },
  {
    slug: "northstarbiotech",
    fullName: "Dr. Aisha Kone",
    companyName: "Northstar Biotech",
    website: "https://northstarbiotech.example.com",
    description: "Early-stage biotech developing diagnostic assays.",
    job: {
      title: "Lab Data Coordinator",
      location: "Cambridge, MA (Onsite)",
      mode: "onsite",
      level: "mid",
      salaryMin: 62000,
      salaryMax: 74000,
      tags: ["Lab Operations", "Data Entry", "LIMS"],
      description:
        "Northstar Biotech develops diagnostic assays for early-stage cancer detection. We're hiring a lab data coordinator to manage our LIMS records and keep sample tracking accurate as our lab scales from one to two shifts.",
      responsibilities: [
        "Maintain accurate sample records in the lab's LIMS system",
        "Coordinate handoffs between the first and second lab shifts",
        "Flag data discrepancies to the lab manager before they compound",
      ],
      requirements: [
        "1-2 years in a lab operations or data coordination role",
        "Comfortable working with a LIMS or similar lab tracking system",
      ],
    },
  },
  {
    slug: "vellum",
    fullName: "Ruth Okafor",
    companyName: "Vellum Publishing",
    website: "",
    description: "",
    job: {
      title: "Editorial Assistant",
      location: "Onsite",
      mode: "onsite",
      level: "junior",
      salaryMin: 16000,
      salaryMax: 18000,
      tags: ["Editorial", "Publishing"],
      description: "Looking for an editorial assistant to support our small press.",
      responsibilities: ["Proofread manuscripts", "Support editors"],
      requirements: ["Strong writing skills"],
    },
  },
  {
    slug: "quickstep",
    fullName: "Marco Diaz",
    companyName: "Quickstep Delivery",
    website: "",
    description: "",
    job: {
      title: "Driver Ops Lead",
      location: "Onsite",
      mode: "onsite",
      level: "mid",
      salaryMin: null,
      salaryMax: null,
      tags: ["Logistics", "Operations"],
      description:
        "Before we can bring you on full-time, complete an unpaid trial shift coordinating our driver schedule. Reply-all to the ops team with your availability tonight so everyone can plan around it.",
      responsibilities: ["Coordinate driver schedules", "Other duties as assigned"],
      requirements: ["Available immediately"],
    },
  },
  {
    slug: "sablefinch",
    fullName: "Gregory Vance",
    companyName: "Sable & Finch Law",
    website: "https://sablefinchlaw.example.com",
    description: "Boutique litigation firm specializing in commercial disputes.",
    job: {
      title: "Paralegal",
      location: "Chicago, IL (Onsite)",
      mode: "onsite",
      level: "mid",
      salaryMin: 58000,
      salaryMax: 70000,
      tags: ["Legal", "Litigation", "Paralegal"],
      description:
        "Sable & Finch Law is a twelve-attorney litigation boutique handling commercial disputes for mid-sized businesses. We're hiring a paralegal to support two partners directly on discovery-heavy cases, with real client contact rather than being routed entirely through associates.",
      responsibilities: [
        "Manage discovery document review and production for active cases",
        "Draft routine filings for partner review",
        "Coordinate directly with clients on document requests",
      ],
      requirements: [
        "3+ years as a litigation paralegal",
        "Experience with e-discovery platforms",
        "Comfortable with direct client communication",
      ],
    },
  },
  {
    slug: "orbitpayments",
    fullName: "Isabel Cruz",
    companyName: "Orbit Payments",
    website: "https://orbitpayments.example.com",
    description: "Payment processing for online marketplaces.",
    job: {
      title: "Fraud Analyst",
      location: "Remote (US)",
      mode: "remote",
      level: "mid",
      salaryMin: 85000,
      salaryMax: 105000,
      tags: ["Fraud", "Payments", "SQL"],
      description:
        "Orbit Payments processes payments for a network of online marketplaces. We're hiring a fraud analyst to investigate flagged transactions and tune our detection rules, working closely with the two engineers who maintain the fraud-scoring pipeline.",
      responsibilities: [
        "Investigate transactions flagged by the fraud-scoring pipeline",
        "Propose rule changes to reduce false positives without missing real fraud",
        "Write weekly summaries of fraud trends for the risk team",
      ],
      requirements: [
        "2+ years in fraud, risk, or trust and safety analysis",
        "Comfortable writing SQL queries against transaction data",
      ],
    },
  },
  {
    slug: "thistle",
    fullName: "Paula Bennett",
    companyName: "Thistle Home Goods",
    website: "https://thistlehomegoods.example.com",
    description: "Direct-to-consumer home goods brand.",
    job: {
      title: "E-commerce Manager",
      location: "Remote (US)",
      mode: "remote",
      level: "mid",
      salaryMin: 80000,
      salaryMax: 100000,
      tags: ["E-commerce", "Shopify", "DTC"],
      description:
        "Thistle Home Goods is a direct-to-consumer home goods brand selling through our own Shopify storefront. We're hiring an e-commerce manager to own site merchandising and conversion optimization as we prepare for our busiest quarter.",
      responsibilities: [
        "Own site merchandising and product page optimization on Shopify",
        "Run A/B tests on checkout flow and report results to leadership",
        "Coordinate with the small design team on seasonal storefront updates",
      ],
      requirements: [
        "3+ years managing a DTC e-commerce storefront, ideally on Shopify",
        "Comfortable interpreting conversion and funnel analytics",
      ],
    },
  },
];

module.exports = { COMPANIES, seedOne };

async function seedOne(entry, index) {
  const client = createClient(URL, KEY);
  const email = `employer.${entry.slug}.${STAMP}${index}@example.com`;
  const password = "SeedPassword123!";

  const { data: signUpData, error: signUpError } = await client.auth.signUp({
    email,
    password,
    options: { data: { role: "employer", full_name: entry.fullName } },
  });
  if (signUpError || !signUpData.user) {
    console.error(`[${entry.companyName}] signup failed:`, signUpError?.message);
    return;
  }

  const { data: companyRow, error: companyError } = await client
    .from("companies")
    .insert({
      owner_id: signUpData.user.id,
      name: entry.companyName,
      website: entry.website || null,
      description: entry.description || null,
    })
    .select("id")
    .single();
  if (companyError) {
    console.error(`[${entry.companyName}] company insert failed:`, companyError.message);
    return;
  }

  const job = entry.job;
  const { error: jobError } = await client.from("jobs").insert({
    company_id: companyRow.id,
    title: job.title,
    location: job.location,
    mode: job.mode,
    level: job.level,
    salary_min: job.salaryMin,
    salary_max: job.salaryMax,
    currency: "USD",
    tags: job.tags,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    status: "published",
  });
  if (jobError) {
    console.error(`[${entry.companyName}] job insert failed:`, jobError.message);
    return;
  }

  console.log(`OK  ${entry.companyName} — ${job.title}`);
}

// Only auto-run when executed directly (`node scripts/seed-demo-data.js`),
// not when required as a module — lets a one-off top-up script reuse
// COMPANIES/seedOne for a subset without re-seeding everything.
if (require.main === module) {
  (async () => {
    console.log(`Seeding ${COMPANIES.length} companies...`);
    for (let i = 0; i < COMPANIES.length; i++) {
      await seedOne(COMPANIES[i], i);
    }
    console.log("Done.");
  })();
}
