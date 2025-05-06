import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
// import styled from 'styled-components'; // Uncomment if using styled-components

interface AnimatedDiagramProps {
  svgPath: string;
  backgroundColor?: string; // fallback if theme not available
  animationDuration?: number; // per group
  animationType?: "fade" | "grow";
}

// Helper to parse SVG and group elements by animation group
function parseSVGGroups(svgString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) return { svg: null, groups: {} };

  // Find all elements with data-cell-id attributes
  const all = svg.querySelectorAll("[data-cell-id]");
  const groups: Record<string, Element[]> = {};

  all.forEach((el) => {
    const cellId = el.getAttribute("data-cell-id");
    if (!cellId) return;

    // Example: edge-static-1-3 or node-static-1-2
    const match = cellId.match(/^(\w+)-(\w+)-(\d+)-(\d+)$/);
    if (match) {
      const [_, type, name, sequence, groupNum] = match;
      // Group by the last number (animation group)
      if (!groups[groupNum]) groups[groupNum] = [];
      groups[groupNum].push(el);
    }
  });

  return { svg, groups };
}

const AnimatedDiagram: React.FC<AnimatedDiagramProps> = ({
  svgPath,
  backgroundColor = "#fff",
  animationDuration = 0.8,
  animationType = "fade",
}) => {
  const [svgContent, setSvgContent] = useState<SVGSVGElement | null>(null);
  const [groupOrder, setGroupOrder] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Function to set opacity on a group element
  const setGroupOpacity = (el: Element, opacity: string) => {
    // Set opacity on the group itself
    (el as HTMLElement).style.opacity = opacity;
    // Also set opacity on all child elements that have paths or shapes
    el.querySelectorAll("path, ellipse, rect, circle").forEach((child) => {
      (child as HTMLElement).style.opacity = opacity;
    });
  };

  useEffect(() => {
    if (!svgPath) return;
    setLoading(true);
    setError(null);
    fetch(svgPath)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load SVG: ${res.statusText}`);
        return res.text();
      })
      .then((svgString) => {
        const { svg, groups } = parseSVGGroups(svgString);
        if (!svg) throw new Error("Invalid SVG file");
        // Fallback: if no groups found, just render the SVG statically
        if (Object.keys(groups).length === 0) {
          setSvgContent(svg);
          setGroupOrder([]);
          setLoading(false);
          return;
        }
        setSvgContent(svg);
        // Sort groups by their group number
        const order = Object.keys(groups).sort(
          (a, b) => parseInt(a) - parseInt(b)
        );
        setGroupOrder(order);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [svgPath]);

  useEffect(() => {
    if (!svgContent || groupOrder.length === 0) return;
    // Hide all groups initially
    groupOrder.forEach((groupNum, i) => {
      // Find elements where the last number matches the group number
      const els = svgContent.querySelectorAll(`[data-cell-id$="-${groupNum}"]`);
      els.forEach((el) => {
        // Hide all groups initially (opacity 0)
        setGroupOpacity(el, "0");
        // For edge groups, also set up stroke dash for all paths
        const cellId = el.getAttribute("data-cell-id") || "";
        const match = cellId.match(/^(\w+)-(\w+)-(\d+)-(\d+)$/);
        const type = match ? match[1] : "";
        console.log(type);
        if (type === "edge") {
          el.querySelectorAll("path").forEach((path) => {
            const length = (path as SVGPathElement).getTotalLength();
            (path as SVGPathElement).style.strokeDasharray = `${length}`;
            (path as SVGPathElement).style.strokeDashoffset = `${length}`;
            (path as SVGPathElement).style.opacity = "1";
            (path as SVGPathElement).style.transition = "none";
          });
        }
      });
    });
    setCurrentStep(0);
  }, [svgContent, groupOrder]);

  // Animate next group in sequence
  useEffect(() => {
    if (!svgContent || groupOrder.length === 0) return;
    if (currentStep >= groupOrder.length) return;

    const groupNum = groupOrder[currentStep];
    // Find elements where the last number matches the group number
    const els = svgContent.querySelectorAll(`[data-cell-id$="-${groupNum}"]`);

    els.forEach((el) => {
      const cellId = el.getAttribute("data-cell-id") || "";
      const match = cellId.match(/^(\w+)-(\w+)-(\d+)-(\d+)$/);
      const type = match ? match[1] : "";

      if (type === "edge") {
        el.querySelectorAll("path").forEach((path) => {
          const length = (path as SVGPathElement).getTotalLength();
          // Set up for animation
          (path as SVGPathElement).style.strokeDasharray = `${length}`;
          (path as SVGPathElement).style.strokeDashoffset = `${length}`;
          (path as SVGPathElement).style.opacity = "1";
          (path as SVGPathElement).style.transition = "none";
          // Force reflow
          void (path as SVGPathElement).getBoundingClientRect();
          // Animate
          requestAnimationFrame(() => {
            (
              path as SVGPathElement
            ).style.transition = `stroke-dashoffset ${animationDuration}s`;
            (path as SVGPathElement).style.strokeDashoffset = "0";
          });
        });
        // Show the group (opacity 1)
        setGroupOpacity(el, "1");
      } else {
        // Fade in for all other types
        (el as HTMLElement).style.transition = `opacity ${animationDuration}s`;
        el.querySelectorAll("path, ellipse, rect, circle").forEach((child) => {
          (
            child as HTMLElement
          ).style.transition = `opacity ${animationDuration}s`;
        });
        setGroupOpacity(el, "1");
      }
    });

    if (currentStep < groupOrder.length) {
      const timeout = setTimeout(
        () => setCurrentStep(currentStep + 1),
        animationDuration * 1000
      );
      return () => clearTimeout(timeout);
    }
  }, [currentStep, svgContent, groupOrder, animationDuration]);

  // Set SVG background
  useEffect(() => {
    if (!svgContent) return;
    svgContent.style.background = backgroundColor;
    svgContent.style.width = "100%";
    svgContent.style.height = "100%";
  }, [svgContent, backgroundColor]);

  // Render SVG as React element
  return (
    <div
      ref={svgContainerRef}
      style={{ width: "100%", height: "100%", background: backgroundColor }}
      className="animated-diagram-container"
    >
      {loading && <div>Loading diagram...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {svgContent && !loading && !error && (
        <div
          dangerouslySetInnerHTML={{ __html: svgContent.outerHTML }}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default AnimatedDiagram;
