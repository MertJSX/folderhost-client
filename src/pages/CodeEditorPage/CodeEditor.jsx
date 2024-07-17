import React from 'react'
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';

const CodeEditorPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [editorLanguage, setEditorLanguage] = useState("plaintext");
    const [fileContent, setFileContent] = useState("")
    const [path, setPath] = useState(params.path);
    const [res, setRes] = useState("")
    const [fileTitle, setFileTitle] = useState("")
    function handleEditorChange(value, event) {
        setFileContent(value)
    }
    function saveFile() {
        console.log(fileContent);
        axios.post(`${Cookies.get("ip")}/write-file?password=${Cookies.get("password")}&path=${path.slice(1)}&type=change`, {
            content: fileContent
        }).then((data) => {
            setRes(data.data.response)
            setTimeout(() => {
                setRes("");
            }, 1500);
        })
    }
    function detectFileLanguage() {
        let fileExtension = path.substring(path.lastIndexOf('.') + 1);

        console.log(fileExtension);

        if (fileExtension === "yml" || fileExtension === "yaml") {
            return "yaml";
        } else if (fileExtension === "js") {
            return "javascript"
        } else if (fileExtension === "json") {
            return "json"
        } else if (fileExtension === "ts") {
            return "typescript"
        } else if (fileExtension === "html") {
            return "html"
        } else if (fileExtension === "css") {
            return "css"
        } else if (fileExtension === "php") {
            return "php"
        } else if (fileExtension === "sh") {
            return "shell"
        } else if (fileExtension === "bat") {
            return "bat"
        } else if (fileExtension === "java") {
            return "java"
        } else if (fileExtension === "kt") {
            return "kotlin"
        } else if (fileExtension === "py") {
            return "python"
        } else if (fileExtension === "cs") {
            return "csharp"
        } else if (fileExtension === "c") {
            return "c"
        } else if (fileExtension === "cpp") {
            return "cpp"
        } else if (fileExtension === "sql") {
            return "sql"
        } else if (fileExtension === "xml") {
            return "xml"
        } else {
            return "plaintext"
        }
    }
    useEffect(() => {
        if (Cookies.get("ip") && Cookies.get("password")) {
            axios.get(`${Cookies.get("ip")}/read-file?password=${Cookies.get("password")}&filepath=${path.slice(1)}`).then((data) => {
                console.log(data.data);
                if (data.data.res) {
                    setFileContent(data.data.data);
                    setEditorLanguage(detectFileLanguage());
                    setFileTitle(data.data.title);
                }
            })
        } else {
            navigate("/login");
        }
    }, [])
    return (
        <div>

            <CodeEditor
                handleEditorChange={handleEditorChange}
                editorLanguage={editorLanguage}
                setEditorLanguage={setEditorLanguage}
                fileContent={fileContent}
                response={res}
                saveFile={saveFile}
                title={fileTitle}
            />
        </div>
    )
}

export default CodeEditorPage