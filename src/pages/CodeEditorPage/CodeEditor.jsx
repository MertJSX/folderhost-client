import React from 'react'
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

const CodeEditorPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [editorLanguage, setEditorLanguage] = useState("plaintext");
    const [fileContent, setFileContent] = useState("")
    const path = params.path;
    const [res, setRes] = useState("")
    const [lastModified, setLastModified] = useState("")
    const [readOnly, setReadOnly] = useState(false);
    const [fileTitle, setFileTitle] = useState("")
    const [autoupdate, setAutoupdate] = useState(true);
    const socket = useRef();

    function handleEditorChange(value, event) {
        // event.preventDefault();
        console.log("Editor change");
        console.log(event);
        let fileContentMem = fileContent;

        // setReadOnly(!readOnly);
        // setReadOnly(!readOnly);
        // setFileContent("");
        // setFileContent(fileContentMem)
        
        
        // setTimeout(() => {
        //     setFileContent(fileContent);
        // }, 1000);
        
        socket.current.emit("change-file", {path: path.slice(1), content: value})
    }
    function saveFile() {
        console.log(fileContent);
        axios.post(`${Cookies.get("ip")}/api/write-file?password=${Cookies.get("password")}&path=${path.slice(1)}&type=change`, {
            content: fileContent
        }).then((data) => {
            console.log("Last modified is setting to ", data.data);
            console.log(moment(data.data.lastModified).format("Do MMMM YYYY HH:mm:ss"));
            setLastModified(data.data.lastModified);
            setRes(data.data.response)
            setTimeout(() => {
                setRes("");
            }, 1500);
        })
    }
    function readFile(isUpdate = false) {
        axios.get(`${Cookies.get("ip")}/api/read-file?password=${Cookies.get("password")}&filepath=${path.slice(1)}`).then((data) => {
            console.log(data.data);
            if (data.data.res) {
                if (isUpdate) {
                    // setFileContent(data.data.data);
                    console.log("Only sex");
                    
                    console.log(data.data);
                    socket.current.emit("change-file", {path: path.slice(1), content: data.data.data})
                    setLastModified(data.data.lastModified)
                    setRes("Updated!")
                    setReadOnly(!data.data.writePermission)
                    setTimeout(() => {
                        setRes("")
                    }, 1000);
                } else {
                    console.log("Sexy");
                    
                    setFileTitle(data.data.title);
                    setFileContent(data.data.data);
                    setLastModified(data.data.lastModified);
                    setReadOnly(!data.data.writePermission);
                    setEditorLanguage(detectFileLanguage());
                }
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
    // useEffect(() => {
    //     if (socket.current && fileContent !== undefined) {
    //         console.log("Change file emit");
    //         console.log("file content is",fileContent);
            
            
    //         socket.current.emit("change-file", {path: path.slice(1), content: fileContent})
    //     }
    // }, [fileContent])
    useEffect(() => {
        if (socket.current) {
            console.log("Socket was updated now");
            socket.current.on('file-changed', (res) => {
                console.log(res);
                console.log("File changed");
                console.log(socket.current.id);
                
                // let first = moment(lastModified).format("Do MMMM YYYY HH:mm:ss")
                // let second = moment(res.lastModified).format("Do MMMM YYYY HH:mm:ss")
                // console.log(`${first} !== ${second}`);
                if (res.path === path.slice(1)) {
                    setFileContent(res.fileContent)
                }
            });
        }
        if (!socket.current) {
            socket.current = io(Cookies.get("ip"), { auth: { password: Cookies.get("password"), watch: path.slice(1) } });
            socket.current.on('connect_error', (err) => {
                console.log("Socket connect error");
                setTimeout(() => {
                    setRes(`Socket: ${err.message}`)
                    setTimeout(() => {
                        setRes("")
                    }, 5000);
                }, 3000);
            })
            socket.current.on('connect', () => {
                let currentModified = lastModified;
                console.log('Connected to the server');

                socket.current.on('file-changed', (res) => {
                    console.log(res);
                    console.log("File changed");
                    console.log(socket.current.id);
                    
                    let first = moment(currentModified).format("Do MMMM YYYY HH:mm:ss")
                    let second = moment(res.lastModified).format("Do MMMM YYYY HH:mm:ss")
                    console.log(`${first} !== ${second}`);
                    if (res.path === path.slice(1) && res.lastModified !== currentModified) {
                        if (autoupdate) {
                            console.log(res);
                            setFileContent(res.fileContent)
                            // readFile(true);
                        } else {
                            setRes("Outdated client!");
                            console.log(res);
                        }
                    }
                });

                socket.current.on('error', (res) => {
                    console.log(res);
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
    }, [lastModified])

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
                readOnly={readOnly}
            />
        </div>
    )
}

export default CodeEditorPage