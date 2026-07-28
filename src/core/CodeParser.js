export async function parseDirectory(dirHandle, path = '') {
  const result = {
    name: dirHandle.name,
    type: 'directory',
    path: path + dirHandle.name,
    children: [],
    size: 0,
  };

  for await (const entry of dirHandle.values()) {
    // Ignore hidden files and node_modules
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.kind === 'file') {
      const file = await entry.getFile();
      const extension = entry.name.split('.').pop().toLowerCase();
      result.children.push({
        name: entry.name,
        type: 'file',
        path: path + dirHandle.name + '/' + entry.name,
        size: file.size,
        extension,
        handle: entry,
      });
      result.size += file.size;
    } else if (entry.kind === 'directory') {
      const childDir = await parseDirectory(entry, path + dirHandle.name + '/');
      result.children.push(childDir);
      result.size += childDir.size;
    }
  }
  return result;
}

export function buildCityLayout(tree) {
  // Simple layout logic: for MVP we just return the tree.
  // The recursive District component handles the grid layout internally.
  return tree;
}
