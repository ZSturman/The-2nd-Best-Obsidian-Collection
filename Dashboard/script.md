``` dataviewjs
const homePageDir = dv.current().file.folder;

// Function to get subdirectories of a given directory
async function getSubdirectories(dir) {
    // Retrieve subdirectories
    const files = await app.vault.adapter.list(dir);
    // Return the subdirectories
    return files.folders;
}

// Function to get files in a given directory
async function getFiles(dir) {
    // Retrieve files
    const files = await app.vault.adapter.list(dir);
    // Return the files
    return files.files;
}

// Function to find 'rows' or 'cols' directories in a list of directories
async function findRowsOrCols(dirs) {
    // Filter to find directories ending with 'rows' or 'cols'
    const rowOrColDir = dirs.filter(subDir => subDir.endsWith('/rows') || subDir.endsWith('/cols'));
    // Ensure only one 'rows' or 'cols' directory exists
    if (rowOrColDir.length > 1) {
        const error = "Please make sure each directory has only one 'rows' or 'cols' folder in it";
        const errorDiv = dv.paragraph(error);
        dashboard.appendChild(errorDiv);
        throw new Error(error);
    }
    // Return the found 'rows' or 'cols' directory
    return rowOrColDir[0];
}

// Function to find numbered subdirectories
async function findNumbered(dir) {
    // Get subdirectories
    const subDirs = await getSubdirectories(dir);
    // Filter subdirectories that are numbered
    const numberedDirs = subDirs.filter(subDir => !isNaN(subDir.split('/').pop()));
    // Sort the numbered directories
    return numberedDirs.sort((a, b) => {
        const numA = parseInt(a.split('/').pop(), 10);
        const numB = parseInt(b.split('/').pop(), 10);
        return numA - numB;
    });
}

// Function to process and check numbered folders
async function checkAndProcessNumberedFolders(numberedDirs, divElement) {
    for (const dir of numberedDirs) {
        // Get subdirectories
        const subDirs = await getSubdirectories(dir);

        // Create a displayed item element
        const displayedItem = dv.el("div", "", { cls: "item" });
        divElement.appendChild(displayedItem);
        
        let rowOrColDir = null;
        if (subDirs.length > 0) {
            // Find 'rows' or 'cols' directory if exists
            rowOrColDir = await findRowsOrCols(subDirs);
        }
        
        // Get files in the directory
        const files = await getFiles(dir);
        
        if (rowOrColDir) {
            // Create an element for the 'rows' or 'cols' directory
            const className = rowOrColDir.split('/').pop();
            const rowOrColDiv = dv.el("div", "", { cls: className });
            displayedItem.appendChild(rowOrColDiv);
            // Process subdirectories of the 'rows' or 'cols' directory
            const sortedNumberedDirs = await findNumbered(rowOrColDir);
            await checkAndProcessNumberedFolders(sortedNumberedDirs, rowOrColDiv);
        } else {
            // Embed files in the directory
            for (const file of files) {
                const embeddedLink = "![[" + file + "]]";
                const embeddedElement = dv.el("div", embeddedLink, { cls: "item" });
                displayedItem.appendChild(embeddedElement);
            }
        }
    }
}

// Function to process directories and build the dashboard
async function processDirectories(dir, dashboard) {
    // Get subdirectories
    const subDirs = await getSubdirectories(dir);
    // Find the 'rows' or 'cols' directory
    const rowOrColDir = await findRowsOrCols(subDirs);
    const className = rowOrColDir.split('/').pop();
    const rowOrColDiv = dv.el("div", "", { cls: className });
    // Process numbered subdirectories
    const sortedNumberedDirs = await findNumbered(rowOrColDir);
    await checkAndProcessNumberedFolders(sortedNumberedDirs, rowOrColDiv);
    // Append processed directories to the dashboard
    dashboard.appendChild(rowOrColDiv);
}

// Create the dashboard element and start processing directories
const dashboard = dv.el("div", "", { cls: "dashboard-container" });
processDirectories(homePageDir, dashboard).then(() => {
    // Append the dashboard to the container upon completion
    dv.container.appendChild(dashboard);
}).catch((error) => {
    // Handle errors during processing
    console.error("Error during processing:", error);
});
```