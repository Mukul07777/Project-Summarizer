import React, { useState, useEffect } from 'react';
import Cityscape from './components/Cityscape';
import UIOverlay from './components/UIOverlay';
import FileDetailsPanel from './components/FileDetailsPanel';
import { parseDirectory, buildCityLayout } from './core/CodeParser';
import { summarizeProject, askSpatialArchitect } from './core/AISummarizer';
import './App.css';

function App() {
  const [tree, setTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [projectMetadata, setProjectMetadata] = useState(null);
  const [aiProjectSummary, setAiProjectSummary] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDependencies, setActiveDependencies] = useState([]);
  
  const [aiHighlightedFiles, setAiHighlightedFiles] = useState([]);
  const [aiChatResponse, setAiChatResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

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
      setSearchQuery('');
      
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

  const handleSpatialChat = async (query) => {
    if (!tree) return;
    setIsAiThinking(true);
    setAiChatResponse('');
    setAiHighlightedFiles([]);

    const filePaths = [];
    const getPaths = (node) => {
      if (node.type === 'file') filePaths.push(node.path);
      if (node.children) node.children.forEach(getPaths);
    };
    getPaths(tree);

    const res = await askSpatialArchitect(query, filePaths, apiKey);
    setAiChatResponse(res.answer);
    setAiHighlightedFiles(res.paths || []);
    setIsAiThinking(false);
  };

  const handleFileClick = (fileData) => {
    setSelectedFile(fileData);
    setActiveDependencies([]); // Reset until parsed
  };

  const closePanel = () => {
    setSelectedFile(null);
    setActiveDependencies([]);
  };

  return (
    <div className="app-container">
      <div className="canvas-wrapper">
        <Cityscape 
          tree={tree} 
          onFileClick={handleFileClick} 
          searchQuery={searchQuery} 
          selectedFile={selectedFile}
          activeDependencies={activeDependencies}
          aiHighlightedFiles={aiHighlightedFiles}
        />
      </div>
      
      <UIOverlay 
        onSelectFolder={handleSelectFolder} 
        tree={tree} 
        projectSummary={aiProjectSummary} 
        isSummarizing={isSummarizing}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSpatialChat={handleSpatialChat}
        aiChatResponse={aiChatResponse}
        isAiThinking={isAiThinking}
      />
      
      <FileDetailsPanel 
        fileData={selectedFile} 
        onClose={closePanel} 
        apiKey={apiKey} 
        onDependenciesFound={setActiveDependencies}
      />
    </div>
  );
}

export default App;
