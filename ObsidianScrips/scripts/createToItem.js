function createToItem(inputData, fileName, tags) {
    const tagsString = tags.map(tag => `  - ${tag}`).join('\n');
    const newNote = `---
created: ${new Date().toISOString()}
aliases:
  - ${fileName}
tags:
${tagsString}

---

- [ ] ${inputData.item}

---

[to:: ${inputData.to}]

`

    return newNote;
}


module.exports = createToItem;
