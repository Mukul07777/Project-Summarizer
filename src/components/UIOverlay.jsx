import React, { useState } from 'react';
import { FolderOpen, Code2, Database, Settings } from 'lucide-react';
import './UIOverlay.css';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const UIOverlay = ({ onSelectFolder, tree, projectSummary, isSummarizing, apiKey, onApiKeyChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const totalFiles = tree ? countFiles(tree) : 0;
  
  function countFiles(node) {
    if (node.type === 'file') return 1;
    let count = 0;
    if (node.children) {
      for (const child of node.children) {
        count += countFiles(child);
      }
    }
    return count;
  }

  const legend = [
    { label: 'JavaScript', color: '#f7df1e' },
    { label: 'TypeScript', color: '#3178c6' },
    { label: 'React (JSX/TSX)', color: '#61dafb' },
    { label: 'CSS/Styles', color: '#264de4' },
    { label: 'HTML', color: '#e34f26' },
    { label: 'Markdown', color: '#ffffff' },
  ];

  return (
    <div className="ui-container">
      <div className="header">
        <div className="glass-panel" style={{ position: 'relative' }}>
          
          <button 
            className="settings-btn" 
            onClick={() => setShowSettings(!showSettings)}
            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#a0a0b0', cursor: 'pointer' }}
          >
            <Settings size={20} />
          </button>

          {showSettings ? (
            <div className="settings-panel" style={{ minWidth: '300px' }}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#fff' }}>AI Settings</h2>
              <p style={{ fontSize: '0.85rem', color: '#a0a0b0', marginBottom: '1rem' }}>
                Enter a Gemini API key to enable intelligent code summaries. It is stored securely in your local browser.
              </p>
              <input 
                type="password" 
                placeholder="Paste Gemini API Key..."
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #4a4a6a', background: '#050510', color: '#fff', marginBottom: '1rem' }}
              />
              <button className="btn-primary" onClick={() => setShowSettings(false)} style={{ width: '100%', justifyContent: 'center' }}>
                Save & Close
              </button>
            </div>
          ) : (
            <div className="title-group">
              <h1>Cityscape Visualizer</h1>
              
              {isSummarizing ? (
                <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', maxWidth: '400px' }}>
                  <p style={{ color: '#a855f7', fontSize: '0.85rem', margin: 0 }}>✨ AI is analyzing the project...</p>
                </div>
              ) : projectSummary ? (
                <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', maxWidth: '400px' }}>
                  <strong style={{ color: '#a855f7', display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>✨ AI Project Summary</strong>
                  <p style={{ color: '#d4d4d4', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{projectSummary}</p>
                </div>
              ) : !apiKey && tree ? (
                 <div style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', maxWidth: '400px' }}>
                   <p style={{ color: '#a0a0b0', fontSize: '0.85rem', margin: 0 }}>Click the gear icon to add an AI API key for full project summaries.</p>
                 </div>
              ) : (
                <p>Explore your codebase in 3D</p>
              )}

              <div className="stats">
                <button className="btn-primary" onClick={onSelectFolder}>
                  <FolderOpen size={20} />
                  Select Local Folder
                </button>
                
                {tree && (
                  <>
                    <div className="stat-item">
                      <Code2 className="stat-icon" size={24} />
                      <div className="stat-info">
                        <span>Total Files</span>
                        <strong>{totalFiles}</strong>
                      </div>
                    </div>
                    <div className="stat-item">
                      <Database className="stat-icon" size={24} />
                      <div className="stat-info">
                        <span>Total Size</span>
                        <strong>{formatBytes(tree.size)}</strong>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {!showSettings && (
        <div className="glass-panel legend">
          <h3>File Types</h3>
          <div className="legend-items">
            {legend.map(item => (
              <div key={item.label} className="legend-item">
                <div className="color-dot" style={{ color: item.color, backgroundColor: item.color }}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
