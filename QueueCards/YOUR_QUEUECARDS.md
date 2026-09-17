# YOUR QUEUE CARDS HERE

*To show more or less queued items at a time change the `numberOfDisplayedItems` variable*

*If you have a `templates` folder that you want to be ignored comment out the first `let toPages = ...` codeblock and uncomment out the second replacing `YOUR_TEMPLATES_FOLDER` with the name of your templates folder*

``` dataviewjs
// Retrieve the Templater plugins functions object to use in the script.
const tp = app.plugins.getPlugin("templater-obsidian").templater.current_functions_object;

// Set the number of displayed items.
let numberOfDisplayedItems = 4;

// Fetch pages that have a 'to' property.
let toPages = await dv.pages()
	.filter(
		page => 
			page.file?.folder && 
			page.file.folder != "_templates")
	.where(
		page => page.to != null)

// Fetch pages that have a 'to' property and are not located in the '_templates' folder.
//let toPages = await dv.pages().filter(page => page.file?.folder && page.file.folder != "YOUR_TEMPLATES_FOLDER").where(page => page.to != null)

// Display the number of queued items as a paragraph.
dv.paragraph(`Queued items: ${toPages.length}`);

// Group the filtered pages by their modification date.
toPages = toPages.groupBy(
		page => page.file.mday);

// Function to retrieve the first 150 characters of a files content, excluding frontmatter.
async function getFileContent(filePath) { 
	const file = await app.vault.getAbstractFileByPath(filePath); 
	if (!file) return ''; 
	const content = await app.vault.read(file); 
	let contentWithoutFrontmatter = content; 
	if (content.startsWith('---')) { 
		const endOfFrontmatter = content.indexOf('---', 3); 
		if (endOfFrontmatter !== -1) { 
			contentWithoutFrontmatter = content.slice(endOfFrontmatter + 3).trim(); 
		} 
	} 
	return contentWithoutFrontmatter.slice(0, 150) + '...'; 
}

// Initialize an array to hold data for display.
let allRows = [];
for (let group of toPages) {
    for (let page of group.rows) {
        let pageSkipCount = page.skipCount || 0;
        let cardStyle
        // Determine the card style based on the skip count.
        if (pageSkipCount < 1) {
	        cardStyle = "good"
        } else if (pageSkipCount < 3) {
	        cardStyle = "okay"
	    } else if (pageSkipCount < 5) {
		    cardStyle = "bad"
	    } else {
			cardStyle = "terrible"
		}
    
        // Get the content of the file to be displayed on the card.
        let content = await getFileContent(page.file.path);
        // Push a structured object containing all relevant data for each page.
        allRows.push({cardStyle: cardStyle, link: page.file.link, skipCount: pageSkipCount, to: page.to, mtime: page.file.mtime, ctime: page.file.ctime, page: page, content: content});
    }
}

// Limit the display.
allRows = allRows.slice(0, numberOfDisplayedItems);

// Create a container for all queue cards.
const queueContainer = dv.el('div', '', { cls: 'q-container'})
allRows.forEach(row => {
    // Create individual cards for each row of data.
    const card = dv.el('div', '', { cls: `q-card q-card-status-${row.cardStyle}` });
    const link = dv.el('div', row.link, { cls: 'q-card-filename' });
    const to = dv.el('div', `${row.to}`, { cls: 'q-card-to' });

    card.appendChild(link);
    card.appendChild(to);

    // Display modification and creation times.
    const mtime = dv.el('div', `Last Modified: ${row.mtime}`, { cls: 'q-card-mtime' });
    const ctime = dv.el('div', `Created: ${row.ctime}`, { cls: 'q-card-mtime' });

    card.appendChild(mtime);
    card.appendChild(ctime);

    // Show a preview of the content.
    const content = dv.el('div', row.content, { cls: 'q-card-content' });
    card.appendChild(content);

    // Create a bottom row within the card for skip functionality.
	const bottomRow = dv.el('div', '', {cls: 'q-card-bottom-row'})
    const skipCount = dv.el('div', `Skips: ${row.skipCount}`, { cls: `q-card-skipCount-${row.skipCount}` });
    // Button to increment the skip count for an item.
    const button = dv.el('button', "Skip", { attr: { class: "q-skip-button" } });
    button.onclick = async () => {
        console.log(`Button clicked for ${row.page.file.path}`);
        await tp.user.skipQueuedItem(row.page.file.path);
    };

    bottomRow.appendChild(skipCount);
    bottomRow.appendChild(button);    
    card.appendChild(bottomRow);

    // Append the individual card to the main container.
    queueContainer.appendChild(card);
});

// Append the entire container to the Dataview component.
dv.container.appendChild(queueContainer);
```
