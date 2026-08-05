export class Note {
    static nextId = 1;

    constructor(title, content, tags = []) {
        this.id = Note.nextId++;
        this.title = title;
        this.content = content;
        this.tags = [...new Set(tags.map((t) => t.toLowerCase().trim()))];
        this.createdAt = new Date().toISOString();
    }

    addTag(tag) {
        const tagSet = new Set(this.tags);
        tagSet.add(tag.toLowerCase().trim());
        this.tags = [...tagSet];
        return this;
    }

    summary() {
        return this.content.slice(0, 50);
    }

    toJSON() { // JSON.stringify will call toJSON() automatically if it exists
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            tags: this.tags,
            createdAt: this.createdAt,
            summary: this.summary(),
        };
    }
}

export class ChecklistNote extends Note {
    constructor(title, items = [], tags = []) {
        super(title, "", tags);
        this.items = items.map((item) => ({ text: item.text, done: !!item.done }));
    }

    addItem(text) {
        this.items.push({ text, done: false });
        return this;
    }

    summary() {
        const done = this.items.filter((i) => i.done).length;
        return `${done}/${this.items.length} items done`;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            items: this.items,
        }
    }
}
