import React, { useState, useEffect } from 'react';
import Cityscape from './components/Cityscape';
import UIOverlay from './components/UIOverlay';
import FileDetailsPanel from './components/FileDetailsPanel';
import { parseDirectory, buildCityLayout } from './core/CodeParser';
import { summarizeProject } from './core/AISummarizer';
import './App.css';

function App() {
  const [tree, setTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [projectMetadata, setProjectMetadata] = useState(null);
  const [aiProjectSummary, setAiProjectSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleApiKeyChange = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleSelectFolder = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const parsedTree = await parseDirectory(dirHandle);
      const layoutTree = buildCityLayout(parsedTree);
      setTree(layoutTree);
      
      // Try to find a package.json or README.md to summarize the project
      let metadataStr = '';
      const packageJsonNode = parsedTree.children.find(c => c.name === 'package.json');
      const readmeNode = parsedTree.children.find(c => c.name.toLowerCase() === 'readme.md');
      
      if (packageJsonNode && packageJsonNode.handle) {
        const file = await packageJsonNode.handle.getFile();
        metadataStr += await file.text();
      } else if (readmeNode && readmeNode.handle) {
        const file = await readmeNode.handle.getFile();
        metadataStr += await file.text();
      } else {
        metadataStr = "No package.json or README found. Just a generic folder of files.";
      }
      
      setProjectMetadata(metadataStr);
      
      // If API key is present, auto-summarize
      if (apiKey && metadataStr) {
        setIsSummarizing(true);
        const summary = await summarizeProject(metadataStr, apiKey);
        setAiProjectSummary(summary);
        setIsSummarizing(false);
      } else {
        setAiProjectSummary(null);
      }
      
    } catch (err) {
      console.error('Error selecting folder:', err);
    }
  };

  // Re-run summary if API key is added later and we already have metadata
  useEffect(() => {
    if (apiKey && projectMetadata && !aiProjectSummary && !isSummarizing) {
      setIsSummarizing(true);
      summarizeProject(projectMetadata, apiKey).then(summary => {
        setAiProjectSummary(summary);
        setIsSummarizing(false);
      });
    }
  }, [apiKey, projectMetadata]);

  const handleFileClick = (fileData) => {
    setSelectedFile(fileData);
  };

  const closePanel = () => {
    setSelectedFile(null);
  };

  return (
    <div className="app-container">
      <div className="canvas-wrapper">
        <Cityscape tree={tree} onFileClick={handleFileClick} />
      </div>
      
      <UIOverlay 
        onSelectFolder={handleSelectFolder} 
        tree={tree} 
        projectSummary={aiProjectSummary} 
        isSummarizing={isSummarizing}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
      
      <FileDetailsPanel 
        fileData={selectedFile} 
        onClose={closePanel} 
        apiKey={apiKey} 
      />
    </div>
  );
}

export default App;
