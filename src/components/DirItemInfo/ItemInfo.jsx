import React, { useRef } from 'react'
import moment from 'moment'
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

const ItemInfo = ({ itemInfo, setItemInfo, renameItem, downloadFile, downloadProgress, deleteItem }) => {
  const renameInput = useRef(null)
  const logoSize = 75;
  //const logoSize = "35vh"
  return (
    <div className='flex flex-col bg-gray-700 items-center mt-4 gap-3 w-1/3 mx-auto p-4 max-w-[30%] h-auto rounded-xl shadow-2xl'>
      {
        itemInfo.isDirectory ?
          <FaFolderOpen size={logoSize} className='mx-2' />
          : itemInfo.name.split(".").pop() === "png" ||
            itemInfo.name.split(".").pop() === "jpg" ||
            itemInfo.name.split(".").pop() === "jpeg" ?
            <FaFileImage size={logoSize} className='mx-2' />
            : itemInfo.name.split(".").pop() === "pdf" ?
              <FaFilePdf size={logoSize} className='mx-2' />
              : itemInfo.name.split(".").pop() === "rar" ||
                itemInfo.name.split(".").pop() === "zip" ?
                <FaFileArchive size={logoSize} className='mx-2' />
                : itemInfo.name.split(".").pop() === "html" ?
                  <FaHtml5 size={logoSize} className='mx-2' />
                  : itemInfo.name.split(".").pop() === "css" ?
                    <FaCss3 size={logoSize} className='mx-2' />
                    : itemInfo.name.split(".").pop() === "js" ?
                      <IoLogoJavascript size={logoSize} className='mx-2' /> :
                      <FaFileAlt size={logoSize} className='mx-2' />
      }
      {
        itemInfo.path === "./" ?
          <h1
            title='The base folder cannot be renamed!'
            className='bg-transparent text-xl text-amber-300 font-bold text-wrap break-all text-center'

          >
            {itemInfo.name}
          </h1> :
          <input
            type='text'
            ref={renameInput}
            value={itemInfo.name}
            title='Rename item'
            onChange={(e) => {
              setItemInfo((prev) => ({ ...prev, name: e.target.value }));
            }}
            onKeyDown={(e) => {
              if (e.key === "/" ||
                e.key === "\\" ||
                e.key === ":" ||
                e.key === "*" ||
                e.key === "?" ||
                e.key === "<" ||
                e.key === ">" ||
                e.key === "|"
              ) {
                e.preventDefault()
              }
              if (e.key === "Enter") {
                console.log("Rename request");
                renameItem(itemInfo, itemInfo.name)
                renameInput.current.blur();
              }
            }}
            className='bg-transparent text-xl text-amber-300 font-bold text-wrap break-all text-center'
          />
      }


      <h1 className='text-gray-400 text-center break-all text-wrap'>
        Path: <span className="text-amber-200">{itemInfo.path}</span>
      </h1>
      {
        itemInfo.size ? (
          <h1 className='text-gray-400'>Size:
            <span className='text-amber-200'>
              {
                (itemInfo.size === "N/A" && Cookies.get("mode") === "Quality mode") || itemInfo.size === "N/A" ?
                  "0 Bytes" : itemInfo.size
              }
            </span>
          </h1>
        ) : null
      }
      <h1 className='text-gray-400'>
        Created: <span className='text-gray-300'>{moment(itemInfo.birthDate).format("Do MMMM YYYY HH:mm")}</span>
      </h1>
      <h1 className='text-gray-400'>
        Modified: <span className='text-gray-300'>{moment(itemInfo.dateModified).format("Do MMMM YYYY HH:mm")}</span>
      </h1>
      {!itemInfo.isDirectory ? (
        <div className='flex flex-col gap-2 w-5/6'>
          <button
            className='bg-red-600 px-6 font-bold rounded-xl'
            title='Double click to delete.'
            onDoubleClick={() => {
              deleteItem(itemInfo.path)
            }}
          >Delete file</button>

          {!downloadProgress ?
            <button
              className='bg-emerald-600 px-6 font-bold rounded-xl'
              title='Double click to upload.'
              onClick={() => {
                downloadFile(itemInfo.path)
              }}
            >Download</button>
            :
            <div>
              <h1 className="text-center">{downloadProgress === 100 ? "Downloaded" : "Downloading..."}</h1>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${downloadProgress}%` }} />
              </div>
            </div>

          }
          <a
            href={`/editor/${encodeURIComponent(itemInfo.path)}`}
            target="_blank"
            className='bg-sky-700 px-6 font-bold text-center rounded-xl'
          >Open Editor</a>
        </div>

      ) :
        <div className="flex flex-col gap-2 w-5/6">
          {
            itemInfo.path !== "./" ?
              <button
                className='bg-red-600 px-6 font-bold rounded-xl'
                title='Double click to delete.'
                onDoubleClick={() => {
                  deleteItem(itemInfo.path)
                }}
              >Delete directory</button> :
              null
          }

          <button
            className='bg-purple-600 px-6 font-bold rounded-xl'
            title='Double click to upload.'
          >Upload new file</button>
          <div className="flex flex-row">
            <input
              type="text"
              placeholder='folder name'
              className='bg-gray-600 w-2/3 text-center rounded-lg rounded-r-none'
            />
            <button className='bg-sky-700 rounded-r-lg w-1/3 hover:bg-sky-600'>Create</button>
          </div>
          <div className="flex flex-row">
            <input
              type="text"
              placeholder='file name'
              className='bg-gray-600 w-2/3 text-center rounded-lg rounded-r-none'
            />
            <button className='bg-sky-700 rounded-r-lg w-1/3 hover:bg-sky-600'>Create</button>
          </div>
        </div>
      }
    </div>
  )
}

export default ItemInfo