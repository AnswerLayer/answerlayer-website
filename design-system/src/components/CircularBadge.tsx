import React, { useState, useRef, useCallback, useMemo } from 'react';

interface CircularBadgeProps {
  text?: string;
  size?: number;
  className?: string;
}

// Seeded pseudo-random number generator for consistent organic offsets
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Utility functions
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
  Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

export function CircularBadge({
  text = 'NUCLEUS ENGINEERING OFFICE • REINDUSTRIALIZE',
  size = 320,
  className = ''
}: CircularBadgeProps) {
  const viewBoxSize = 200;
  const center = viewBoxSize / 2;

  // State & refs
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Helper to create hexagon points
  const createHexagon = useCallback((cx: number, cy: number, radius: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 30) * (Math.PI / 180);
      points.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      });
    }
    return points;
  }, []);

  // Generate hexagon path
  const hexagonPath = useCallback((cx: number, cy: number, radius: number) => {
    const pts = createHexagon(cx, cy, radius);
    return `M ${pts[0].x} ${pts[0].y} ${pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')} Z`;
  }, [createHexagon]);

  // Compute all positions with organic irregularity (seeded for consistency)
  const positions = useMemo(() => {
    const rand = seededRandom(42); // Consistent seed

    // Apply ±2-5 unit offsets to hexagon centers
    const mainHexagons = [
      { x: center, y: center - 52, r: 18 },      // Top
      { x: center + 45, y: center - 26, r: 18 }, // Top-right
      { x: center + 45, y: center + 26, r: 18 }, // Bottom-right
      { x: center, y: center + 52, r: 18 },      // Bottom
      { x: center - 45, y: center + 26, r: 18 }, // Bottom-left
      { x: center - 45, y: center - 26, r: 18 }, // Top-left
    ].map(hex => ({
      x: hex.x + (rand() - 0.5) * 4, // ±2 units (smaller for structure)
      y: hex.y + (rand() - 0.5) * 4,
      r: hex.r
    }));

    // Outer nodes with ±2-5 unit offsets and varied sizes
    const outerNodes = [
      { x: center + 75, y: center - 40, baseSize: 2.5 },
      { x: center + 80, y: center + 15, baseSize: 2 },
      { x: center + 55, y: center + 65, baseSize: 2.5 },
      { x: center - 5, y: center + 78, baseSize: 2 },
      { x: center - 60, y: center + 58, baseSize: 2.5 },
      { x: center - 78, y: center + 5, baseSize: 2 },
      { x: center - 72, y: center - 45, baseSize: 2.5 },
      { x: center - 25, y: center - 75, baseSize: 2 },
      { x: center + 35, y: center - 72, baseSize: 2.5 },
    ].map(node => ({
      x: node.x + (rand() - 0.5) * 8, // ±4 units (more irregular for peripheral)
      y: node.y + (rand() - 0.5) * 8,
      size: node.baseSize + (rand() - 0.5) * 0.6 // 2.0-2.8 range
    }));

    // Get all vertices with small offsets (±1-2 units to maintain hex shape)
    const allVertices: { x: number; y: number; hexIndex: number; vertexIndex: number }[] = [];
    mainHexagons.forEach((hex, hexIndex) => {
      const pts = createHexagon(hex.x, hex.y, hex.r);
      pts.forEach((pt, vertexIndex) => {
        allVertices.push({
          x: pt.x + (rand() - 0.5) * 2, // ±1 unit
          y: pt.y + (rand() - 0.5) * 2,
          hexIndex,
          vertexIndex
        });
      });
    });

    // Inter-hexagon bonds
    const interHexBonds = [
      { from: { hex: 0, v: 4 }, to: { hex: 1, v: 1 } },
      { from: { hex: 1, v: 4 }, to: { hex: 2, v: 1 } },
      { from: { hex: 2, v: 4 }, to: { hex: 3, v: 1 } },
      { from: { hex: 3, v: 4 }, to: { hex: 4, v: 1 } },
      { from: { hex: 4, v: 4 }, to: { hex: 5, v: 1 } },
      { from: { hex: 5, v: 4 }, to: { hex: 0, v: 1 } },
    ];

    // Outer bonds - connect each outer node to nearest hexagon vertex
    const outerBonds = outerNodes.map((node, i) => {
      const targetHex = mainHexagons[i % mainHexagons.length];
      const targetPts = createHexagon(targetHex.x, targetHex.y, targetHex.r);
      let closest = targetPts[0];
      let minDist = Infinity;
      targetPts.forEach(pt => {
        const dist = Math.sqrt((pt.x - node.x) ** 2 + (pt.y - node.y) ** 2);
        if (dist < minDist) {
          minDist = dist;
          closest = pt;
        }
      });
      return { from: node, to: closest };
    });

    return { mainHexagons, outerNodes, allVertices, interHexBonds, outerBonds };
  }, [center, createHexagon]);

  // Calculate opacities based on cursor position
  const opacities = useMemo(() => {
    const { mainHexagons, outerNodes, allVertices } = positions;

    // Default opacities when cursor is outside (all visible at base opacity)
    const defaultOpacity = 0.7;
    const defaultOuterOpacity = 0.6;

    if (!cursorPos) {
      return {
        hexagons: mainHexagons.map(() => defaultOpacity),
        vertices: allVertices.map(() => defaultOpacity),
        outerNodes: outerNodes.map(() => defaultOuterOpacity),
        interHexBonds: 0.5,
        outerBonds: outerNodes.map(() => 0.35),
        nucleus: 0.7,
        nucleusHovered: false
      };
    }

    // Calculate opacity based on distance: inner zone (0-30) = 1.0, fade zone (30-80) = fade, outer = 0.1
    const innerRadius = 30;
    const fadeRange = 50;

    const calcOpacity = (pos: { x: number; y: number }) => {
      const dist = distance(cursorPos, pos);
      return clamp(1 - (dist - innerRadius) / fadeRange, 0.1, 1.0);
    };

    // Hexagon opacities (with 0.3 floor for core visibility)
    const hexagonOpacities = mainHexagons.map(hex =>
      Math.max(0.3, calcOpacity({ x: hex.x, y: hex.y }))
    );

    // Vertex opacities (with 0.25 floor)
    const vertexOpacities = allVertices.map(v =>
      Math.max(0.25, calcOpacity({ x: v.x, y: v.y }))
    );

    // Outer node opacities (no floor - can fully fade)
    const outerNodeOpacities = outerNodes.map(node =>
      calcOpacity({ x: node.x, y: node.y })
    );

    // Outer bond opacities = max of their endpoints * 0.85
    const outerBondOpacities = positions.outerBonds.map((bond, i) => {
      const nodeOpacity = outerNodeOpacities[i];
      // Find the closest vertex to the bond's 'to' point
      const closestVertexIdx = allVertices.findIndex(v =>
        Math.abs(v.x - bond.to.x) < 5 && Math.abs(v.y - bond.to.y) < 5
      );
      const vertexOpacity = closestVertexIdx >= 0 ? vertexOpacities[closestVertexIdx] : 0.3;
      return Math.max(nodeOpacity, vertexOpacity) * 0.85;
    });

    // Inter-hex bond opacity (with 0.2 floor)
    const avgHexOpacity = hexagonOpacities.reduce((a, b) => a + b, 0) / hexagonOpacities.length;
    const interHexBondOpacity = Math.max(0.2, avgHexOpacity * 0.8);

    // Nucleus opacity (with 0.5 floor)
    const nucleusDist = distance(cursorPos, { x: center, y: center });
    const nucleusOpacity = Math.max(0.5, calcOpacity({ x: center, y: center }));
    const nucleusHovered = nucleusDist < 30;

    return {
      hexagons: hexagonOpacities,
      vertices: vertexOpacities,
      outerNodes: outerNodeOpacities,
      interHexBonds: interHexBondOpacity,
      outerBonds: outerBondOpacities,
      nucleus: nucleusOpacity,
      nucleusHovered
    };
  }, [cursorPos, positions, center]);

  // Mouse event handlers
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgP = pt.matrixTransform(ctm.inverse());
    setCursorPos({ x: svgP.x, y: svgP.y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorPos(null);
  }, []);

  const { mainHexagons, outerNodes, allVertices, interHexBonds, outerBonds } = positions;

  // Transition style for smooth opacity changes
  const transitionStyle = { transition: 'opacity 0.3s ease-out' };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <defs>
          {/* CRT glow filter */}
          <filter id="crt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.8" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Circular text path - larger radius to avoid overlap */}
          <path
            id="textCircle"
            d={`M ${center}, ${center} m -92, 0 a 92,92 0 1,1 184,0 a 92,92 0 1,1 -184,0`}
            fill="none"
          />
        </defs>

        {/* === OUTER BOUNDARY CIRCLE (subtle) === */}
        <circle
          cx={center} cy={center} r={96}
          fill="none"
          stroke="var(--color-navy-300)"
          strokeWidth="0.3"
          opacity="0.3"
          style={transitionStyle}
        />

        {/* === MOLECULAR HEXAGON RING === */}
        <g className="hexagon-ring" filter="url(#crt-glow)">
          {mainHexagons.map((hex, i) => (
            <path
              key={`hex-${i}`}
              d={hexagonPath(hex.x, hex.y, hex.r)}
              fill="none"
              stroke="var(--color-navy-500)"
              strokeWidth="1"
              opacity={opacities.hexagons[i]}
              style={transitionStyle}
            />
          ))}
        </g>

        {/* === INTER-HEXAGON BONDS === */}
        <g className="inter-bonds" opacity={opacities.interHexBonds} style={transitionStyle}>
          {interHexBonds.map((bond, i) => {
            const fromHex = mainHexagons[bond.from.hex];
            const toHex = mainHexagons[bond.to.hex];
            const fromPts = createHexagon(fromHex.x, fromHex.y, fromHex.r);
            const toPts = createHexagon(toHex.x, toHex.y, toHex.r);
            return (
              <line
                key={`inter-${i}`}
                x1={fromPts[bond.from.v].x} y1={fromPts[bond.from.v].y}
                x2={toPts[bond.to.v].x} y2={toPts[bond.to.v].y}
                stroke="var(--color-navy-400)"
                strokeWidth="0.8"
              />
            );
          })}
        </g>

        {/* === OUTER NODE BONDS === */}
        <g className="outer-bonds">
          {outerBonds.map((bond, i) => (
            <line
              key={`outer-bond-${i}`}
              x1={bond.from.x} y1={bond.from.y}
              x2={bond.to.x} y2={bond.to.y}
              stroke="var(--color-navy-400)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity={opacities.outerBonds[i]}
              style={transitionStyle}
            />
          ))}
        </g>

        {/* === HEXAGON VERTEX NODES === */}
        <g className="hex-vertices" filter="url(#crt-glow)">
          {allVertices.map((v, i) => (
            <circle
              key={`vertex-${i}`}
              cx={v.x} cy={v.y} r={2}
              fill="var(--color-navy-500)"
              opacity={opacities.vertices[i]}
              style={transitionStyle}
            />
          ))}
        </g>

        {/* === OUTER SCATTERED NODES === */}
        <g className="outer-nodes" filter="url(#crt-glow)">
          {outerNodes.map((node, i) => (
            <g key={`outer-${i}`} opacity={opacities.outerNodes[i]} style={transitionStyle}>
              <circle
                cx={node.x} cy={node.y} r={node.size}
                fill="var(--color-background)"
                stroke="var(--color-navy-400)"
                strokeWidth="0.8"
              />
              {i % 2 === 0 && (
                <circle
                  cx={node.x} cy={node.y} r={0.8}
                  fill="var(--color-navy-600)"
                />
              )}
            </g>
          ))}
        </g>

        {/* === CENTER NUCLEUS === */}
        <g style={transitionStyle} opacity={opacities.nucleus}>
          <circle
            cx={center} cy={center} r={20}
            fill="none"
            stroke="var(--color-navy-600)"
            strokeWidth="1.5"
            filter="url(#crt-glow)"
          />

          <circle
            cx={center} cy={center} r={14}
            fill="var(--color-background)"
            stroke="var(--color-navy-700)"
            strokeWidth="1"
          />

          {/* Nucleus core */}
          <circle
            cx={center} cy={center} r={5}
            fill="var(--color-navy-600)"
            filter="url(#crt-glow)"
          />

          {/* Electron indicators around nucleus */}
          <g className={opacities.nucleusHovered ? 'animate-pulse' : ''}>
            <circle cx={center + 9} cy={center - 2} r={1.5} fill="var(--color-navy-400)" opacity="0.7"/>
            <circle cx={center - 6} cy={center + 7} r={1.5} fill="var(--color-navy-400)" opacity="0.7"/>
            <circle cx={center - 5} cy={center - 8} r={1.5} fill="var(--color-navy-400)" opacity="0.7"/>
          </g>
        </g>

        {/* === CIRCULAR TEXT (outer edge) === */}
        <text
          fontSize="5.5"
          fill="var(--color-navy-500)"
          fontFamily="monospace"
          letterSpacing="0.2em"
          opacity="0.7"
          filter="url(#crt-glow)"
        >
          <textPath href="#textCircle" startOffset="0%">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>

      {/* CRT scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Phosphor glow effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          boxShadow: 'inset 0 0 50px rgba(56, 67, 147, 0.06), 0 0 30px rgba(56, 67, 147, 0.1)',
        }}
      />
    </div>
  );
}
