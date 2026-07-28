export async function parseFileContent(handle, extension) {
  try {
    const file = await handle.getFile();
    const text = await file.text();
    return extractSymbols(text, extension);
  } catch (err) {
    console.error("Error reading file", err);
    return { code: "Could not read file content.", symbols: [] };
  }
}

function extractSymbols(code, extension) {
  const symbols = [];
  
  if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) {
    // Basic regex for function declarations, arrow functions, and classes
    const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_]+)\s*\(/g;
    const arrowRegex = /(?:export\s+)?(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>/g;
    const classRegex = /(?:export\s+)?class\s+([a-zA-Z0-9_]+)/g;

    let match;
    while ((match = funcRegex.exec(code)) !== null) {
      symbols.push({ name: match[1], type: 'Function' });
    }
    while ((match = arrowRegex.exec(code)) !== null) {
      symbols.push({ name: match[1], type: 'Arrow Function' });
    }
    while ((match = classRegex.exec(code)) !== null) {
      symbols.push({ name: match[1], type: 'Class' });
    }
  } else if (extension === 'py') {
    const defRegex = /def\s+([a-zA-Z0-9_]+)\s*\(/g;
    const classRegex = /class\s+([a-zA-Z0-9_]+)/g;
    
    let match;
    while ((match = defRegex.exec(code)) !== null) {
      symbols.push({ name: match[1], type: 'Function' });
    }
    while ((match = classRegex.exec(code)) !== null) {
      symbols.push({ name: match[1], type: 'Class' });
    }
  }
  
  // Sort alphabetically and remove duplicates
  const uniqueSymbols = [];
  const seen = new Set();
  for (const sym of symbols) {
    if (!seen.has(sym.name)) {
      seen.add(sym.name);
      uniqueSymbols.push(sym);
    }
  }
  
  uniqueSymbols.sort((a, b) => a.name.localeCompare(b.name));
  
  // Extract imports
  const imports = [];
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  
  let matchImport;
  while ((matchImport = importRegex.exec(code)) !== null) {
    imports.push(matchImport[1]);
  }
  while ((matchImport = requireRegex.exec(code)) !== null) {
    imports.push(matchImport[1]);
  }
  
  return { code, symbols: uniqueSymbols, imports };
}
