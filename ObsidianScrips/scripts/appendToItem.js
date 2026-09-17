function appendToItem(inputData, tags) {
    const tagsString = tags.map(tag => `  - ${tag}`).join('\n');
    const appendContent = `---

tags:
${tagsString}

---

- [ ] ${inputData.item}

`
    return appendContent;
}

module.exports = appendToItem