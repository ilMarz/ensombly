import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ─── Projects ────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: 'LexAI',
    tagline: 'AI-powered contract review that cuts legal costs by 80%',
    description: `LexAI uses large language models to analyze contracts, flag risky clauses, and suggest improvements in seconds.\n\nLaw firms charge $500/hour for work that takes us 30 seconds. We're making legal review accessible to every startup and SME.\n\nAlready piloting with 3 law firms and 12 startups. Looking to close our pre-seed round.`,
    stage: 'mvp' as const,
    sector: 'Legaltech',
    stack: ['Next.js', 'Python', 'OpenAI', 'Supabase', 'LangChain'],
    website_url: 'https://lexai.example.com',
    github_url: null,
    founder: 'pietro',
  },
  {
    title: 'GreenRoute',
    tagline: 'Optimize logistics routes to cut carbon emissions by 40%',
    description: `GreenRoute helps fleet operators reduce fuel consumption and CO2 output by combining real-time traffic data with AI-driven route optimization.\n\nIntegrates with existing TMS systems. No migration required — just plug in and save.`,
    stage: 'prototype' as const,
    sector: 'SaaS',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Google Maps API', 'TensorFlow'],
    website_url: null,
    github_url: 'https://github.com/example/greenroute',
    founder: 'mario',
  },
  {
    title: 'MedBuddy',
    tagline: 'Your AI health companion that actually understands medical jargon',
    description: `MedBuddy bridges the gap between patients and healthcare. Upload your lab results, prescription, or discharge summary and get a plain-English explanation plus follow-up questions to ask your doctor.\n\nBuilt by a team of doctors and engineers. HIPAA-compliant from day one.`,
    stage: 'idea' as const,
    sector: 'Healthtech',
    stack: ['React Native', 'Node.js', 'GPT-4', 'Firebase'],
    website_url: null,
    github_url: null,
    founder: 'pietro',
  },
  {
    title: 'CodeTutor',
    tagline: 'Learn to code with an AI mentor that adapts to your pace',
    description: `CodeTutor is not another tutorial platform. It's a 1-on-1 AI tutor that knows exactly where you're stuck, gives you targeted exercises, and celebrates your progress.\n\nOver 8,000 active learners. 94% retention rate after 30 days — vs 12% industry average.`,
    stage: 'growth' as const,
    sector: 'Edtech',
    stack: ['Next.js', 'Django', 'PostgreSQL', 'Redis', 'OpenAI'],
    website_url: 'https://codetutor.example.com',
    github_url: null,
    founder: 'mario',
  },
  {
    title: 'Vaultly',
    tagline: 'DeFi savings account with fiat-simple UX for everyday people',
    description: `DeFi yields are 10x better than your bank, but the UX is terrible. Vaultly wraps the best DeFi protocols in an interface your grandma can use.\n\nConnect your bank, set a savings goal, and we do the rest. No seed phrases, no gas fees to manage.`,
    stage: 'mvp' as const,
    sector: 'Fintech',
    stack: ['React', 'Solidity', 'Ethers.js', 'Node.js', 'Plaid'],
    website_url: 'https://vaultly.example.com',
    github_url: null,
    founder: 'pietro',
  },
  {
    title: 'IndieForge',
    tagline: 'The publishing platform built for indie game developers',
    description: `Steam takes 30%. We take 10% and give you tools no one else offers: built-in playtesting network, localization AI, and a community of 50k gamers who want to discover your game early.\n\nCurrently in closed beta with 200 developers.`,
    stage: 'prototype' as const,
    sector: 'Gaming',
    stack: ['Next.js', 'Rust', 'PostgreSQL', 'Unity SDK', 'Godot Plugin'],
    website_url: null,
    github_url: 'https://github.com/example/indieforge',
    founder: 'mario',
  },
  {
    title: 'OpenSign',
    tagline: 'Open-source DocuSign alternative — free forever for small teams',
    description: `DocuSign costs $40/month for basic features. OpenSign is Apache-2.0 licensed, self-hostable, and has all the features 95% of teams need.\n\nAlready 2,400 GitHub stars in 3 months. Looking for contributors and a co-founder to build the hosted version.`,
    stage: 'mvp' as const,
    sector: 'Open Source',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'PDF.js', 'Docker'],
    website_url: 'https://opensign.example.com',
    github_url: 'https://github.com/example/opensign',
    founder: 'pietro',
  },
  {
    title: 'HireFlow',
    tagline: 'Recruitment automation that finds great candidates in 48 hours',
    description: `Hiring takes 3 months on average. HireFlow cuts this to 2 weeks by automating sourcing, screening, and scheduling — while keeping humans in the loop for final decisions.\n\n€2.4M ARR, growing 20% MoM. Raising Series A.`,
    stage: 'growth' as const,
    sector: 'SaaS',
    stack: ['React', 'Python', 'GPT-4', 'AWS', 'Salesforce API'],
    website_url: 'https://hireflow.example.com',
    github_url: null,
    founder: 'mario',
  },
  {
    title: 'NutriLens',
    tagline: 'Take a photo of your meal — instantly get macros, micronutrients, and advice',
    description: `NutriLens uses computer vision and a nutritional database of 2M+ foods to give you instant breakdown of anything you eat. No barcode scanning, no manual logging.\n\nPerfect for athletes, people with dietary restrictions, and anyone serious about their health.`,
    stage: 'prototype' as const,
    sector: 'Healthtech',
    stack: ['React Native', 'Python', 'TensorFlow', 'FastAPI', 'Supabase'],
    website_url: null,
    github_url: null,
    founder: 'pietro',
  },
  {
    title: 'Mercatino',
    tagline: 'Hyperlocal marketplace for artisans and local producers',
    description: `Etsy is global. Amazon is corporate. Mercatino is your neighborhood — a platform where local artisans, farmers, and makers sell directly to people within 20km.\n\nStarting in Northern Italy. 340 sellers onboarded in the first month.`,
    stage: 'idea' as const,
    sector: 'E-commerce',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Mapbox'],
    website_url: null,
    github_url: null,
    founder: 'mario',
  },
  {
    title: 'FlowDesk',
    tagline: 'Customer support for SaaS — reply faster, churn less',
    description: `FlowDesk combines a ticketing system, live chat, and AI draft replies into one tool that integrates with your existing SaaS stack.\n\nBuilt for teams of 2-20. No enterprise bloat, no annual contracts.`,
    stage: 'idea' as const,
    sector: 'SaaS',
    stack: ['React', 'Elixir', 'Phoenix', 'PostgreSQL', 'OpenAI'],
    website_url: null,
    github_url: null,
    founder: 'pietro',
  },
];

// ─── Roles per project ────────────────────────────────────────────────────────

const ROLES: Record<string, Array<{
  title: string;
  description: string;
  skills: string[];
  commitment_hours: number;
  compensation_type: 'equity' | 'revenue_share' | 'voluntary' | 'paid';
  is_open: boolean;
}>> = {
  LexAI: [
    {
      title: 'Full-Stack Engineer',
      description: 'Own the end-to-end product. We move fast — you ship features, not tickets.',
      skills: ['Next.js', 'TypeScript', 'Python', 'Supabase'],
      commitment_hours: 20,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Legal Advisor',
      description: 'Help us make sure we\'re covering the right use-cases and talking to lawyers in their language.',
      skills: ['Contract Law', 'M&A', 'SaaS Contracts'],
      commitment_hours: 5,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Growth Marketer',
      description: 'Drive signups from law firms and SMEs. SEO, LinkedIn, outbound.',
      skills: ['SEO', 'LinkedIn Ads', 'Cold Outreach', 'Copywriting'],
      commitment_hours: 15,
      compensation_type: 'revenue_share',
      is_open: false,
    },
  ],
  GreenRoute: [
    {
      title: 'ML Engineer',
      description: 'Build and improve our route optimization model. Experience with graph algorithms a plus.',
      skills: ['Python', 'TensorFlow', 'Graph Algorithms', 'OR-Tools'],
      commitment_hours: 25,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Sales Lead (Logistics)',
      description: 'Open doors with fleet operators and logistics managers. You know the industry.',
      skills: ['B2B Sales', 'Logistics', 'CRM', 'Negotiation'],
      commitment_hours: 10,
      compensation_type: 'revenue_share',
      is_open: true,
    },
  ],
  MedBuddy: [
    {
      title: 'React Native Developer',
      description: 'Build a mobile experience that patients love. Accessibility and simplicity are the north star.',
      skills: ['React Native', 'TypeScript', 'Expo', 'Healthcare UX'],
      commitment_hours: 20,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Medical Advisor',
      description: 'Review AI outputs, suggest use-cases, and help us stay compliant. Clinician preferred.',
      skills: ['Medicine', 'Patient Communication', 'HIPAA'],
      commitment_hours: 4,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Product Designer',
      description: 'Design screens that are calming, accessible, and intuitive for non-tech users.',
      skills: ['Figma', 'UX Research', 'Accessibility', 'Mobile Design'],
      commitment_hours: 15,
      compensation_type: 'equity',
      is_open: true,
    },
  ],
  CodeTutor: [
    {
      title: 'Backend Engineer',
      description: 'Scale our Django backend. We\'re hitting limits — help us refactor and handle 10x traffic.',
      skills: ['Django', 'PostgreSQL', 'Redis', 'AWS', 'Python'],
      commitment_hours: 30,
      compensation_type: 'paid',
      is_open: true,
    },
  ],
  Vaultly: [
    {
      title: 'Smart Contract Engineer',
      description: 'Write and audit Solidity contracts for our yield strategies. Security-first mindset required.',
      skills: ['Solidity', 'Hardhat', 'OpenZeppelin', 'DeFi Protocols'],
      commitment_hours: 30,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Compliance Officer',
      description: 'Navigate EU crypto regulations. Help us get MiCA-ready before 2026.',
      skills: ['Crypto Regulation', 'MiCA', 'AML', 'KYC'],
      commitment_hours: 8,
      compensation_type: 'equity',
      is_open: true,
    },
  ],
  IndieForge: [
    {
      title: 'Game Developer Relations',
      description: 'Build relationships with indie dev communities. Attend game jams, run AMAs, be the face.',
      skills: ['Community Building', 'Game Development', 'Discord', 'Content Creation'],
      commitment_hours: 20,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Rust Backend Engineer',
      description: 'Work on our game asset delivery and CDN infrastructure. Performance obsessed preferred.',
      skills: ['Rust', 'AWS', 'CDN', 'WebSockets'],
      commitment_hours: 25,
      compensation_type: 'equity',
      is_open: true,
    },
  ],
  OpenSign: [
    {
      title: 'Open Source Maintainer',
      description: 'Help manage PRs, issues, and roadmap. You love open source and know how to build communities.',
      skills: ['Open Source', 'Node.js', 'GitHub', 'Technical Writing'],
      commitment_hours: 10,
      compensation_type: 'voluntary',
      is_open: true,
    },
    {
      title: 'DevOps / Infrastructure',
      description: 'Set up one-click deploy options (Railway, Render, DigitalOcean). Improve our Docker setup.',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      commitment_hours: 15,
      compensation_type: 'equity',
      is_open: true,
    },
  ],
  HireFlow: [
    {
      title: 'Enterprise Account Executive',
      description: 'Own deals from €50k+ ARR. You\'ve sold to HR leaders before.',
      skills: ['Enterprise Sales', 'HRTech', 'Salesforce', 'Negotiation'],
      commitment_hours: 40,
      compensation_type: 'paid',
      is_open: true,
    },
  ],
  NutriLens: [
    {
      title: 'Computer Vision Engineer',
      description: 'Improve our food recognition model. Our F1 score is 87% — help us hit 95%.',
      skills: ['Computer Vision', 'PyTorch', 'TensorFlow', 'MLOps'],
      commitment_hours: 25,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Nutritionist / Dietitian',
      description: 'Review our nutritional data pipeline and advise on clinical use-cases.',
      skills: ['Nutrition Science', 'Dietetics', 'Research'],
      commitment_hours: 6,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'iOS Developer',
      description: 'Own the native camera and photo processing experience on iOS.',
      skills: ['Swift', 'SwiftUI', 'AVFoundation', 'Core ML'],
      commitment_hours: 20,
      compensation_type: 'equity',
      is_open: true,
    },
  ],
  Mercatino: [
    {
      title: 'Product Designer',
      description: 'Design an app that both 60-year-old artisans and 30-year-old buyers will love.',
      skills: ['Figma', 'UX Research', 'Mobile Design', 'Branding'],
      commitment_hours: 15,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Community Manager',
      description: 'Build seller communities across Northern Italy. You\'re social, energetic, local.',
      skills: ['Community Building', 'Social Media', 'Events', 'Italian'],
      commitment_hours: 20,
      compensation_type: 'revenue_share',
      is_open: true,
    },
  ],
  FlowDesk: [
    {
      title: 'Elixir / Phoenix Developer',
      description: 'Build real-time features (live chat, notifications) in Elixir. We love the BEAM.',
      skills: ['Elixir', 'Phoenix', 'LiveView', 'WebSockets', 'PostgreSQL'],
      commitment_hours: 20,
      compensation_type: 'equity',
      is_open: true,
    },
    {
      title: 'Technical Co-founder',
      description: 'We need a technical co-founder. You build while I sell. 30% equity available.',
      skills: ['Full-Stack', 'System Design', 'Leadership', 'Product Thinking'],
      commitment_hours: 40,
      compensation_type: 'equity',
      is_open: true,
    },
  ],
};

// ─── Profiles update ──────────────────────────────────────────────────────────

async function updateProfiles(users: Record<string, string>) {
  const updates = [
    {
      id: users['pietro'],
      bio: 'Serial builder. Sold my first startup at 27. Now obsessed with LegalTech and AI. Based in Milan.',
      skills: ['TypeScript', 'Python', 'Product', 'B2B Sales', 'LegalTech'],
      availability_hours: 20,
      github_url: 'https://github.com/example-pietro',
      linkedin_url: 'https://linkedin.com/in/example-pietro',
      looking_for: 'team_for_my_project' as const,
    },
    {
      id: users['mario'],
      bio: 'Full-stack developer turned founder. Love building things people actually use. Based in Turin.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Product Design', 'Go'],
      availability_hours: 30,
      github_url: 'https://github.com/example-mario',
      linkedin_url: 'https://linkedin.com/in/example-mario',
      looking_for: 'team_for_my_project' as const,
    },
    {
      id: users['valerio'],
      bio: 'Angel investor and product advisor. Former CTO. I back early-stage founders with capital and mentorship.',
      skills: ['Venture Capital', 'Product Strategy', 'Engineering Leadership', 'B2B SaaS'],
      availability_hours: 10,
      github_url: 'https://github.com/example-valerio',
      linkedin_url: 'https://linkedin.com/in/example-valerio',
      looking_for: 'project_to_join' as const,
    },
  ];

  for (const u of updates) {
    const { error } = await supabase.from('profiles').update(u).eq('id', u.id);
    if (error) console.error(`Profile update failed for ${u.id}:`, error.message);
    else console.log(`Profile updated: ${u.id}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Get user IDs
  const { data: authData } = await supabase.auth.admin.listUsers();
  const users: Record<string, string> = {};
  for (const u of authData?.users ?? []) {
    if (u.email === 'pietro@alterio.com') users['pietro'] = u.id;
    if (u.email === 'mario@alterio.com') users['mario'] = u.id;
    if (u.email === 'valerio@alterio.com') users['valerio'] = u.id;
  }

  const missing = ['pietro', 'mario', 'valerio'].filter((k) => !users[k]);
  if (missing.length) {
    console.error('Missing users:', missing, '— run pnpm seed:users first');
    process.exit(1);
  }

  console.log('Users found:', users);

  // 2. Update profiles
  await updateProfiles(users);

  // 3. Create projects + roles
  const projectIds: Record<string, string> = {};

  for (const p of PROJECTS) {
    const founderId = users[p.founder];

    // Insert project
    const { data: proj, error: pErr } = await supabase
      .from('projects')
      .insert({
        title: p.title,
        tagline: p.tagline,
        description: p.description,
        stage: p.stage,
        sector: p.sector,
        stack: p.stack,
        website_url: p.website_url ?? null,
        github_url: p.github_url ?? null,
        founder_id: founderId,
        looking_for_roles: true,
        looking_for_investors: true,
      })
      .select('id')
      .single();

    if (pErr || !proj) { console.error(`Project "${p.title}" failed:`, pErr?.message); continue; }

    projectIds[p.title] = proj.id;
    console.log(`Created project: ${p.title} (${proj.id})`);

    // Add founder as member
    await supabase.from('project_members').insert({
      project_id: proj.id,
      user_id: founderId,
      role: 'founder',
    });

    // Insert roles
    const roles = ROLES[p.title] ?? [];
    for (const r of roles) {
      const { error: rErr } = await supabase.from('project_roles').insert({
        project_id: proj.id,
        ...r,
      });
      if (rErr) console.error(`  Role "${r.title}" failed:`, rErr.message);
      else console.log(`  Role: ${r.title}`);
    }
  }

  // 4. Add cross-memberships: Valerio as investor on some projects
  const investorTargets = ['LexAI', 'CodeTutor', 'HireFlow', 'Vaultly'];
  for (const title of investorTargets) {
    const pid = projectIds[title];
    if (!pid) continue;
    await supabase.from('project_members').insert({
      project_id: pid,
      user_id: users['valerio'],
      role: 'investor',
    });
    console.log(`Valerio joined as investor: ${title}`);
  }

  // 5. Add collaborator memberships
  const collabTargets: Array<[string, string]> = [
    ['OpenSign', 'mario'],
    ['NutriLens', 'mario'],
    ['GreenRoute', 'pietro'],
  ];
  for (const [title, username] of collabTargets) {
    const pid = projectIds[title];
    if (!pid) continue;
    await supabase.from('project_members').insert({
      project_id: pid,
      user_id: users[username],
      role: 'collaborator',
    });
    console.log(`${username} joined as collaborator: ${title}`);
  }

  // 6. Followers
  const followerTargets: Array<[string, string]> = [
    ['Mercatino', 'pietro'],
    ['IndieForge', 'valerio'],
    ['MedBuddy', 'mario'],
    ['FlowDesk', 'mario'],
  ];
  for (const [title, username] of followerTargets) {
    const pid = projectIds[title];
    if (!pid) continue;
    await supabase.from('project_members').insert({
      project_id: pid,
      user_id: users[username],
      role: 'follower',
    });
    console.log(`${username} following: ${title}`);
  }

  // 7. Applications — get role IDs first
  const { data: allRoles } = await supabase
    .from('project_roles')
    .select('id, title, project_id')
    .in('project_id', Object.values(projectIds));

  function getRoleId(projectTitle: string, roleTitle: string) {
    const pid = projectIds[projectTitle];
    return allRoles?.find((r) => r.project_id === pid && r.title === roleTitle)?.id;
  }

  const APPLICATIONS: Array<{
    roleTitle: string;
    project: string;
    applicant: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
  }> = [
    {
      project: 'LexAI',
      roleTitle: 'Full-Stack Engineer',
      applicant: 'mario',
      message: 'I\'ve been building Next.js apps for 5 years and I love the legaltech space. Let me show you what I can build.',
      status: 'accepted',
    },
    {
      project: 'LexAI',
      roleTitle: 'Legal Advisor',
      applicant: 'valerio',
      message: 'I can connect you with 3 law firms in Milan who would make great pilot customers.',
      status: 'pending',
    },
    {
      project: 'GreenRoute',
      roleTitle: 'ML Engineer',
      applicant: 'pietro',
      message: 'I worked on route optimization at a logistics startup. Happy to share my experience.',
      status: 'rejected',
    },
    {
      project: 'GreenRoute',
      roleTitle: 'Sales Lead (Logistics)',
      applicant: 'valerio',
      message: 'I have a network of 50+ fleet operators across Italy. This feels like a natural fit.',
      status: 'pending',
    },
    {
      project: 'MedBuddy',
      roleTitle: 'Product Designer',
      applicant: 'mario',
      message: 'Healthcare UX is my passion. I redesigned 3 patient-facing apps in the last 2 years.',
      status: 'pending',
    },
    {
      project: 'Vaultly',
      roleTitle: 'Smart Contract Engineer',
      applicant: 'mario',
      message: 'I\'ve written and audited Solidity for 2 years. No rugs on my watch.',
      status: 'accepted',
    },
    {
      project: 'IndieForge',
      roleTitle: 'Rust Backend Engineer',
      applicant: 'pietro',
      message: 'Rust is my daily driver. I\'d love to work on the CDN infrastructure.',
      status: 'pending',
    },
    {
      project: 'OpenSign',
      roleTitle: 'DevOps / Infrastructure',
      applicant: 'valerio',
      message: 'I can set up one-click deploy on Railway and Render. Done it 5 times before.',
      status: 'accepted',
    },
    {
      project: 'NutriLens',
      roleTitle: 'Computer Vision Engineer',
      applicant: 'mario',
      message: 'I improved food recognition accuracy from 72% to 91% in my last role. Can do the same here.',
      status: 'pending',
    },
    {
      project: 'FlowDesk',
      roleTitle: 'Technical Co-founder',
      applicant: 'mario',
      message: 'I\'ve been looking for a CX startup to co-found. Your vision aligns perfectly with mine. Let\'s talk.',
      status: 'pending',
    },
    {
      project: 'Mercatino',
      roleTitle: 'Product Designer',
      applicant: 'valerio',
      message: 'I know exactly how to design for non-tech users. My portfolio speaks for itself.',
      status: 'rejected',
    },
  ];

  for (const app of APPLICATIONS) {
    const roleId = getRoleId(app.project, app.roleTitle);
    if (!roleId) { console.warn(`  Role not found: ${app.project} / ${app.roleTitle}`); continue; }

    const { error: aErr } = await supabase.from('applications').insert({
      project_role_id: roleId,
      applicant_id: users[app.applicant],
      message: app.message,
      status: app.status,
    });

    if (aErr) console.error(`  Application failed (${app.applicant} → ${app.project}):`, aErr.message);
    else console.log(`  Application: ${app.applicant} → ${app.project} / ${app.roleTitle} [${app.status}]`);
  }

  console.log('\n✓ Seed complete.');
}

main().catch(console.error);
