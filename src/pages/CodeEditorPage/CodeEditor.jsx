import React from 'react'
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

const CodeEditorPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [editorLanguage, setEditorLanguage] = useState("plaintext");
    const [fileContent, setFileContent] = useState("")
    const path = params.path;
    const [res, setRes] = useState("")
    const [readOnly, setReadOnly] = useState(false);
    const [fileTitle, setFileTitle] = useState("")
    const socket = useRef();

    function handleEditorChange(value, event) {
        console.log("Editor change");
        console.log(event);

        socket.current.emit("change-file", { path: path.slice(1), content: value })
    }
    function readFile() {
        axios.post(`${Cookies.get("ip")}/api/read-file?filepath=${path.slice(1)}`,
            { username: Cookies.get("username"), password: Cookies.get("password") }).then((data) => {
                console.log(data.data);
                if (data.data.res) {
                    setFileTitle(data.data.title);
                    setFileContent(data.data.data);
                    setReadOnly(!data.data.writePermission);
                    setEditorLanguage(detectFileLanguage());
                }
            })
    }
    function detectFileLanguage() {
        const extensionToLanguageMap = {
            "yml": "yaml",
            "yaml": "yaml",
            "js": "javascript",
            "json": "json",
            "ts": "typescript",
            "html": "html",
            "css": "css",
            "php": "php",
            "sh": "shell",
            "bat": "bat",
            "java": "java",
            "kt": "kotlin",
            "py": "python",
            "cs": "csharp",
            "c": "c",
            "cpp": "cpp",
            "sql": "sql",
            "xml": "xml"
        };

        let fileExtension = path.substring(path.lastIndexOf('.') + 1);
        return extensionToLanguageMap[fileExtension] || "plaintext";
    }
    useEffect(() => {
        if (Cookies.get("ip") && Cookies.get("password")) {
            readFile(false)
        } else {
            navigate("/login");
        }
    }, [])

    useEffect(() => {
        if (!socket.current) {
            socket.current = io(Cookies.get("ip"), { auth: { username: Cookies.get("username"), password: Cookies.get("password"), watch: path.slice(1) } });
            socket.current.on('connect_error', (err) => {
                console.error("Socket connect error");
                setTimeout(() => {
                    setRes(`Socket: ${err.message}`)
                    setTimeout(() => {
                        setRes("")
                    }, 5000);
                }, 3000);
            })
            socket.current.on('connect', () => {
                console.log('Connected to the server');
                socket.current.on('file-changed', (res) => {
                    if (res.path === path.slice(1)) {
                        setFileContent(res.fileContent)
                    }
                });
                socket.current.on('error', (res) => {
                    console.error(res);
                    setRes(res.err)
                    setTimeout(() => {
                        setRes("")
                    }, 5000);
                });
                socket.current.on('disconnect', (reason) => {
                    console.log(`Disconnected from the server: ${reason}`);
                    socket.current = null;
                });
            });
        }

        return () => {
            if (socket.current) {
                socket.current.off('connect');
                socket.current.off('file-changed');
                socket.current.off('disconnect');
                socket.current.off('error');
                socket.current.off('connect_error');
            }
        };
    }, [])

    return (
        <div>

            <CodeEditor
                handleEditorChange={handleEditorChange}
                editorLanguage={editorLanguage}
                setEditorLanguage={setEditorLanguage}
                fileContent={fileContent}
                response={res}
                title={fileTitle}
                readOnly={readOnly}
            />
        </div>
    )
}

export default CodeEditorPage