"use client";

import { useEffect, useRef, useState } from "react";
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, type Simulation } from "d3-force";
import { buildUniverseGraph, type UniverseNode, type UniverseEdge } from "@/lib/universe-graph";
import { NodeDetailPanel } from "./NodeDetailPanel";

const RADIUS: Record<UniverseNode["kind"], number> = {
  core: 24,
  era: 15,
  album: 10,
  song: 6.5,
  collaborator: 5,
};
const COLOR: Record<UniverseNode["kind"], string> = {
  core: "#e4c077",
  era: "#c6a662",
  album: "#f5f1e8",
  song: "#a8a096",
  collaborator: "#6f695f",
};

interface Transform {
  x: number;
  y: number;
  k: number;
}

export function UniverseCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<UniverseNode | null>(null);
  const selectedRef = useRef<UniverseNode | null>(null);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { nodes, edges } = buildUniverseGraph();
    const transform: Transform = { x: 0, y: 0, k: 0.85 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = container.clientWidth;
    let height = container.clientHeight;

    function resize() {
      width = container!.clientWidth;
      height = container!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      draw();
    }

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);
      ctx!.save();
      ctx!.translate(width / 2 + transform.x, height / 2 + transform.y);
      ctx!.scale(transform.k, transform.k);

      ctx!.strokeStyle = "rgba(245,241,232,0.09)";
      ctx!.lineWidth = 1 / transform.k;
      for (const e of edges) {
        const s = e.source as unknown as UniverseNode;
        const t = e.target as unknown as UniverseNode;
        if (s.x == null || t.x == null || s.y == null || t.y == null) continue;
        ctx!.beginPath();
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(t.x, t.y);
        ctx!.stroke();
      }

      for (const n of nodes) {
        if (n.x == null || n.y == null) continue;
        const isSelected = selectedRef.current?.id === n.id;
        ctx!.beginPath();
        ctx!.fillStyle = isSelected ? "#e4c077" : COLOR[n.kind];
        ctx!.arc(n.x, n.y, isSelected ? RADIUS[n.kind] * 1.25 : RADIUS[n.kind], 0, Math.PI * 2);
        ctx!.fill();
        if (isSelected) {
          ctx!.lineWidth = 1.5 / transform.k;
          ctx!.strokeStyle = "#e4c077";
          ctx!.stroke();
        }

        if (n.kind === "core" || n.kind === "era" || n.kind === "album" || isSelected) {
          ctx!.fillStyle = isSelected ? "#e4c077" : "#f5f1e8";
          ctx!.font = `${n.kind === "core" ? 14 : 10}px Instrument Sans, sans-serif`;
          ctx!.textAlign = "center";
          ctx!.fillText(n.label, n.x, n.y + RADIUS[n.kind] + 15);
        }
      }
      ctx!.restore();
    }

    const simulation: Simulation<UniverseNode, UniverseEdge> = forceSimulation(nodes)
      .force(
        "link",
        forceLink<UniverseNode, UniverseEdge>(edges)
          .id((d) => d.id)
          .distance((l) => {
            const s = l.source as unknown as UniverseNode;
            if (s.kind === "core") return 150;
            if (s.kind === "era") return 95;
            return 42;
          })
          .strength(0.75),
      )
      .force("charge", forceManyBody().strength(-85))
      .force("center", forceCenter(0, 0))
      .force(
        "collide",
        forceCollide<UniverseNode>((d) => RADIUS[d.kind] + 16),
      );

    simulation.on("tick", draw);

    // --- pointer interaction: pan, click, wheel-zoom, pinch-zoom ---
    const pointers = new Map<number, { x: number; y: number }>();
    let dragging = false;
    let dragStart = { x: 0, y: 0 };
    let transformStart = { x: 0, y: 0 };
    let pinchStartDist = 0;
    let pinchStartK = 1;
    let moved = false;

    function toLocal(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      const px = clientX - rect.left - width / 2 - transform.x;
      const py = clientY - rect.top - height / 2 - transform.y;
      return { x: px / transform.k, y: py / transform.k };
    }

    function hitTest(clientX: number, clientY: number): UniverseNode | null {
      const { x, y } = toLocal(clientX, clientY);
      let closest: UniverseNode | null = null;
      let closestDist = Infinity;
      for (const n of nodes) {
        if (n.x == null || n.y == null) continue;
        const d = Math.hypot(n.x - x, n.y - y);
        const r = RADIUS[n.kind] + 6;
        if (d < r && d < closestDist) {
          closest = n;
          closestDist = d;
        }
      }
      return closest;
    }

    function onPointerDown(e: PointerEvent) {
      canvas!.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = false;
      if (pointers.size === 1) {
        dragging = true;
        dragStart = { x: e.clientX, y: e.clientY };
        transformStart = { x: transform.x, y: transform.y };
      } else if (pointers.size === 2) {
        dragging = false;
        const pts = [...pointers.values()];
        pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        pinchStartK = transform.k;
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        const pts = [...pointers.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        transform.k = Math.min(2.5, Math.max(0.3, pinchStartK * (dist / pinchStartDist)));
        draw();
        return;
      }

      if (dragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        if (Math.hypot(dx, dy) > 4) moved = true;
        transform.x = transformStart.x + dx;
        transform.y = transformStart.y + dy;
        draw();
      }
    }

    function onPointerUp(e: PointerEvent) {
      if (!moved && pointers.size <= 1) {
        const hit = hitTest(e.clientX, e.clientY);
        setSelected(hit);
        draw();
      }
      pointers.delete(e.pointerId);
      dragging = pointers.size === 1;
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const delta = -e.deltaY * 0.0012;
      transform.k = Math.min(2.5, Math.max(0.3, transform.k * (1 + delta)));
      draw();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    return () => {
      simulation.stop();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[70vh] min-h-[440px] w-full overflow-hidden rounded-xl border border-hairline bg-surface">
      <canvas ref={canvasRef} className="cursor-grab touch-none active:cursor-grabbing" />
      <div className="pointer-events-none absolute left-4 top-4 font-display text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        Drag · Scroll to zoom · Click a node
      </div>
      {selected && <NodeDetailPanel node={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
