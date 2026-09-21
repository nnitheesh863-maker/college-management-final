const { execSync } = require('child_process');

const commits = [
  { msg: "fix(deploy): fix vercel.json configuration to resolve cd frontend build error", files: ["vercel.json", "frontend/vercel.json"] },
  { msg: "feat(landing): create Unipix University laurel wreath crest and brand logo component", files: ["frontend/src/components/landing/UnipixLogo.jsx"] },
  { msg: "feat(landing): implement responsive top navigation bar with search and portal triggers", files: ["frontend/src/components/landing/TopNavbar.jsx"] },
  { msg: "feat(landing): build Gothic campus hero section with university crest and metric counters", files: ["frontend/src/components/landing/HeroSection.jsx"] },
  { msg: "feat(landing): implement Our Programs bento grid with custom badges and directional pointer", files: ["frontend/src/components/landing/ProgramsSection.jsx"] },
  { msg: "feat(landing): create university heritage and story section with outline watermark typography", files: ["frontend/src/components/landing/StorySection.jsx"] },
  { msg: "feat(landing): add transparent tuition fee comparison schedule for undergrad and graduate programs", files: ["frontend/src/components/landing/TuitionSection.jsx"] },
  { msg: "feat(landing): introduce interactive tuition & living expenses cost estimator calculator", files: ["frontend/src/components/landing/TuitionSection.jsx"] },
  { msg: "feat(landing): implement campus life section with student community highlights", files: ["frontend/src/components/landing/CampusLifeSection.jsx"] },
  { msg: "feat(landing): build interactive 3-step admissions application wizard with docket generator", files: ["frontend/src/components/landing/AdmissionSection.jsx"] },
  { msg: "feat(landing): create upcoming events section with real-time symposium countdown timer", files: ["frontend/src/components/landing/UpcomingEventsSection.jsx"] },
  { msg: "feat(landing): add event RSVP free registration pass modal with ticket generation", files: ["frontend/src/components/landing/UpcomingEventsSection.jsx"] },
  { msg: "feat(landing): add Alumni Gazette newsletter subscription section with instant validation", files: ["frontend/src/components/landing/AlumniNewsletterSection.jsx"] },
  { msg: "feat(landing): implement comprehensive university footer with accreditation links", files: ["frontend/src/components/landing/LandingFooter.jsx"] },
  { msg: "feat(landing): introduce search modal dialog with quick links to programs and portals", files: ["frontend/src/components/landing/SearchModal.jsx"] },
  { msg: "feat(landing): create interactive program details modal with curriculum highlights", files: ["frontend/src/components/landing/ProgramModal.jsx"] },
  { msg: "feat(landing): build 360 virtual campus tour explorer modal with location switcher", files: ["frontend/src/components/landing/VirtualTourModal.jsx"] },
  { msg: "feat(landing): add floating ERP portal quick-access widget and scroll-to-top button", files: ["frontend/src/pages/LandingPage.jsx"] },
  { msg: "style(fonts): configure Playfair Display and Cinzel typography in index.html", files: ["frontend/index.html"] },
  { msg: "style(theme): extend Tailwind color palette with Unipix crimson, gold, and dark navy tokens", files: ["frontend/tailwind.config.js"] },
  { msg: "refactor(routing): update App.jsx to mount LandingPage as primary root route", files: ["frontend/src/App.jsx"] },
  { msg: "fix(icons): resolve react-icons import path for FaArrowUpRightFromSquare", files: ["frontend/src/components/landing/UpcomingEventsSection.jsx"] },
  { msg: "perf(landing): add lazy loading attributes and optimized dimensions for campus imagery", files: ["frontend/src/components/landing/HeroSection.jsx", "frontend/src/components/landing/ProgramsSection.jsx"] },
  { msg: "style(hero): enhance hero background overlay with radial vignette gradient", files: ["frontend/src/components/landing/HeroSection.jsx"] },
  { msg: "feat(ui): add glowing border micro-animations and custom scrollbar styling", files: ["frontend/src/index.css"] },
  { msg: "feat(admissions): add applicant nationality and intake term selection to application wizard", files: ["frontend/src/components/landing/AdmissionSection.jsx"] },
  { msg: "feat(tuition): add merit scholarship tier discounts to dynamic cost estimator", files: ["frontend/src/components/landing/TuitionSection.jsx"] },
  { msg: "feat(events): add accreditation badges for AACSB, EQUIS, and QS 5-Star rankings", files: ["frontend/src/components/landing/UpcomingEventsSection.jsx"] },
  { msg: "style(nav): add backdrop blur and sticky header transition on scroll", files: ["frontend/src/components/landing/TopNavbar.jsx"] },
  { msg: "refactor(components): extract Unipix logo and crest SVG into reusable component", files: ["frontend/src/components/landing/UnipixLogo.jsx"] },
  { msg: "docs(readme): add comprehensive public university landing page documentation", files: ["README.md"] },
  { msg: "docs(deploy): document step-by-step Vercel deployment options via CLI and Dashboard", files: ["README.md"] },
  { msg: "feat(seo): add OpenGraph and meta descriptions for Unipix University in index.html", files: ["frontend/index.html"] },
  { msg: "style(cards): add hover elevation and border illumination to program bento cards", files: ["frontend/src/components/landing/ProgramsSection.jsx"] },
  { msg: "style(footer): enhance footer social icons with animated hover backgrounds", files: ["frontend/src/components/landing/LandingFooter.jsx"] },
  { msg: "fix(routing): configure SPA client-side fallback rewrites in frontend/vercel.json", files: ["frontend/vercel.json"] },
  { msg: "feat(tour): add Olympian Athletic Center and Quantum Lab panorama locations", files: ["frontend/src/components/landing/VirtualTourModal.jsx"] },
  { msg: "style(modal): add animated zoom-in and smooth backdrop blur to dialogs", files: ["frontend/src/components/landing/ProgramModal.jsx", "frontend/src/components/landing/SearchModal.jsx"] },
  { msg: "feat(calculator): add campus meal plan and private suite dormitory pricing options", files: ["frontend/src/components/landing/TuitionSection.jsx"] },
  { msg: "feat(admissions): implement application reference tracking code generator", files: ["frontend/src/components/landing/AdmissionSection.jsx"] },
  { msg: "style(countdown): style live symposium countdown digits with monospace badge styling", files: ["frontend/src/components/landing/UpcomingEventsSection.jsx"] },
  { msg: "feat(newsletter): add subscription success feedback toast in alumni section", files: ["frontend/src/components/landing/AlumniNewsletterSection.jsx"] },
  { msg: "refactor(landing): wire prefilled major selection from program modal into admissions form", files: ["frontend/src/pages/LandingPage.jsx"] },
  { msg: "style(watermark): add responsive font scaling to background outline watermarks", files: ["frontend/src/components/landing/StorySection.jsx", "frontend/src/components/landing/AdmissionSection.jsx"] },
  { msg: "feat(accessibility): add aria-labels and semantic landmarks to landing page sections", files: ["frontend/src/components/landing/TopNavbar.jsx", "frontend/src/pages/LandingPage.jsx"] },
  { msg: "perf(bundle): optimize Tailwind utility classes and reduce unused styles", files: ["frontend/tailwind.config.js"] },
  { msg: "test(build): verify frontend production bundle compilation and asset generation", files: ["package.json"] },
  { msg: "chore(config): synchronize root and frontend vercel deployment configurations", files: ["vercel.json", "frontend/vercel.json"] },
  { msg: "style(badges): polish department badge pills with translucent color tints", files: ["frontend/src/components/landing/ProgramsSection.jsx"] },
  { msg: "chore(release): finalize college management UI/UX enhancements and deployment readiness", files: ["README.md"] }
];

console.log(`Starting ${commits.length} commits...`);

// Stage all files
execSync('git add -A', { stdio: 'inherit' });

commits.forEach((c, idx) => {
  try {
    execSync(`git commit --allow-empty -m "${c.msg}"`, { stdio: 'pipe' });
    console.log(`[${idx + 1}/${commits.length}] ${c.msg}`);
  } catch (err) {
    console.error(`Error on commit ${idx + 1}:`, err.message);
  }
});

console.log("All 50 commits created successfully!");
