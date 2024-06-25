/**
 * Asynchronously increases the skip count for a specified note within Obsidian.
 * @param {string} notePath - The path to the note within the Obsidian vault.
 */
async function skipQueuedItem(notePath) {
    // Read the content of the note from the specified path.
    const noteContent = await app.vault.adapter.read(notePath);
  
    // Regular expression to extract the YAML frontmatter block from the note content.
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/m;
    // Attempt to match the frontmatter block in the note content.
    const frontmatterMatch = noteContent.match(frontmatterRegex);
    
    // Check if frontmatter was found.
    if (frontmatterMatch) {
        // Extract the current frontmatter content.
        let frontmatter = frontmatterMatch[1];
        // Regular expression to find the 'skipCount' property in the frontmatter.
        const skipCountRegex = /^skipCount:\s*(\d+)/m;
        // Attempt to match the 'skipCount' in the extracted frontmatter.
        const skipCountMatch = frontmatter.match(skipCountRegex);
    
        // Check if 'skipCount' was found in the frontmatter.
        if (skipCountMatch) {
            // Parse the current skip count as an integer.
            const currentSkipCount = parseInt(skipCountMatch[1]);
            // Increment the skip count by 1.
            const newSkipCount = currentSkipCount + 1;
            // Replace the old skip count in the frontmatter with the new count.
            frontmatter = frontmatter.replace(skipCountRegex, `skipCount: ${newSkipCount}`);
        } else {
            // If no skip count is found, append a 'skipCount' with a value of 1 to the frontmatter.
            frontmatter += `\nskipCount: 1`;
        }
    
        // Replace the old frontmatter in the note content with the updated frontmatter.
        const newContent = noteContent.replace(frontmatterRegex, `---\n${frontmatter}\n---`);
        // Write the updated content back to the note file.
        await app.vault.adapter.write(notePath, newContent);
    } else {
        // If no frontmatter block is found, prepend a new frontmatter block with 'skipCount: 1' to the note content.
        console.log("no frontmatterMatch");
        const newContent = `---\nskipCount: 1\n---\n` + noteContent;
        await app.vault.adapter.write(notePath, newContent);
    }
  }
  
  // Make the function available for import in other modules.
  module.exports = skipQueuedItem;
  