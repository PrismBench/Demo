import { useId } from "react";

/** Generates a unique, stable SVG-mask id per mount */
export const useMaskId = (prefix = "mask") => `${prefix}-${useId()}`;
export default useMaskId;
