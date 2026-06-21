/**
 * Display metadata (flag emoji, code, kit colour) for the 48 WC 2026 nations,
 * keyed by the openfootball team name that the `matches` rows use. Lets the
 * match list and other screens render a flag chip without a DB round-trip.
 * Mirrors supabase/seed/catalog/wc2026-teams.ts (factual data only).
 */
export interface TeamFlag {
  flag: string;
  code: string;
  color: string;
}

export const TEAM_FLAGS: Record<string, TeamFlag> = {
  Mexico: { flag: "🇲🇽", code: "MEX", color: "#006847" },
  "South Africa": { flag: "🇿🇦", code: "RSA", color: "#007a4d" },
  "South Korea": { flag: "🇰🇷", code: "KOR", color: "#c8102e" },
  "Czech Republic": { flag: "🇨🇿", code: "CZE", color: "#11457e" },
  Canada: { flag: "🇨🇦", code: "CAN", color: "#d52b1e" },
  "Bosnia & Herzegovina": { flag: "🇧🇦", code: "BIH", color: "#002395" },
  Qatar: { flag: "🇶🇦", code: "QAT", color: "#8a1538" },
  Switzerland: { flag: "🇨🇭", code: "SUI", color: "#d52b1e" },
  Brazil: { flag: "🇧🇷", code: "BRA", color: "#fcd116" },
  Morocco: { flag: "🇲🇦", code: "MAR", color: "#c1272d" },
  Haiti: { flag: "🇭🇹", code: "HAI", color: "#00209f" },
  Scotland: { flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "SCO", color: "#0065bd" },
  USA: { flag: "🇺🇸", code: "USA", color: "#0a3161" },
  Paraguay: { flag: "🇵🇾", code: "PAR", color: "#d52b1e" },
  Australia: { flag: "🇦🇺", code: "AUS", color: "#00843d" },
  Turkey: { flag: "🇹🇷", code: "TUR", color: "#e30a17" },
  Germany: { flag: "🇩🇪", code: "GER", color: "#000000" },
  Curaçao: { flag: "🇨🇼", code: "CUW", color: "#002b7f" },
  "Ivory Coast": { flag: "🇨🇮", code: "CIV", color: "#f77f00" },
  Ecuador: { flag: "🇪🇨", code: "ECU", color: "#ffd100" },
  Netherlands: { flag: "🇳🇱", code: "NED", color: "#ff7f00" },
  Japan: { flag: "🇯🇵", code: "JPN", color: "#000091" },
  Sweden: { flag: "🇸🇪", code: "SWE", color: "#006aa7" },
  Tunisia: { flag: "🇹🇳", code: "TUN", color: "#e70013" },
  Belgium: { flag: "🇧🇪", code: "BEL", color: "#e30613" },
  Egypt: { flag: "🇪🇬", code: "EGY", color: "#ce1126" },
  Iran: { flag: "🇮🇷", code: "IRN", color: "#239f40" },
  "New Zealand": { flag: "🇳🇿", code: "NZL", color: "#000000" },
  Spain: { flag: "🇪🇸", code: "ESP", color: "#c60b1e" },
  "Cape Verde": { flag: "🇨🇻", code: "CPV", color: "#003893" },
  "Saudi Arabia": { flag: "🇸🇦", code: "KSA", color: "#006c35" },
  Uruguay: { flag: "🇺🇾", code: "URU", color: "#7b9fd4" },
  France: { flag: "🇫🇷", code: "FRA", color: "#1f3a93" },
  Senegal: { flag: "🇸🇳", code: "SEN", color: "#00853f" },
  Iraq: { flag: "🇮🇶", code: "IRQ", color: "#ce1126" },
  Norway: { flag: "🇳🇴", code: "NOR", color: "#ba0c2f" },
  Argentina: { flag: "🇦🇷", code: "ARG", color: "#75AADB" },
  Algeria: { flag: "🇩🇿", code: "ALG", color: "#006233" },
  Austria: { flag: "🇦🇹", code: "AUT", color: "#ed2939" },
  Jordan: { flag: "🇯🇴", code: "JOR", color: "#007a3d" },
  Portugal: { flag: "🇵🇹", code: "POR", color: "#da291c" },
  "DR Congo": { flag: "🇨🇩", code: "COD", color: "#007fff" },
  Uzbekistan: { flag: "🇺🇿", code: "UZB", color: "#1eb53a" },
  Colombia: { flag: "🇨🇴", code: "COL", color: "#ffcd00" },
  England: { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG", color: "#ffffff" },
  Croatia: { flag: "🇭🇷", code: "CRO", color: "#ff0000" },
  Ghana: { flag: "🇬🇭", code: "GHA", color: "#006b3f" },
  Panama: { flag: "🇵🇦", code: "PAN", color: "#005293" },
};

export function teamFlag(name: string): TeamFlag {
  return TEAM_FLAGS[name] ?? { flag: "⚽", code: name.slice(0, 3).toUpperCase(), color: "#3b82f6" };
}
