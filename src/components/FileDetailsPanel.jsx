import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { parseFileContent } from '../core/FunctionParser';
import { summarizeFile } from '../core/AISummarizer';
import './FileDetailsPanel.css';

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileDetailsPanel = ({ fileData, onClose, apiKey }) => {
  const [details, setDetails] = useState({ code: '', symbols: [] });
  const [loading, setLoading] = useState(false);
  
  const [aiSummary, setAiSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (fileData && fileData.handle) {
      setLoading(true);
      setAiSummary(null);
      
      parseFileContent(fileData.handle, fileData.extension).then(res => {
        setDetails(res);
        setLoading(false);
        
        // Auto-summarize if API key exists
        if (apiKey && res.code) {
          setIsSummarizing(true);
          summarizeFile(res.code, fileData.name, apiKey).then(summary => {
            setAiSummary(summary);
            setIsSummarizing(false);
          });
        }
      });
    }
  }, [fileData, apiKey]);

  if (!fileData) {
    return <div className="side-panel"></div>;
  }

  return (
    <div className={`side-panel ${fileData ? 'open' : ''}`}>
      <div className="side-panel-header">
        <div className="file-title">
          <h2>{fileData.name}</h2>
          <span className="file-size">{formatBytes(fileData.size)}</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {loading ? (
        <div style={{ color: '#a0a0b0', marginTop: '2rem' }}>Parsing file structure...</div>
      ) : (
        <>
          {/* AI Summary Section */}
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#a855f7', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} /> AI File Summary
            </h3>
            {isSummarizing ? (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#d4d4d4', fontStyle: 'italic' }}>Analyzing code logic...</p>
            ) : aiSummary ? (
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff', lineHeight: '1.5' }}>{aiSummary}</p>
            ) : !apiKey ? (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#a0a0b0' }}>Connect your Gemini API Key in settings to enable intelligent summaries of what this file is used for.</p>
            ) : null}
          </div>

          {/* Internal Structure Section */}
          {details.symbols.length > 0 && (
            <>
              <h3 className="section-title">Internal Structure</h3>
              <div className="symbol-list">
                {details.symbols.map((sym, idx) => (
                  <div key={idx} className="symbol-item" style={{ cursor: 'default' }}>
                    <span className="symbol-name">{sym.name}</span>
                    <span className="symbol-type">{sym.type}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FileDetailsPanel;
