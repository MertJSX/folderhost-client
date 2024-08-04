import Editor from '@monaco-editor/react';
import { useState, useRef, useEffect } from 'react';
import { htmlSnippets } from './snippets/htmlSnippets';
import { jsSnippets } from './snippets/jsSnippets';
import { yamlSnippets } from './snippets/yamlSnippets';
import theme from './themes/theme.json'

const CodeEditor = ({ editorLanguage, handleEditorChange, setEditorLanguage, fileContent, response, saveFile, title, readOnly }) => {
  const [editorFontSize, setEditorFontSize] = useState(18);
  const [minimap, setMinimap] = useState(true);
  const editorRef = useRef(null);


  const handleEditorDidMount = (editor, monaco) => {

    editorRef.current = editor;

    monaco.editor.defineTheme('vs-dark', theme);

    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: (model, position) => {
        let suggestions = htmlSnippets(monaco);
        const textBeforePosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const scriptOpen = /<script[^>]*>/gi;
        const scriptClose = /<\/script>/gi;

        let match;
        let lastOpenIndex = -1;
        let lastCloseIndex = -1;

        while ((match = scriptOpen.exec(textBeforePosition))) {
          lastOpenIndex = match.index;
        }

        while ((match = scriptClose.exec(textBeforePosition))) {
          lastCloseIndex = match.index;
        }

        const inScriptTag = lastOpenIndex > lastCloseIndex;

        if (inScriptTag) {
          return { suggestions: jsSnippets(monaco) };
        }

        return { suggestions: suggestions };
      }
    });
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: () => {
        let suggestions = jsSnippets(monaco)
        return { suggestions: suggestions };
      }
    });
    monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: () => {
        let suggestions = yamlSnippets(monaco)
        return { suggestions: suggestions };
      }
    });

    editor.onDidChangeModelContent((event) => {
      if (readOnly) {
        editor.setValue(event.changes[0].text)
        editor.updateOptions({ readOnly: readOnly })
      }
    })

    editor.addAction({
      id: 'save-file',
      label: 'Save File',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS // Ctrl+S or Cmd+S on macOS
      ],
      run: () => {
        // Handle Ctrl+S action
        console.log("Already saved!");

      }
    });
  };

  useEffect(() => {
    console.log("readonly changed", readOnly);
    console.log(editorRef);
    if (editorRef.current) {
      console.log("Must be updated");
      console.log(readOnly);
      const position = editorRef.current.getPosition();
      
      editorRef.current.getModel().setValue(fileContent);
      editorRef.current.setPosition(position);
      editorRef.current.updateOptions({ readOnly: readOnly })
    }

  }, [readOnly, fileContent])


  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex gap-1 p-2">
          <h1 className='text-lg italic px-5 text-gray-400'>Editing: <span className='text-emerald-300'>{title}</span></h1>
          <h1 className='text-lg italic'>Font size:</h1>
          <input
            className='bg-gray-600 text-center text-lg px-0 w-1/12'
            type="number"
            value={editorFontSize}
            onChange={(e) => { setEditorFontSize(parseInt(e.target.value, 10)) }} />
          <h1 className='text-lg italic'>Mode:</h1>
          <select
            className='bg-slate-600 font-bold text-lg px-5'
            value={minimap}
            onChange={(e) => {
              setEditorLanguage(e.target.value);
            }}
          >
            <option value="javascript">Javascript</option>
            <option value="typescript">Typescript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="php">PHP</option>
            <option value="yaml">YAML / YML</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="shell">Shell</option>
            <option value="bat">BAT</option>
            <option value="java">Java</option>
            <option value="kotlin">Kotlin</option>
            <option value="python">Python</option>
            <option value="csharp">C#</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
            <option value="mysql">MYSQL</option>
            <option value="plaintext">Plain text</option>
          </select>
          <h1 className='text-lg italic'>Minimap:</h1>
          <select
            className='bg-slate-600 font-bold text-lg px-5'
            value={minimap}
            onChange={(e) => {
              setMinimap(e.target.value);
            }}
          >
            <option value={true}>Enabled</option>
            <option value={false}>Disabled</option>
          </select>
          {/* <button
            className='px-6 border-2 bg-emerald-700 border-emerald-500 rounded-lg'
            onClick={() => {
              saveFile();
            }}
          >
            Save file
          </button> */}
          <h1 className='text-amber-200 text-xl'>{response}</h1>
        </div>
        <Editor
          className='mx-auto'
          width="90vw"
          height="90vh"
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            fontSize: editorFontSize,
            tabCompletion: "on",
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
            readOnly: readOnly,
            domReadOnly: readOnly,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            readOnlyMessage: true,
            minimap: {
              enabled: minimap,
              renderCharacters: false, // Karakterleri render etmeyi devre dışı bırakma
              maxColumn: 120 // Minimap'taki sütun sayısını sınırla
            },
            scrollBeyondLastLine: false,
            renderWhitespace: 'none',
            unicodeHighlight: {
              ambiguousCharacters: true,
              includeComments: true,
              includeStrings: true,
              invincibleCharacters: true,
              selectOnLineNumbers: true,
              autoClosingBrackets: 'always',
              // formatOnType: true,
              snippetSuggestions: 'inline',
              suggestOnTriggerCharacters: true,
              tabCompletion: 'on',
              wordBasedSuggestions: true
            }
          }}
          language={editorLanguage}
          value={fileContent}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
