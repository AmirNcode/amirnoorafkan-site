export type LedgerEntry = {
  period: string;
  title: string;
  value?: string;
  detail: string;
  confirm?: boolean;
};

// Newest first. `confirm` marks entries Amir should double-check at preview review.
export const ledger: LedgerEntry[] = [
  {
    period: '2025 — now',
    title: 'Independent — building products',
    detail:
      'Consulting for small businesses (Shopify optimization, SEO, store setup), prototyping SaaS products with Next.js and Supabase, learning to build faster with AI tools, and running the tech behind Haus of Balloons. Also started a YouTube channel focused on investing.',
  },
  {
    period: 'Jun 2026',
    title: 'Shipped three apps in one summer',
    value: '×3',
    detail:
      'World Cup 2026 Teams & Stats, the Haus of Balloons site, and SimpleQR — all designed, built, and deployed within six weeks. All three are live and in use today.',
  },
  {
    period: '2023 — 2025',
    title: 'Project controls, Aecon — York & Goreway BESS',
    value: '$160M+',
    detail:
      'Data Analyst on Aecon’s Project Controls team (PMO), running cost control on a ~$160M portfolio of heavy construction — including the York and Goreway battery energy storage systems (~$120M combined) built for Capital Power. Earned-value tracking, SAP data pipelines that saved 5 hours a week, and Power BI dashboards the project teams actually used.',
    confirm: true,
  },
  {
    period: '2023',
    title: 'Senior Data Analyst, Element Fleet',
    value: '30,000+',
    detail:
      'Built a Python system that parsed contracts and audited billing discrepancies, expediting the audit of 30,000+ agreements. Automated weekly PostgreSQL/Snowflake data pulls with Alteryx, cutting a 3–4 hour job to 1 hour.',
  },
  {
    period: '2021 — 2023',
    title: 'Data Analyst, Aecon',
    detail:
      'Led a full-cycle in-house fleet management data platform — database design, automated workflows, and Power BI dashboards for senior leadership. Geospatial fuel analysis with Python and Databricks that turned sensor data into real cost savings.',
  },
  {
    period: '2020 — 2021',
    title: 'Freelance web design & consulting',
    value: '+50%',
    detail:
      'Redesigned an e-commerce client’s site and SEO for a 50% traffic increase, and built a marketing site for an ad agency targeting the Qatar 2022 World Cup — six years before shipping my own World Cup app.',
  },
  {
    period: '2019 — 2020',
    title: 'Co-founded Atlys Networks',
    value: '2,000+',
    detail:
      'A data-privacy platform helping people understand and control their personal data. Backed by startup programs and accelerators, featured at conferences, installed by 2,000+ users. Led design, business development, and the dev team.',
  },
  {
    period: '2016 — 2020',
    title: 'Engineering degrees & first research role',
    detail:
      'B.Eng. Materials Engineering with an Economics minor at McMaster (2018), M.Eng. Aerospace at Toronto Metropolitan University (2020). Before that: research engineer co-op at ArcelorMittal Dofasco, developing a data-driven method for assessing steel quality with X-ray emissions.',
  },
];
