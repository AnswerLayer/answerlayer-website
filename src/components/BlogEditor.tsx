import { useState, useEffect, useCallback } from 'react';

interface BlogEditorProps {
  slug: string;
  initialContent?: string;
}

export default function BlogEditor({ slug, initialContent }: BlogEditorProps) {
  const [content, setContent] = useState(initialContent || '');
  const [status, setStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!initialContent) {
      fetch(`/api/save-blog?slug=${slug}`)
        .then(r => r.json())
        .then(data => setContent(data.content))
        .catch(() => setStatus('Failed to load'));
    }
  }, [slug, initialContent]);

  const save = useCallback(async () => {
    setStatus('Saving...');
    try {
      const res = await fetch('/api/save-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content })
      });
      if (res.ok) {
        setStatus('Saved!');
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Failed to save');
      }
    } catch {
      setStatus('Failed to save');
    }
  }, [slug, content]);

  // Keyboard shortcut: Cmd/Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && isEditing) {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [save, isEditing]);

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 16px',
          background: '#1e3a5f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: '"Space Mono", "IBM Plex Mono", monospace',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          zIndex: 1000,
        }}
      >
        Edit
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '10px 20px',
        background: '#1e3a5f',
        color: 'white',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        fontFamily: '"Space Mono", "IBM Plex Mono", monospace',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        <button
          onClick={save}
          style={{
            padding: '6px 12px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Save (⌘S)
        </button>
        <button
          onClick={() => setIsEditing(false)}
          style={{
            padding: '6px 12px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Close
        </button>
        <span style={{ marginLeft: 'auto', color: '#4CAF50' }}>{status}</span>
        <span style={{ color: '#999' }}>Editing: {slug}.md</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          padding: '20px',
          fontFamily: '"Space Mono", "IBM Plex Mono", "Courier New", monospace',
          fontSize: '14px',
          lineHeight: '1.6',
          resize: 'none',
          background: '#fff',
          color: '#333',
        }}
        spellCheck={false}
      />
    </div>
  );
}
