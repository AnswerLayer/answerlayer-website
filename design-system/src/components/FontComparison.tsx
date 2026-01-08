import React from "react";

const sampleText = `AnswerLayer generates a semantic layer from your database. Connect a data warehouse—PostgreSQL, BigQuery, Snowflake, MySQL—and get a complete semantic model in minutes. Entities, metrics, dimensions, filters, and relationships are all created automatically by analyzing your actual data, not just the schema.`;

const fonts = [
  // Authentic Windows 95/98 Recreation Fonts
  { name: "W95FA", family: "'W95FA', 'MS Sans Serif', sans-serif", note: "Faithful Windows 95 recreation font", thin: true },
  { name: "MS SANS SERIF", family: "'MS Sans Serif', 'Microsoft Sans Serif', sans-serif", note: "Original Windows 3.1/95/98 bitmap font", thin: true },
  // Windows 98 System Fonts
  { name: "TAHOMA (WIN98)", family: "Tahoma, 'Segoe UI', sans-serif", note: "Authentic Windows 98 UI font", thin: true },
  { name: "TREBUCHET MS (WIN98)", family: "'Trebuchet MS', sans-serif", note: "Microsoft 1996, era-appropriate", thin: true },
  { name: "VERDANA (WIN98)", family: "Verdana, Geneva, sans-serif", note: "Designed for screens, wider letterforms" },
  { name: "VT323 (PIXEL)", family: "'VT323', monospace", note: "True retro pixel/terminal aesthetic" },
  // Modern alternatives
  { name: "IBM PLEX SANS", family: "'IBM Plex Sans', system-ui, sans-serif", note: "Current - modern, professional" },
  { name: "INTER", family: "'Inter', system-ui, sans-serif", note: "Highly optimized for screens" },
  { name: "ATKINSON HYPERLEGIBLE", family: "'Atkinson Hyperlegible', system-ui, sans-serif", note: "Maximum readability" },
  { name: "ARIAL", family: "Arial, Helvetica, sans-serif", note: "Classic web default" },
];

export function FontComparison() {
  return (
    <div>
      {/* Google Fonts import - includes VT323 pixel font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=IBM+Plex+Sans:wght@400;500&family=Inter:wght@400;500&family=VT323&display=swap"
        rel="stylesheet"
      />
      {/* W95FA - Windows 95 recreation font (hosted locally) */}
      <style>{`
        @font-face {
          font-family: 'W95FA';
          src: url('/fonts/w95font.woff2') format('woff2'),
               url('/fonts/w95font.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div className="space-y-6">
        {fonts.map((font) => (
          <div key={font.name} className="border-2 border-navy-900 p-6 bg-white crt-glow">
            <div className="flex items-baseline gap-4 mb-4">
              <div className="uppercase text-xs tracking-widest text-navy-900 font-bold">
                {font.name}
              </div>
              {font.note && (
                <div className="text-xs text-navy-500">
                  {font.note}
                </div>
              )}
            </div>
            <p
              className="crt-text"
              style={{
                fontFamily: font.family,
                fontWeight: font.thin ? 300 : 400,
                fontSize: font.name.includes("VT323") || font.name.includes("W95FA") || font.name.includes("MS SANS")
                  ? "1rem"
                  : "1.125rem",
                lineHeight: font.name.includes("W95FA") || font.name.includes("MS SANS") ? 1.6 : 1.8,
                color: "#374151",
                // Disable font smoothing for bitmap-style fonts to get crisp edges
                ...(font.name.includes("W95FA") || font.name.includes("MS SANS") ? {
                  WebkitFontSmoothing: "none",
                  MozOsxFontSmoothing: "grayscale",
                  textRendering: "optimizeSpeed",
                } : {}),
              }}
            >
              {sampleText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
