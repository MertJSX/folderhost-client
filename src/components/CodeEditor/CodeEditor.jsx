import Editor from '@monaco-editor/react';
import { useState } from 'react';


const CodeEditor = ({ editorLanguage, handleEditorChange, setEditorLanguage, fileContent, response, saveFile, title }) => {

  const [editorFontSize, setEditorFontSize] = useState(18);

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
          onChange={(e) => {setEditorFontSize(e.target.value)}} />
          <h1 className='text-lg italic'>Mode:</h1>
          <select
            className='bg-slate-600 font-bold text-lg px-5'
            value={editorLanguage}
            onChange={(e) => {
              console.log(e.target.value);
              setEditorLanguage(e.target.value)
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
          <button
            className='px-6 border-2 bg-emerald-700 border-emerald-500 rounded-lg'
            onClick={() => {
              saveFile()
            }}
          >
            Save file
          </button>
          <h1 className='text-amber-200 text-xl'>{response}</h1>
        </div>
        <Editor
          className='mx-auto'
          width="90vw"
          height="90vh"
          theme="vs-dark"
          options={
            { 
              fontSize: editorFontSize,
              tabCompletion: "on",
              smoothScrolling: true,
              cursorSmoothCaretAnimation: "on",
              unicodeHighlight: {
                ambiguousCharacters: true,
                includeComments: true,
                includeStrings: true,
                invincibleCharacters: true
              }
            }
          }
          language={editorLanguage}
          value={fileContent}
          onChange={handleEditorChange}
        />
      </div>

    </div>
  )
}

export default CodeEditor