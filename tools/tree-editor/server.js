const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3456;

// Path to discover content
const DISCOVER_PATH = path.join(__dirname, '../../src/content/discover');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Parse a markdown file into structured data
function parseNode(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const filename = path.basename(filepath, '.md');

  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return { id: filename, title: filename, options: [], external: false, externalUrl: null, body: content };
  }

  const frontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2].trim();

  // Extract fields
  const titleMatch = frontmatter.match(/title: "([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : filename;

  const externalMatch = frontmatter.match(/external: (true|false)/);
  const external = externalMatch ? externalMatch[1] === 'true' : false;

  const externalUrlMatch = frontmatter.match(/externalUrl: "([^"]+)"/);
  const externalUrl = externalUrlMatch ? externalUrlMatch[1] : null;

  // Parse options
  const options = [];
  const optionsMatch = frontmatter.match(/options:\n([\s\S]*?)(?=\nexternal:|$)/);
  if (optionsMatch) {
    const optionsBlock = optionsMatch[1];
    const optionMatches = optionsBlock.matchAll(/- label: "([^"]+)"\n\s+target: "([^"]+)"/g);
    for (const match of optionMatches) {
      options.push({ label: match[1], target: match[2] });
    }
  }

  return { id: filename, title, options, external, externalUrl, body };
}

// Serialize node back to markdown
function serializeNode(node) {
  let frontmatter = `---\ntitle: "${node.title}"\noptions:`;

  if (node.options && node.options.length > 0) {
    frontmatter += '\n';
    for (const opt of node.options) {
      frontmatter += `  - label: "${opt.label}"\n    target: "${opt.target}"\n`;
    }
  } else {
    frontmatter += ' []\n';
  }

  frontmatter += `external: ${node.external || false}\n`;
  frontmatter += `externalUrl: ${node.externalUrl ? `"${node.externalUrl}"` : 'null'}\n`;
  frontmatter += '---\n';

  return frontmatter + (node.body || '');
}

// GET /api/nodes - List all nodes
app.get('/api/nodes', (req, res) => {
  try {
    const files = fs.readdirSync(DISCOVER_PATH).filter(f => f.endsWith('.md'));
    const nodes = {};

    for (const file of files) {
      const filepath = path.join(DISCOVER_PATH, file);
      const node = parseNode(filepath);
      nodes[node.id] = node;
    }

    res.json(nodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/nodes/:id - Get single node
app.get('/api/nodes/:id', (req, res) => {
  try {
    const filepath = path.join(DISCOVER_PATH, `${req.params.id}.md`);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Node not found' });
    }
    const node = parseNode(filepath);
    res.json(node);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/nodes/:id - Update node
app.put('/api/nodes/:id', (req, res) => {
  try {
    const filepath = path.join(DISCOVER_PATH, `${req.params.id}.md`);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Node not found' });
    }

    const existing = parseNode(filepath);
    const updated = { ...existing, ...req.body, id: req.params.id };
    const content = serializeNode(updated);

    fs.writeFileSync(filepath, content, 'utf-8');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/nodes/:id - Delete node
app.delete('/api/nodes/:id', (req, res) => {
  try {
    const filepath = path.join(DISCOVER_PATH, `${req.params.id}.md`);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Node not found' });
    }

    fs.unlinkSync(filepath);
    res.json({ success: true, deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/nodes/:id/rename - Rename node and update all references
app.post('/api/nodes/:id/rename', (req, res) => {
  try {
    const oldId = req.params.id;
    const newId = req.body.newId;

    if (!newId) {
      return res.status(400).json({ error: 'newId is required' });
    }

    const oldPath = path.join(DISCOVER_PATH, `${oldId}.md`);
    const newPath = path.join(DISCOVER_PATH, `${newId}.md`);

    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({ error: 'Node not found' });
    }

    if (fs.existsSync(newPath)) {
      return res.status(400).json({ error: 'A node with that ID already exists' });
    }

    // Rename the file
    fs.renameSync(oldPath, newPath);

    // Update the node's internal id
    const node = parseNode(newPath);
    node.id = newId;
    fs.writeFileSync(newPath, serializeNode(node), 'utf-8');

    // Update all references in other files
    const files = fs.readdirSync(DISCOVER_PATH).filter(f => f.endsWith('.md'));
    let updatedCount = 0;

    for (const file of files) {
      const filepath = path.join(DISCOVER_PATH, file);
      let content = fs.readFileSync(filepath, 'utf-8');

      // Replace target references
      const searchStr = `target: "${oldId}"`;
      if (content.includes(searchStr)) {
        content = content.replaceAll(searchStr, `target: "${newId}"`);
        fs.writeFileSync(filepath, content, 'utf-8');
        updatedCount++;
      }
    }

    res.json({ success: true, oldId, newId, referencesUpdated: updatedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/nodes - Create new node
app.post('/api/nodes', (req, res) => {
  try {
    const { id, title, options, external, externalUrl, body } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const filepath = path.join(DISCOVER_PATH, `${id}.md`);
    if (fs.existsSync(filepath)) {
      return res.status(400).json({ error: 'A node with that ID already exists' });
    }

    const node = {
      id,
      title: title || id,
      options: options || [],
      external: external || false,
      externalUrl: externalUrl || null,
      body: body || ''
    };

    fs.writeFileSync(filepath, serializeNode(node), 'utf-8');
    res.json(node);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  🌳 Concept Tree Editor`);
  console.log(`  ─────────────────────`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  Content:    ${DISCOVER_PATH}`);
  console.log(`\n  Press Ctrl+C to stop\n`);
});
