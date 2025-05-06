/**
 * Defines SVG mask definitions used to reveal parts of an underlying graphic
 * through specified characters in a text string. This component is typically used
 * within an SVG's <defs> section and referenced by a mask attribute on a graphical element.
 */
import React from "react";

/**
 * Props for the MaskDefs component.
 */
interface MaskDefsProps {
  /** A unique ID for the mask element. */
  id: string;
  /** The full text string to render. */
  text: string;
  /** The characters within the text that should act as the 'reveal' area (white in the mask). */
  revealChars: string; // e.g. "SM"
  /** The font size for the text used in the mask. */
  fontSize: number;
  /** The vertical baseline position for the text. */
  y: number; // baseline
  /** Optional: The font family for the text. Defaults to "Montserrat, sans-serif". */
  fontFamily?: string;
  /** Optional: The letter spacing for the text. Defaults to "0.05em". */
  letterSpacing?: string | number;
}

/**
 * Renders an SVG `<defs>` block containing a `<mask>`.
 * The mask uses text rendering where specified characters (`revealChars`) are white
 * and others are black, creating a stencil effect.
 *
 * @param {MaskDefsProps} props - The component props.
 * @returns {React.ReactElement} The SVG defs element containing the mask.
 */
const MaskDefs: React.FC<MaskDefsProps> = ({
  id,
  text,
  revealChars,
  fontSize,
  y,
  fontFamily = "Montserrat, sans-serif",
  letterSpacing = "0.05em",
}) => (
  <defs>
    <mask id={id} maskUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="black" />
      <text
        x={0}
        y={y}
        fontSize={fontSize}
        fontFamily={fontFamily}
        letterSpacing={letterSpacing}
        fontWeight="700"
      >
        {text.split("").map((ch, i) => (
          <tspan key={i} fill={revealChars.includes(ch) ? "white" : "black"}>
            {ch}
          </tspan>
        ))}
      </text>
    </mask>
  </defs>
);

export default MaskDefs;
