import React, { useEffect, useState } from 'react'
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

const FileExplorer = ({ directory, moveItem, setItemInfo, isEmpty, readDir, getParent, response }) => {
  const [draggedItem, setDraggedItem] = useState({});
  const [dropTarget, setDropTarget] = useState("");
  useEffect(() => {
    if (dropTarget) {
      moveItem(draggedItem.path, dropTarget)
      setDraggedItem({});
      setDropTarget("");
    }
  }, [dropTarget])

  return (
    <div className='flex flex-col bg-gray-700 mt-4 gap-3 w-2/3 mx-auto p-4 min-w-[400px] max-w-[60%] min-h-[45vh] max-h-[60vh] shadow-2xl'>
      {
        directory ?
          (
            <div
              className='bg-gray-600 flex flex-row items-center cursor-pointer p-1 pl-2 shadow-2xl select-none'
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
            directory.map((element, key) => (
              <div
                className='bg-gray-600 flex flex-row items-center cursor-pointer p-1 pl-2 shadow-2xl select-none'
                draggable
                onDragStart={(event) => { 
                  setDraggedItem(element);
                 }}
                onDragOver={(event) => {
                  event.preventDefault()
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (element.isDirectory) {
                    setDropTarget(element.path);
                  }
                }}
                key={key}
                onClick={() => {
                  if (element.isDirectory) {
                    readDir(false, element.path)
                  } else {
                    setItemInfo(element)
                  }
                }}
                onDoubleClick={() => {
                  window.open(`/editor/${encodeURIComponent(element.path)}`,'_blank', 'rel=noopener noreferrer')
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
                {/* <h1 className='text-lg text-wrap w-1/3'>{e.name.length > 18 ? `${e.name.slice(0, 18)}...` : e.name}</h1> */}
                <h1 className='text-lg text-left text-wrap break-words w-1/3'>{element.name}</h1>
                <h1 className='text-sm text-left pl-10 mx-auto text-gray-400 w-1/3'>{moment(element.dateModified).format("Do MMMM YYYY HH:MM")}</h1>
                <h1 className='text-base text-right text-gray-300 ml-auto mr-2 w-1/3'>{element.size}</h1>
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