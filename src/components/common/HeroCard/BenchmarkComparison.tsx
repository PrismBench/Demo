import React, { useEffect, useState, useRef } from "react";
import { Stack, useMantineColorScheme } from "@mantine/core";
import svgUrl from "./static_benchmark.svg";
import svgUrl2 from "./dynamic_benchmark.svg";

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const NODE_RADIUS = 10;
const NODE_FADE_IN_MS = 300;
const EDGE_DURATION_MS = 800;
const EDGE_DELAY_BETWEEN_MS = 200;

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type NodeState = "default" | "success" | "failure";

interface SvgNode {
  id: string;
  cx: number;
  cy: number;
  r: number;
  state: NodeState;
  isVisible: boolean;
}

interface SvgEdge {
  id: string;
  d: string;
  sourceId: string;
  targetId: string;
  ref: React.RefObject<SVGPathElement>;
}

interface ThemeColors {
  background: string;
  line: string;
  defaultNode: string;
  text: string;
  successNode: string;
  failureNode: string;
}

/* -------------------------------------------------------------------------- */
/*                                   THEMES                                   */
/* -------------------------------------------------------------------------- */

const THEMES: Record<"light" | "dark", ThemeColors> = {
  light: {
    background: "var(--mantine-color-text)",
    line: "var(--mantine-color-body)",
    defaultNode: "#ffffff",
    text: "var(--mantine-color-body)",
    successNode: "#27ae60",
    failureNode: "#e74c3c",
  },
  dark: {
    background: "var(--mantine-color-text)",
    line: "var(--mantine-color-body)",
    defaultNode: "#000000",
    text: "var(--mantine-color-body)",
    successNode: "#2ecc71",
    failureNode: "#e74c3c",
  },
};

/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTIONS                             */
/* -------------------------------------------------------------------------- */

const getNodeColor = (state: NodeState, colors: ThemeColors) => {
  switch (state) {
    case "success":
      return colors.successNode;
    case "failure":
      return colors.failureNode;
    default:
      return colors.defaultNode;
  }
};

const fetchSvgDoc = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const txt = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(txt, "image/svg+xml");
  const viewBox =
    doc.querySelector("svg")?.getAttribute("viewBox") ?? "0 0 0 0";
  return { doc, viewBox };
};

/* -------------------------------------------------------------------------- */
/*                                CUSTOM HOOK                                 */
/* -------------------------------------------------------------------------- */

const useBenchmarkSvg = (
  url: string,
  kind: "static" | "dynamic"
): {
  nodes: SvgNode[];
  edges: SvgEdge[];
  viewBox: string;
  loading: boolean;
  error: string | null;
  setNodes: React.Dispatch<React.SetStateAction<SvgNode[]>>;
} => {
  const [nodes, setNodes] = useState<SvgNode[]>([]);
  const [edges, setEdges] = useState<SvgEdge[]>([]);
  const [viewBox, setViewBox] = useState("0 0 0 0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const parse = async () => {
      try {
        const { doc, viewBox } = await fetchSvgDoc(url);
        if (cancelled) return;
        setViewBox(viewBox);

        const edgeRefs = new Map<string, React.RefObject<SVGPathElement>>();
        const localNodes: SvgNode[] = [];
        const localEdges: SvgEdge[] = [];

        if (kind === "static") {
          /* ------------------------------- nodes ------------------------------ */
          doc
            .querySelectorAll('g[data-cell-id^="static_task_"] ellipse')
            .forEach((el) => {
              const id =
                el.closest("g[data-cell-id]")?.getAttribute("data-cell-id") ??
                "";
              localNodes.push({
                id,
                cx: parseFloat(el.getAttribute("cx") ?? "0"),
                cy: parseFloat(el.getAttribute("cy") ?? "0"),
                r: parseFloat(el.getAttribute("r") ?? "5"),
                state: "default",
                isVisible: false,
              });
            });
          localNodes.sort((a, b) => a.cx - b.cx);

          /* ------------------------------- edges ------------------------------ */
          doc
            .querySelectorAll(
              'g[data-cell-id^="static_edge_"] path, g[data-cell-id="static_path_input"] path'
            )
            .forEach((el) => {
              const id =
                el.closest("g[data-cell-id]")?.getAttribute("data-cell-id") ??
                "";
              const ref = edgeRefs.get(id) ?? React.createRef<SVGPathElement>();
              edgeRefs.set(id, ref);

              let sourceId = "";
              let targetId = "";

              if (id.startsWith("static_edge_")) {
                const [, s, t] = id.match(/static_edge_(\d+)_(\d+)/) ?? [];
                sourceId = `static_task_${s}`;
                targetId = `static_task_${t}`;
              } else if (id === "static_path_input") {
                sourceId = "input";
                targetId = "static_task_1";
              }

              localEdges.push({
                id,
                d: el.getAttribute("d") ?? "",
                sourceId,
                targetId,
                ref,
              });
            });
          localEdges.sort((a, b) =>
            a.sourceId.localeCompare(b.sourceId, undefined, { numeric: true })
          );
        } else {
          /* ------------------------------- nodes ------------------------------ */
          doc
            .querySelectorAll('g[data-cell-id^="dynamic_task_"] ellipse')
            .forEach((el) => {
              const id =
                el.closest("g[data-cell-id]")?.getAttribute("data-cell-id") ??
                "";
              let state: NodeState = "default";
              if (id.endsWith("success")) state = "success";
              else if (id.endsWith("fail")) state = "failure";
              localNodes.push({
                id,
                cx: parseFloat(el.getAttribute("cx") ?? "0"),
                cy: parseFloat(el.getAttribute("cy") ?? "0"),
                r: parseFloat(el.getAttribute("r") ?? "5"),
                state,
                isVisible: false,
              });
            });
          localNodes.sort((a, b) => a.cx - b.cx);

          /* ------------------------------- edges ------------------------------ */
          doc.querySelectorAll("g[data-cell-id] path").forEach((el) => {
            const id =
              el.closest("g[data-cell-id]")?.getAttribute("data-cell-id") ?? "";
            const ref = edgeRefs.get(id) ?? React.createRef<SVGPathElement>();
            edgeRefs.set(id, ref);
            localEdges.push({
              id,
              d: el.getAttribute("d") ?? "",
              sourceId: "",
              targetId: "",
              ref,
            });
          });
          localEdges.sort((a, b) => a.id.localeCompare(b.id));
        }

        setNodes(localNodes);
        setEdges(localEdges);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    parse();
    return () => {
      cancelled = true;
    };
  }, [url, kind]);

  return { nodes, edges, viewBox, loading, error, setNodes };
};

/* -------------------------------------------------------------------------- */
/*                               ANIMATION LOGIC                              */
/* -------------------------------------------------------------------------- */

const animateEdges = (
  edges: SvgEdge[],
  delayBetween: number,
  onEdgeComplete: (edgeIdx: number) => void
) => {
  edges.forEach((edge, idx) => {
    const path = edge.ref.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const start = idx * delayBetween;
    setTimeout(() => {
      path.style.transition = `stroke-dashoffset ${EDGE_DURATION_MS}ms ease-in-out`;
      path.style.strokeDashoffset = "0";
      setTimeout(() => onEdgeComplete(idx), EDGE_DURATION_MS);
    }, start);
  });
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

interface BenchmarkComparisonProps {
  staticSvgPath: string;
  className?: string;
}

const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({
  className,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const staticSvg = useBenchmarkSvg(svgUrl, "static");
  const dynamicSvg = useBenchmarkSvg(svgUrl2, "dynamic");

  const colors = THEMES[colorScheme === "auto" ? "light" : colorScheme];

  /* --------------------------- static animation --------------------------- */
  useEffect(() => {
    if (staticSvg.loading || staticSvg.error) return;

    animateEdges(staticSvg.edges, EDGE_DURATION_MS, (idx) =>
      staticSvg.setNodes((prev) =>
        prev.map((n) =>
          n.id === staticSvg.edges[idx].targetId
            ? {
                ...n,
                isVisible: true,
                state: idx % 2 === 0 ? "success" : "failure",
              }
            : n
        )
      )
    );
  }, [staticSvg.loading, staticSvg.error, staticSvg.edges, staticSvg.setNodes]);

  /* -------------------------- dynamic animation -------------------------- */
  useEffect(() => {
    if (dynamicSvg.loading || dynamicSvg.error) return;

    animateEdges(dynamicSvg.edges, EDGE_DELAY_BETWEEN_MS, (idx) =>
      dynamicSvg.setNodes((prev) =>
        prev.map((n, nodeIdx) =>
          nodeIdx === idx + 1 || (idx === 0 && nodeIdx === 0)
            ? { ...n, isVisible: true }
            : n
        )
      )
    );
  }, [
    dynamicSvg.loading,
    dynamicSvg.error,
    dynamicSvg.edges,
    dynamicSvg.setNodes,
  ]);

  if (staticSvg.loading || dynamicSvg.loading) return <div>Loading…</div>;
  if (staticSvg.error) return <div>Error (static): {staticSvg.error}</div>;
  if (dynamicSvg.error) return <div>Error (dynamic): {dynamicSvg.error}</div>;

  /* ----------------------------------------------------------------------- */
  /*                        RENDERED SVG (STATIC + DYN)                      */
  /* ----------------------------------------------------------------------- */

  return (
    <Stack className={className} style={{ background: colors.background }}>
      {/* ------------------------------ Static ----------------------------- */}
      <h2>Static Benchmark</h2>
      <svg viewBox={staticSvg.viewBox} fill="none">
        {staticSvg.edges.map((e) => (
          <path
            key={e.id}
            ref={e.ref}
            d={e.d}
            stroke={colors.line}
            strokeWidth="2"
            fill="none"
          />
        ))}

        {staticSvg.nodes.map((n) => (
          <g
            key={n.id}
            style={{
              opacity: n.isVisible ? 1 : 0,
              transition: `opacity ${NODE_FADE_IN_MS}ms ease-in-out`,
            }}
          >
            <circle
              cx={n.cx}
              cy={n.cy}
              r={NODE_RADIUS}
              fill={getNodeColor(n.state, colors)}
            />
            <text
              x={n.cx}
              y={n.cy + NODE_RADIUS + 35}
              fontFamily="Arial"
              fontSize="20"
              fill={colors.text}
              textAnchor="middle"
            >
              {n.id.replace("static_task_", "Task ")}
            </text>
          </g>
        ))}
      </svg>

      {/* ------------------------------ Dynamic ---------------------------- */}
      <h2>Dynamic Benchmark</h2>
      <svg viewBox={dynamicSvg.viewBox} fill="none">
        {dynamicSvg.edges.map((e) => (
          <path
            key={e.id}
            ref={e.ref}
            d={e.d}
            stroke={colors.line}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {dynamicSvg.nodes.map((n) => {
          const raw = n.id
            .replace("dynamic_task_", "")
            .replace(/_success$|_fail$/, "");
          const label = `Task ${raw.replace(/_/g, "-")}`;

          return (
            <g
              key={n.id}
              style={{
                opacity: n.isVisible ? 1 : 0,
                transition: `opacity ${NODE_FADE_IN_MS}ms ease-in-out`,
              }}
            >
              <circle
                cx={n.cx}
                cy={n.cy}
                r={NODE_RADIUS}
                fill={getNodeColor(n.state, colors)}
              />
              <text
                x={n.cx}
                y={n.cy + NODE_RADIUS + 35}
                fontFamily="Arial"
                fontSize="20"
                fill={colors.text}
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </Stack>
  );
};

export default BenchmarkComparison;
