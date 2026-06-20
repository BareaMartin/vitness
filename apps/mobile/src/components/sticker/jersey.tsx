import Svg, { Path, Text as SvgText } from "react-native-svg";

/**
 * A procedural football shirt drawn in a team's colours, with the shirt number
 * across the front — the player card's hero element (replaces the bare number).
 * Body = primary colour, collar + sleeve cuffs = secondary, number auto-picks a
 * dark or light fill for contrast against the body. Original artwork, no
 * licensed kits. See ticket VIT-5 (sticker catalog).
 */

const SHIRT =
  "M35 18 L48 24 Q60 34 72 24 L85 18 L112 32 L104 52 L92 48 L92 106 L28 106 L28 48 L16 52 L8 32 Z";
const COLLAR = "M51 23 L60 33 L69 23 L64 21 Q60 26 56 21 Z";
const LEFT_CUFF = "M8 32 L16 52 L21 49 L13 30 Z";
const RIGHT_CUFF = "M112 32 L104 52 L99 49 L107 30 Z";

/** Relative luminance (0 dark – 1 light) of a #rgb / #rrggbb colour. */
function luminance(hex: string): number {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function Jersey({
  primary,
  secondary,
  number,
  size = 74,
}: {
  primary: string;
  secondary: string;
  number?: number;
  size?: number;
}) {
  const numberFill = luminance(primary) > 0.6 ? "#16181c" : "#ffffff";

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Path d={SHIRT} fill={primary} stroke="rgba(0,0,0,0.35)" strokeWidth={3} strokeLinejoin="round" />
      <Path d={LEFT_CUFF} fill={secondary} />
      <Path d={RIGHT_CUFF} fill={secondary} />
      <Path d={COLLAR} fill={secondary} />
      {number !== undefined ? (
        <SvgText
          x={60}
          y={82}
          fill={numberFill}
          fontSize={36}
          fontWeight="bold"
          textAnchor="middle"
        >
          {number}
        </SvgText>
      ) : null}
    </Svg>
  );
}
