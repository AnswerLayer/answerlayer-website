import React from "react";

const sampleText = `AnswerLayer generates a semantic layer from your database. Connect a data warehouse—PostgreSQL, BigQuery, Snowflake, MySQL—and get a complete semantic model in minutes. Entities, metrics, dimensions, filters, and relationships are all created automatically by analyzing your actual data, not just the schema.`;

const fonts = [
  { name: "IBM PLEX SANS", family: "'IBM Plex Sans', system-ui, sans-serif" },
  { name: "IBM PLEX SERIF", family: "'IBM Plex Serif', Georgia, serif" },
  { name: "ATKINSON HYPERLEGIBLE", family: "'Atkinson Hyperlegible', system-ui, sans-serif" },
  { name: "INTER", family: "'Inter', system-ui, sans-serif" },
  { name: "SOURCE SANS 3", family: "'Source Sans 3', system-ui, sans-serif" },
  { name: "SOURCE SERIF 4", family: "'Source Serif 4', Georgia, serif" },
  { name: "LIBRE FRANKLIN", family: "'Libre Franklin', system-ui, sans-serif" },
  { name: "LITERATA", family: "'Literata', Georgia, serif" },
];

export function FontComparison() {
  return (
    <div>
      {/* Google Fonts import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Serif:wght@400;500&family=Inter:wght@400;500&family=Libre+Franklin:wght@400;500&family=Literata:wght@400;500&family=Source+Sans+3:wght@400;500&family=Source+Serif+4:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="space-y-8">
        {fonts.map((font) => (
          <div key={font.name} className="border-2 border-navy-900 p-6 bg-white crt-glow">
            <div className="uppercase text-xs tracking-widest text-navy-600 mb-4">
              {font.name}
            </div>
            <p
              style={{
                fontFamily: font.family,
                fontWeight: 400,
                fontSize: "1.125rem",
                lineHeight: 1.8,
                color: "#374151",
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
