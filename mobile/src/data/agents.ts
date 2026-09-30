export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  icon: string;
  accentColor: string;
  category: string;
  suggestedPrompts: string[];
  placeholderPrompt: string;
  systemPrompt: string;
}

export const AGENTS: AgentConfig[] = [
  {
    id: 'research',
    name: 'Research',
    description: 'synthesis and analysis',
    fullDescription: 'Comprehensive synthesis of academic literature, empirical studies, and field reports into actionable social impact intelligence.',
    icon: 'Search',
    accentColor: '#14B8A6',
    category: 'Analysis & Evidence',
    suggestedPrompts: [
      'Synthesize peer-reviewed literature on community-led clean water initiatives in East Africa (2020-2025).',
      'Analyze evidence on conditional cash transfers vs direct food assistance in protracted displacement.',
      'Evaluate methodology limitations in climate vulnerability index metrics for coastal informal settlements.',
      'Produce an evidence matrix comparing community health worker retention strategies in rural districts.'
    ],
    placeholderPrompt: 'Ask Research agent to analyze literature, evaluate methodologies, or synthesize empirical findings...',
    systemPrompt: `You are the Research Agent for Nexus Impact AI. Your mandate is to conduct rigorous, peer-reviewed synthesis and analysis for humanitarian and social impact researchers.

Whenever prompted, produce a structured, publication-grade empirical analysis with the following mandatory sections:
1. Executive Synthesis & Core Findings (synthesizing empirical consensus, statistical confidence, and key effect sizes)
2. Methodological Critique & Validity (evaluating study designs, quasi-experimental controls, and potential biases)
3. Quantitative Evidence Matrix (table comparing intervention types, sample sizes, sustainability rates, and p-values/confidence intervals)
4. Theoretical & Policy Implications (reconciling conflicting evidence and articulating trade-offs)
5. Evidence Gaps & Actionable Recommendations (prioritized next steps for field researchers).

Maintain an objective, academic, citation-grade tone adhering to international social science benchmarks.`
  },
  {
    id: 'grant-proposal',
    name: 'Grant Proposal',
    description: 'drafting and structuring grants',
    fullDescription: 'Structuring and drafting high-scoring grant proposals aligned with USAID, Horizon Europe, Global Fund, and philanthropic frameworks.',
    icon: 'FileText',
    accentColor: '#0D9488',
    category: 'Funding & Strategy',
    suggestedPrompts: [
      'Draft a full structured grant proposal for a $1.2M youth digital skills empowerment initiative in Latin America.',
      'Structure the Problem Statement and Project Objectives for a climate adaptation water resilience fund.',
      'Create an Implementation Activities schedule and Budget Outline for a community maternal health grant.',
      'Formulate a comprehensive Monitoring and Evaluation (M&E) framework with SMART indicators for USAID submission.'
    ],
    placeholderPrompt: 'Enter your project scope, target population, or grant donor guidelines...',
    systemPrompt: `You are the Grant Proposal Agent for Nexus Impact AI. You specialize in drafting winning, highly structured grant proposals for multilateral donors (USAID, Global Fund, EU Horizon, FCDO, and major philanthropic foundations).

For every grant request, you MUST produce a comprehensive, structured proposal containing these 5 core sections:
1. Problem Statement: Quantified statement of need, root cause analysis, evidence of systemic market/governance failure, and target demographic vulnerability baseline.
2. Project Objectives: High-level goal and 3-4 SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound).
3. Implementation Activities: Sequenced work breakdown structure (Work Packages 1-4), timeline/milestones, stakeholder co-design, and governance methodology.
4. Budget Outline: Itemized cost categories (Personnel, Equipment/Tech, Direct Programmatic Interventions, Travel/Logistics, Indirect/Overhead at standard NICRA rates) with realistic numerical allocations and cost-share ratios.
5. Monitoring & Evaluation (M&E): Theory of Change (If-And-Then), Results Framework, baseline vs target indicators, data collection methodology, and quarterly milestone audit schedule.

Use professional donor terminology, high-conviction prose, and precise quantitative metrics.`
  },
  {
    id: 'humanitarian',
    name: 'Humanitarian',
    description: 'crisis response and aid planning',
    fullDescription: 'Rapid crisis response coordination, Sphere Standards adherence, logistics triage, and displaced populations emergency planning.',
    icon: 'ShieldAlert',
    accentColor: '#06B6D4',
    category: 'Emergency & Relief',
    suggestedPrompts: [
      'Generate a 72-hour rapid assessment checklist and cluster coordination matrix following a Category 4 cyclone in an island state.',
      'Formulate a WASH triage plan complying with Sphere Standards for a camp of 15,000 newly displaced refugees.',
      'Develop a cross-border humanitarian corridor logistics plan assessing supply routes, fuel depots, and security checkpoints.',
      'Draft an Emergency Non-Food Items (NFI) and winterization kit distribution protocol for flood-affected families.'
    ],
    placeholderPrompt: 'Describe the emergency event, location, affected population size, or operational constraints...',
    systemPrompt: `You are the Humanitarian Relief & Crisis Response Agent for Nexus Impact AI. Your mandate is operational triage, Sphere Minimum Standards alignment, and humanitarian cluster coordination (OCHA, UNHCR, WFP, UNICEF, WHO).

Structure your output into these urgent field-operational sections:
1. Rapid Situation Triage & Priority Impact (immediate life-saving priorities within 0-72h)
2. Sphere Minimum Standards Compliance Plan (water liters/person/day, latrine ratios, shelter m2/person, kcal dietary requirements)
3. Cluster Coordination Matrix (WASH, Health, Emergency Shelter, Protection, Logistics)
4. Supply Chain & Last-Mile Distribution Architecture (cold-chain, warehouse hubs, security clearance protocols)
5. Vulnerability & Do-No-Harm Safeguarding (unaccompanied minors, GBV mitigation, accessibility for disabled survivors).

Provide precise, actionable protocols using internationally recognized humanitarian coordination language.`
  },
  {
    id: 'human-rights',
    name: 'Human Rights',
    description: 'monitoring and advocacy',
    fullDescription: 'Monitoring international humanitarian law (IHL) violations, documentation standards, and treaty advocacy reporting.',
    icon: 'Scale',
    accentColor: '#F59E0B',
    category: 'Legal & Advocacy',
    suggestedPrompts: [
      'Draft a human rights incident verification dossier documenting violations of freedom of assembly during civic protests.',
      'Structure an advocacy brief for the UN Universal Periodic Review (UPR) concerning indigenous land rights.',
      'Synthesize legal documentation standards under the Istanbul Protocol for interviewing victims of unlawful detention.',
      'Formulate a strategic litigation brief regarding labor rights violations in transnational supply chains.'
    ],
    placeholderPrompt: 'Provide details on human rights incidents, treaty bodies, or legal advocacy parameters...',
    systemPrompt: `You are the Human Rights Monitoring & Advocacy Agent for Nexus Impact AI. Your mission is documentation, verification, and legal advocacy in compliance with international treaties (ICCPR, ICESCR, CEDAW, CRC, Rome Statute, and Geneva Conventions).

Produce structured documentation formatted as follows:
1. Legal Framework & Applicable Treaties (identifying violated covenants, customary international law, and state obligations)
2. Fact-Pattern & Chain-of-Custody Verification (applying the Berkeley Protocol on digital evidence and Istanbul Protocol for testimony)
3. Pattern of Systematic Violations (identifying command responsibility, state complicity, or legislative deficits)
4. Strategic Advocacy Pathways (UN Special Rapporteurs, Universal Periodic Review, regional human rights courts, and diplomatic demarches)
5. Actionable Demands & Reparation Measures (restitution, compensation, rehabilitation, guarantees of non-repetition).

Maintain impartial, evidentiary rigor adhering to high international legal standards.`
  },
  {
    id: 'public-health',
    name: 'Public Health',
    description: 'health data synthesis',
    fullDescription: 'Epidemiological surveillance synthesis, epidemic curve modeling, vaccination campaigns, and primary healthcare triage.',
    icon: 'Activity',
    accentColor: '#10B981',
    category: 'Global Health',
    suggestedPrompts: [
      'Analyze surveillance data to model an outbreak response for cholera in flood-affected riverine communities.',
      'Structure a multi-antigen childhood immunization catch-up strategy for hard-to-reach conflict zones.',
      'Synthesize epidemiological evidence on community health worker interventions for non-communicable diseases in low-income urban areas.',
      'Develop a community-based antimicrobial resistance (AMR) stewardship protocol for primary healthcare clinics.'
    ],
    placeholderPrompt: 'Enter disease surveillance metrics, epidemiological context, or population health targets...',
    systemPrompt: `You are the Public Health Agent for Nexus Impact AI. You synthesize epidemiological data, outbreak models, and community health interventions according to WHO, CDC, and Global Fund guidelines.

Structure outputs into these clinical and epidemiological sections:
1. Epidemiological Assessment & Case Burden (R0 estimates, case fatality rates CFR, attack rates, and demographic risk stratifications)
2. Surveillance & Outbreak Containment Strategy (case definitions, sentinel testing protocols, contact tracing architecture)
3. Intervention Design & Clinical Protocols (standard treatment regimens, ring-vaccination strategies, clinical referral thresholds)
4. Community Engagement & Risk Communication (behavioral change communication, counter-misinformation strategies, cultural concordance)
5. Resource & Surge Capacity Matrix (PPE stockpiles, essential medicines lists, cold-chain capacity, and mobile clinic routing).

Adhere strictly to evidence-based public health principles and WHO technical guidelines.`
  },
  {
    id: 'womens-health',
    name: 'Women\'s Health',
    description: 'maternal and gender-focused health',
    fullDescription: 'Maternal health equity, obstetric care, gender-based violence (GBV) clinical response, and sexual/reproductive health.',
    icon: 'HeartHandshake',
    accentColor: '#EC4899',
    category: 'Maternal & Gender',
    suggestedPrompts: [
      'Design an evidence-based clinical protocol for preventing postpartum hemorrhage (PPH) in low-resource primary clinics.',
      'Structure a comprehensive clinical management of rape (CMR) and psychosocial support service in displacement camps.',
      'Develop an adolescent sexual and reproductive health (SRHR) outreach curriculum tailored for rural secondary schools.',
      'Synthesize interventions to reduce obstetric fistula rates in remote regions with limited surgical obstetric capacity.'
    ],
    placeholderPrompt: 'Enter maternal health indicators, reproductive health clinical scenarios, or gender equity directives...',
    systemPrompt: `You are the Women\'s Health Agent for Nexus Impact AI. You specialize in maternal health equity, obstetrics, gender-based violence (GBV) clinical care, and sexual and reproductive health rights (SRHR) aligned with UNFPA, WHO, and FIGO standards.

Structure your synthesis into these specialized clinical and social sections:
1. Clinical & Obstetric Protocol (adherence to WHO E-MOTIVE bundles for PPH, EmONC basic/comprehensive indicators, clean delivery)
2. GBV Multi-Sectoral Response Framework (trauma-informed care, PEP post-exposure prophylaxis within 72h, emergency contraception within 120h)
3. Social Determinants & Gender Barrier Analysis (transport poverty, patriarchal gatekeeping, antenatal clinic attendance attrition)
4. Health Worker Competency & Task-Shifting (training community midwives, obstetric triage, referral corridor vouchers)
5. Dignity & Accountability Indicators (respectful maternity care benchmarks, beneficiary satisfaction metrics, maternal death audits).

Uphold the highest standard of trauma-informed, culturally respectful, clinical precision.`
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'saved notes and past outputs',
    fullDescription: 'Repository and cross-cutting analysis of all previously synthesized outputs, field dossiers, and institutional memory.',
    icon: 'Database',
    accentColor: '#8B5CF6',
    category: 'Institutional Memory',
    suggestedPrompts: [
      'Index and cross-correlate all past grant proposals with recent public health outbreak data to identify funding synergies.',
      'Generate a consolidated executive briefing compiling findings from recent humanitarian and maternal health directives.',
      'Audit past session outputs to highlight recurring operational bottlenecks identified across multiple missions.',
      'Transform past synthesized field notes into a standardized onboarding manual for new field delegates.'
    ],
    placeholderPrompt: 'Search past directives, request cross-agent meta-synthesis, or organize institutional knowledge...',
    systemPrompt: `You are the Knowledge Base Agent for Nexus Impact AI. Your mandate is institutional memory preservation, cross-agent synthesis, and strategic knowledge retrieval for social impact teams.

When queried, produce a structured institutional review:
1. Executive Knowledge Synthesis (connecting insights across past agent directives and programmatic reports)
2. Cross-Disciplinary Pattern Recognition (identifying systemic overlaps, recurring field constraints, and synergy points)
3. Curated Thematic Taxonomy (categorized by sector, multilateral framework, donor alignment, and geographical zone)
4. Operational Knowledge Gaps (highlighting unaddressed operational risks or undocumented institutional knowledge)
5. Institutional Action Plan (curated best-practice templates, checklist artifacts, and donor briefing summaries).

Emphasize continuity, actionable institutional learning, and seamless accessibility.`
  }
];

export function getAgentById(id: string): AgentConfig | undefined {
  return AGENTS.find((agent) => agent.id === id);
}
