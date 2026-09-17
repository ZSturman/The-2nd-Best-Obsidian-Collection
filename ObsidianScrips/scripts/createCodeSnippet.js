function createCodeSnippet(inputData, fileName, tags) {
    const tagsString = tags.map(tag => `  - ${tag}`).join('\n');
    const newNote = `---
created: ${new Date().toISOString()}
aliases:
  - ${fileName}
tags:
  - Programming
${tagsString}
source: 
type: Code Snippet
language: ${inputData.language}

---

\`\`\` ${inputData.language}
${inputData.snippet}
\`\`\`

${inputData.codeExplanation}
`;

    return newNote;
}


module.exports = createCodeSnippet;
