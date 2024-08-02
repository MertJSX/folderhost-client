export const htmlSnippets = (monaco) => {
    return [
        {
            label: 'html:5',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>\${1:Document}</title>\n</head>\n<body>\n\t$0\n</body>\n</html>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Basic HTML5 template'
        },
        {
            label: 'link:css',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<link rel="stylesheet" href="\${1:styles.css}">`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Link to CSS file'
        },
        {
            label: 'link:favicon',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<link rel="icon" href="\${1:/favicon.ico}">`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Link to favicon'
        },
        {
            label: 'h1',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<h1>\$1</h1>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'h1 tag'
        },
        {
            label: 'h2',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<h2>\$1</h2>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'h2 tag'
        },
        {
            label: 'h3',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<h3>\$1</h3>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'h3 tag'
        },
        {
            label: 'h4',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<h4>\$1</h4>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'h4 tag'
        },
        {
            label: 'h5',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<h5>\$1</h5>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'h5 tag'
        },
        {
            label: 'h6',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<h6>\$1</h6>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'h6 tag'
        },
        {
            label: 'p',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<p>\$1</p>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'a tag'
        },
        {
            label: 'a',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<a href="\${1:link}">text</a>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'a tag'
        },
        {
            label: 'hr',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<hr>\$1`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'a tag'
        },
        {
            label: 'script',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: `<script>\$1</script>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'a tag'
        },
    ];
}
