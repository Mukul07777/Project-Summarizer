export async function summarizeFile(code, fileName, apiKey) {
  if (!apiKey) return "Please add your Gemini API key in Settings to view AI summaries.";
  
  try {
    const prompt = `You are a senior software engineer. Please summarize this file (${fileName}) in 2-3 concise sentences. What is the purpose of this file? What does it do? Here is the code:\n\n${code}`;
    return await callGemini(prompt, apiKey);
  } catch (err) {
    console.error(err);
    return "Failed to generate summary. Please check your API key and network connection.";
  }
}

export async function summarizeProject(projectMetadata, apiKey) {
  if (!apiKey) return "Please add your Gemini API key in Settings to view the project AI summary.";
  
  try {
    const prompt = `You are a senior software engineer. I am providing you with the contents of a package.json or README file for a project. Please give a detailed, 3-4 sentence summary of what this entire project is and what it does. Content:\n\n${projectMetadata}`;
    return await callGemini(prompt, apiKey);
  } catch (err) {
    console.error(err);
    return "Failed to generate project summary.";
  }
}

async function callGemini(prompt, apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
