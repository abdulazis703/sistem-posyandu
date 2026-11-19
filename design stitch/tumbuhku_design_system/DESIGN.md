---
name: TumbuhKu Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f493f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d30'
  primary: '#00652c'
  on-primary: '#ffffff'
  primary-container: '#15803d'
  on-primary-container: '#d3ffd5'
  inverse-primary: '#79db8d'
  secondary: '#2e6a41'
  on-secondary: '#ffffff'
  secondary-container: '#b1f2be'
  on-secondary-container: '#347047'
  tertiary: '#4b5a53'
  on-tertiary: '#ffffff'
  tertiary-container: '#63736b'
  on-tertiary-container: '#e7f8ee'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f8a7'
  primary-fixed-dim: '#79db8d'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005323'
  secondary-fixed: '#b1f2be'
  secondary-fixed-dim: '#96d5a3'
  on-secondary-fixed: '#00210d'
  on-secondary-fixed-variant: '#12512c'
  tertiary-fixed: '#d6e6dd'
  tertiary-fixed-dim: '#bacac1'
  on-tertiary-fixed: '#101e19'
  on-tertiary-fixed-variant: '#3b4a43'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies a calm, nurturing, and professional clinical-grade platform tailored for Indonesian Posyandu health cadres, community nurses, and pediatric officers. The emotional baseline centers on reassurance, clarity, and precision: reducing clinical fatigue while providing immediate clarity during rapid monthly measurement sessions.

The aesthetic blends **Modern Clinical SaaS** with **Organic Softness**:
- **Dignified & Nurturing:** Employs botanical greens, soft sage, and mint hues that resonate with vitality, child health, and local community warmth without appearing childish or casual.
- **Data Clarity & Low Stress:** Growth curves (KMS/WHO Z-score metrics), nutrition indicators, and risk warnings avoid harsh alarms. Visual feedback guides attention to children needing immediate intervention while affirming stable trajectories.
- **Professional Restraint:** Clean, unembellished surfaces, subtle hairline borders, and atmospheric depth replace heavy gradients or decorative noise.

## Colors

The palette is engineered around organic vitality and medical precision. Saturated blues, purples, and neon accents are completely omitted.

### Brand & Surface Palette
- **Primary Green (`#15803D`):** Primary actions, verified healthy states, and active interactive elements.
- **Deep Forest Green (`#14532D`):** High-contrast display headings, main desktop sidebar navigation, and primary text anchors.
- **Soft Mint Light (`#ECFDF3`):** Canvas highlight panels, alert backgrounds, and active badge fills.
- **Soft Mint Medium (`#DCFCE7`):** Metric metric cards, positive growth delta tags, and hovered selection states.
- **Page Background (`#F7FAF8`):** Restful off-white surface minimizing screen glare in high-ambient-light community halls.
- **Card Surface (`#FFFFFF`):** Pure elevated white for isolated data cards, forms, and clinical modal sheets.
- **Structural Border (`#E2EBE5`):** Gentle botanical-tinted gray for non-intrusive container segmentation.

### Clinical Status Indicators
- **Normal (`#15803D` | Background `#DCFCE7`):** Z-score standard deviations between -2 SD and +2 SD.
- **Perlu Dipantau (`#F59E0B` | Background `#FEF3C7`):** Borderline trajectory or faltering growth requiring dietary guidance.
- **Perlu Ditinjau Petugas (`#E5484D` | Background `#FEE2E2`):** Acute risk, potential stunting, or rapid weight loss requiring medical escalation.
- **Data Belum Lengkap (`#64748B` | Background `#F1F5F9`):** Missing anthropometric parameters, unrecorded measurements, or pending visit logs.

## Typography

The type scale combines **Plus Jakarta Sans** for expressive, humanistic headings and structural tags with **Inter** for clinical tabular density, records, and narrative health notes.

- **Plus Jakarta Sans:** Rounded geometric architecture delivers an approachable, friendly touch for parents and cadres while retaining institutional credibility. Used strictly for labels, cards, metrics, and page titles.
- **Inter:** Exceptional micro-legibility at 12px–14px for numerical data, child biometric history (TB/U, BB/U, LK, LiLA), and nutritional diagnoses.
- **Numerical Alignment:** Tabular figures (`font-variant-numeric: tabular-nums`) must be enabled on all biometric values, dates, NIK identifiers, and percentiles to maintain strict vertical column alignment across records.

## Layout & Spacing

The design system targets an optimized desktop workspace of **1440px** tailored for administrative health stations and Posyandu laptop workstations.

- **Workspace Model:** Fixed left navigation sidebar (260px width) anchored in `#14532D`, paired with a fluid main workspace canvas spanning the remaining viewport (max container width 1180px, centered on ultra-wide screens).
- **Grid Architecture:** 12-column fluid grid system across the main work area with 24px (`1.5rem`) gutters and 32px (`2rem`) outer canvas padding.
- **Information Hierarchy:**
  - Full-width (12 cols): Analytical cohort graphs, KMS Z-score charts, and high-density patient registries.
  - Split view (8 cols / 4 cols): Individual child growth trajectory on the left; immediate clinical diagnosis, nutritional assessment checklist, and referral actions on the right.
  - Quadrant grid (3 cols × 4): Dashboard summary metrics (Total Balita Ditimbang, Balita Berisiko Stunting, Hadir Posyandu, Rujukan Aktif).

## Elevation & Depth

Visual hierarchy relies on crisp perimeter delineation and feathered, low-contrast ambient shadows tinted with subtle forest undertones.

- **Flat Foundation:** Base canvas uses flat `#F7FAF8` with no shadow.
- **Hairline Restraint:** All containers use a 1px solid border (`#E2EBE5`) to preserve legibility under variable screen calibrations.
- **Subtle Ambient Shadows:**
  - *Card Base Elevation:* `0 1px 3px rgba(20, 83, 45, 0.04), 0 4px 12px rgba(20, 83, 45, 0.03)`
  - *Interactive / Hovered Card:* `0 4px 6px rgba(20, 83, 45, 0.05), 0 10px 20px rgba(20, 83, 45, 0.04)`
  - *Floating Panels / Modals / Flyouts:* `0 12px 32px rgba(20, 83, 45, 0.08), 0 2px 6px rgba(20, 83, 45, 0.04)`
- **Layering Over Blur:** Glassmorphism is avoided. Crisp, pure `#FFFFFF` background surfaces create clear visual separation against the soft mint and off-white backdrop.

## Shapes

The design system uses a two-tier radius formula:
- **Major Surfaces (Cards, Modals, Panels):** Strictly **16px** (`1rem`) border radius, delivering an approachable, protective container shape that avoids clinical harshness.
- **Interactive & Form Controls (Buttons, Inputs, Selectors):** Strictly **10px** (`0.625rem`) border radius, balancing friendly curves with the structured precision expected in high-speed data entry.
- **Badges & Chips:** Completely pill-shaped (`9999px`) to immediately signal categorical and health-status tags distinct from interactive action buttons.

## Components

### Buttons
- **Primary:** Solid `#15803D`, text `#FFFFFF`, radius `10px`, hover background `#14532D`. Height: 42px (md), 48px (lg for primary measurement submit). Font: Plus Jakarta Sans 14px SemiBold.
- **Secondary / Outline:** Background `#FFFFFF`, border `1.5px solid #15803D`, text `#15803D`, radius `10px`. Hover background `#ECFDF3`.
- **Destructive / Escalation:** Background `#FEE2E2`, border `1px solid #FCA5A5`, text `#E5484D`. Used for "Rujuk ke Puskesmas" actions.

### Cards & Panels
- Background `#FFFFFF`, border `1px solid #E2EBE5`, radius `16px`, shadow `0 1px 3px rgba(20, 83, 45, 0.04)`.
- **Highlight Card (Metric/Summary):** Background `#ECFDF3` or `#DCFCE7`, border `1px solid #A7F3D0`, text `#14532D`.

### Status Badges (Status Pertumbuhan)
Pill-shaped (`9999px`), padding `4px 10px`, typography `label-sm` (11px / SemiBold):
- **Normal:** Text `#15803D`, background `#DCFCE7`, border `1px solid #86EFAC`. Dot indicator 6px solid `#15803D`.
- **Perlu Dipantau:** Text `#B45309`, background `#FEF3C7`, border `1px solid #FCD34D`. Dot indicator 6px solid `#F59E0B`.
- **Perlu Ditinjau Petugas:** Text `#991B1B`, background `#FEE2E2`, border `1px solid #FCA5A5`. Dot indicator 6px solid `#E5484D`.
- **Data Belum Lengkap:** Text `#475569`, background `#F1F5F9`, border `1px solid #CBD5E1`. Dot indicator 6px solid `#64748B`.

### Form Inputs & Measurement Entry
- Height 42px, radius `10px`, background `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`.
- Active focus state: border `1.5px solid #15803D`, ring `3px rgba(21, 128, 61, 0.15)`.
- Metric affixes (e.g., "kg", "cm") rendered in neutral `#64748B` with a solid right-edge border `#E2EBE5`.

### Growth Curve & KMS Chart Visualization
- Background pure `#FFFFFF`, card radius `16px`.
- WHO standard percentile zones rendered in tinted mint bands (`#ECFDF3` to `#DCFCE7`).
- Child's recorded plot: 2.5px solid curve `#15803D` with 6px circular data nodes `#14532D` surrounded by a 2px white halo.

### Child Profile Header & Quick Vital Chips
- Compact horizontal row combining avatar, NIK, child age (e.g., "24 Bulan"), and guardian name.
- Status chips stacked with clean semantic metadata, keeping clinical context accessible at a glance.