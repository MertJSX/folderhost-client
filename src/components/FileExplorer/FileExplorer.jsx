import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment';
import { FaFolder } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { FaFileImage } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileArchive } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { FaFolderOpen } from "react-icons/fa6";
import Cookies from 'js-cookie';

const FileExplorer = ({ directory, moveItem,itemInfo, setItemInfo, isEmpty, readDir, getParent, response }) => {
  const [draggedItem, setDraggedItem] = useState({});
  const [dropTarget, setDropTarget] = useState("");
  const childElements = useRef([]);
  const previousDirRef = useRef();
  const [selectedChildEl, setSelectedChildEl] = useState(null);

  useEffect(() => {
    if (dropTarget) {
      moveItem(draggedItem.path, dropTarget)
      setDraggedItem({});
      setDropTarget("");
    }
  }, [dropTarget])

  useEffect(() => {
    if (itemInfo.id || itemInfo.id === 0) {
      if (selectedChildEl !== null) {
        childElements.current[selectedChildEl].classList.remove("border-sky-400")
      }
      setSelectedChildEl(itemInfo.id);
    } else {
      console.log(childElements.current[0]);
      if (selectedChildEl !== null) {
        if (childElements.current[selectedChildEl].classList.contains("border-sky-400")) {
          childElements.current[selectedChildEl].classList.remove("border-sky-400")
        }
      }
      setSelectedChildEl(null)
    }
  }, [itemInfo])

  useEffect(() => {
    if (selectedChildEl !== null) {
      childElements.current[selectedChildEl].classList.add("border-sky-400")
    }
  }, [selectedChildEl])

  useEffect(() => {
    childElements.current = []
    setSelectedChildEl(null);
  }, [directory])

  function addToChildElements(e) {
    if (e && !childElements.current.includes(e)) {
      childElements.current.push(e);
    }

  }

  return (
    <div className='flex flex-col bg-gray-700 mt-4 gap-3 w-2/3 mx-auto p-4 min-w-[400px] max-w-[60%] min-h-[45vh] max-h-[60vh] shadow-2xl'>
      {
        directory ?
          (
            <div
              className='bg-gray-600 flex flex-row items-center cursor-pointer p-1 pl-2 shadow-2xl select-none'
              ref={previousDirRef}
              onDragOver={(event) => {
                event.preventDefault()
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedItem.isDirectory) {
                  let parentOfDir = draggedItem.parentPath;
                  parentOfDir = getParent(parentOfDir.slice(0, -1));
                  moveItem(draggedItem.path, parentOfDir)
                } else {
                  moveItem(draggedItem.path, getParent(getParent(draggedItem.path)))
                }
              }}
              onDragEnter={(event) => {
                if (event.relatedTarget && previousDirRef.current.contains(event.relatedTarget)) {
                  event.preventDefault()
                  return;
                }
                previousDirRef.current.classList.remove("border-gray-600")
                previousDirRef.current.classList.add("border-emerald-400")
              }}
              onDragLeave={(event) => {
                if (event.relatedTarget && previousDirRef.current.contains(event.relatedTarget)) {
                  event.preventDefault()
                  return
                }
                if (previousDirRef.current.classList.contains("border-emerald-400")) {
                  previousDirRef.current.classList.remove("border-emerald-400")
                  previousDirRef.current.classList.add("border-gray-600")
                }
                console.log("Leave event!");
              }}
              onClick={() => {
                readDir(true)
              }}
            >
              <FaFolder size={22} className='mx-2' />
              <IoMdArrowBack size={22} className='mx-2' />
              {/* <h1 className='text-lg'>{"<--"}</h1> */}
              <h1 className='text-base text-gray-300 ml-auto mr-2'>N/A</h1>
            </div>
          ) : isEmpty ?
            (
              <div className='bg-gray-600 flex flex-row items-center cursor-pointer p-1 pl-2 shadow-2xl select-none'
                onClick={() => {
                  readDir(true)
                }}
              >
                <FaFolder size={22} className='mx-2' />
                <IoMdArrowBack size={22} className='mx-2' />
                {/* <h1 className='text-lg'>{"<--"}</h1> */}
                <h1 className='text-base text-gray-300 ml-auto mr-2'>N/A</h1>
              </div>
            ) : null
      }
      <div className='flex flex-col gap-2 overflow-hidden overflow-y-scroll'>
        {
          directory[0] !== undefined ?
            directory.map((element) => (
              <div
                ref={addToChildElements}
                className='bg-gray-600 flex flex-row items-center cursor-pointer p-1 pl-2 shadow-2xl select-none border-2 border-gray-600'
                draggable
                onDragStart={() => {
                  setDraggedItem(element);
                }}
                onDrop={(event) => {
                  if (childElements.current[element.id].classList.contains("border-emerald-400")) {
                    childElements.current[element.id].classList.remove("border-emerald-400")
                    childElements.current[element.id].classList.add("border-gray-600")
                  }
                  if (draggedItem.path === element.path) {
                    setDraggedItem({});
                    return
                  }
                  console.log(event);
                  if (element.isDirectory) {
                    setDropTarget(element.path);
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault()
                }}
                onDragEnd={() => {
                  document.body.style.cursor = 'default'
                }}
                onDragEnter={(event) => {
                  if (event.relatedTarget && childElements.current[element.id].contains(event.relatedTarget)) {
                    event.preventDefault()
                    return;
                  }
                  if (element.isDirectory) {
                    childElements.current[element.id].classList.remove("border-gray-600")
                    childElements.current[element.id].classList.add("border-emerald-400")
                  }
                }}
                onDragLeave={(event) => {
                  if (event.relatedTarget && childElements.current[element.id].contains(event.relatedTarget)) {
                    event.preventDefault()
                    return
                  }
                  if (childElements.current[element.id].classList.contains("border-emerald-400")) {
                    childElements.current[element.id].classList.remove("border-emerald-400")
                    childElements.current[element.id].classList.add("border-gray-600")
                  }
                  console.log("Leave event!");
                }}
                key={element.id}
                onClick={() => {
                  // if (childElements.current[selectedChildEl].classList.contains("border-sky-400")) {
                  //   childElements.current[selectedChildEl].classList.remove("border-sky-400")
                  // }
                  // childElements.current[element.id].classList.add("border-sky-400")
                  // setSelectedChildEl(element.id);
                  setItemInfo(element);
                }}
                onDoubleClick={() => {
                  if (element.isDirectory) {
                    readDir(false, element.path)
                  } else {
                    window.open(`/editor/${encodeURIComponent(element.path)}`, '_blank', 'rel=noopener noreferrer')
                  }
                }}
              >
                {
                  element.isDirectory ?
                    <FaFolder size={22} className='mx-2' />
                    : element.name.split(".").pop() === "png" ||
                      element.name.split(".").pop() === "jpg" ||
                      element.name.split(".").pop() === "jpeg" ?
                      <FaFileImage size={22} className='mx-2' />
                      : element.name.split(".").pop() === "pdf" ?
                        <FaFilePdf size={22} className='mx-2' />
                        : element.name.split(".").pop() === "rar" ||
                          element.name.split(".").pop() === "zip" ?
                          <FaFileArchive size={22} className='mx-2' />
                          : element.name.split(".").pop() === "html" ?
                            <FaHtml5 size={22} className='mx-2' />
                            : element.name.split(".").pop() === "css" ?
                              <FaCss3 size={22} className='mx-2' />
                              : element.name.split(".").pop() === "js" ?
                                <IoLogoJavascript size={22} className='mx-2' /> :
                                <FaFileAlt size={22} className='mx-2' />
                }
                {/* <h1 className='text-lg text-wrap w-1/3'>{element.name.length > 18 ? `${element.name.slice(0, 19)} (...)` : element.name}</h1> */}
                <h1 className='text-lg text-left text-wrap break-words w-1/3'>{element.name}</h1>
                <h1 className='text-sm text-left pl-10 mx-auto text-gray-400 w-1/3'>{moment(element.dateModified).format("Do MMMM YYYY HH:mm")}</h1>
                {
                  element.isDirectory && Cookies.get("mode") === "Quality mode" ?
                    <h1 className='text-base text-right text-gray-300 ml-auto mr-2 w-1/3'>
                      {element.size === "N/A" && Cookies.get("mode") === "Quality mode" ? "0 Bytes" : element.size}
                    </h1> : !element.isDirectory ?
                      <h1 className='text-base text-right text-gray-300 ml-auto mr-2 w-1/3'>
                        {
                          (element.size === "N/A" && Cookies.get("mode") === "Quality mode") || element.size === "N/A" ?
                            "0 Bytes" : element.size
                        }
                      </h1> : <h1 className='text-base text-right text-gray-300 ml-auto mr-2 w-1/3'>

                      </h1>
                }

              </div>
            )) : isEmpty ? (
              <div className='flex flex-row items-center cursor-default p-1 pl-2 shadow-2xl select-none'>
                <FaFolderOpen size={22} className='mx-2' />
                <h1 className='text-lg'>Empty folder</h1>
              </div>
            ) : <h1 className='text-2xl'>{response ? <span className='text-amber-200'>{response}</span> : "Loading..."}</h1>
        }
      </div>

    </div>
  )
}

export default FileExplorer