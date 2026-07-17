export type Project = {
  slug: string;
  title: string;
  pitch: string;
  description: string;
  tech: string[];
  live: string;
  liveLabel: string;
  source: string;
  shotAlt: string;
};

export const projects: Project[] = [
  {
    slug: 'worldcup',
    title: 'World Cup 2026 Teams & Stats',
    pitch: 'Live tournament tracker for the 2026 FIFA World Cup.',
    description:
      'Group standings, knockout bracket, Golden Boot race, and head-to-head team comparisons — with live scores via adaptive polling and every kickoff shown in your own time zone. Installable as a PWA and built to keep working even when the data feeds go down.',
    tech: ['React 18', 'Vite', 'PWA', 'ESPN API'],
    live: 'https://worldcup-teams-stats.netlify.app/',
    liveLabel: 'worldcup-teams-stats.netlify.app',
    source: 'https://github.com/AmirNcode/worldcup-teams-stats',
    shotAlt: 'World Cup 2026 app showing live group standings and team statistics',
  },
  {
    slug: 'hausofballoons',
    title: 'Haus of Balloons',
    pitch: 'Site and back office for a real events business.',
    description:
      'The web presence for a balloon-decor company serving the Greater Toronto and Vancouver areas — hero animation, gallery with automated image manifests, hidden RSVP event pages, and booking forms with email confirmations. I run the whole tech side: website, email, and invoicing.',
    tech: ['HTML/CSS/JS', 'Netlify Forms', 'Resend'],
    live: 'https://hausofballoons.ca/',
    liveLabel: 'hausofballoons.ca',
    source: 'https://github.com/AmirNcode/hausofballoons',
    shotAlt: 'Haus of Balloons website with balloon garland photography and booking form',
  },
  {
    slug: 'simpleqr',
    title: 'SimpleQR',
    pitch: 'QR codes with custom styling — no account, no server.',
    description:
      'A generator for nine QR content types (URL, WiFi, vCard, calendar, and more) with shape and gradient styling, drag-and-drop logo embedding, and PNG/SVG export. Everything runs client-side in the browser; designs and named templates persist locally.',
    tech: ['React', 'TypeScript', 'Vite'],
    live: 'https://simplqrgen.netlify.app/',
    liveLabel: 'simplqrgen.netlify.app',
    source: 'https://github.com/AmirNcode/simple-qr-code-generator',
    shotAlt: 'SimpleQR generator showing a styled QR code with customization controls',
  },
];
