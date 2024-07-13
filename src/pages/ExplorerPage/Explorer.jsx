import React from 'react'
import Header from '../../components/Header/Header';
import FileExplorer from '../../components/FileExplorer/FileExplorer';
import Options from '../../components/Options/Options';
import ItemInfo from '../../components/DirItemInfo/ItemInfo';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from "axios";
import fileDownload from 'js-file-download';
import { useParams, useNavigate } from 'react-router-dom';

const ExplorerPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [path, setPath] = useState(params.path);
  const [directory, setDir] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [itemInfo, setItemInfo] = useState({});
  const [response, setRes] = useState("");
  const [error, setError] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);

  function getParent(filePath) {
    console.log(filePath);
    let lastIndex = filePath.lastIndexOf('/');
    if (lastIndex === -1) return filePath;

    let item = filePath.slice(0, lastIndex);

    if (item.length > 1) {
      return item;
    } else {
      return filePath.slice(0, lastIndex + 1);
    }
  }

  useEffect(() => {
    navigate(`/explorer/${encodeURIComponent(path)}`, { replace: true });
  }, [path])

  useEffect(() => {
    console.log(getParent(path));
    if (Cookies.get("ip") && Cookies.get("password")) {
      readDir()
    } else {
      navigate("/login")
    }
  }, [])

  function moveItem(oldPath, newPath) {
    console.log("Old and newPath");
    console.log(oldPath);
    console.log(newPath);
    axios.get(`${Cookies.get("ip")}/rename-file?password=${Cookies.get("password")}&oldFilepath=${oldPath.slice(1)}&newFilepath=${newPath.slice(1)}&type=move`)
      .then((data) => {
        console.log(data);
        readDir();
      })
  }

  function renameItem(item, newName) {
    let oldPath = item.path.slice(1);
    let newPath = `${getParent(item.path.slice(0, -1))}/${newName}`;
    axios.get(`${Cookies.get("ip")}/rename-file?password=${Cookies.get("password")}&oldFilepath=${oldPath}&newFilepath=${newPath.slice(1)}&type=rename`)
      .then((data) => {
        console.log(data);
        if (item.isDirectory) {
          readDir(false, newPath);
        } else {
          readDir()
        }
      })
  }

  function downloadFile(filepath) {
    axios.get(`${Cookies.get("ip")}/download?password=${Cookies.get("password")}&filepath=${filepath.slice(1)}`, {
      responseType: "blob",
      onDownloadProgress: (
        progressEvent) => {
        if (progressEvent.progress === 1) {
          return;
        }
        let progress = progressEvent.progress.toString();
        progress = progress.split('.')[1]; // Noktadan sonraki kısmı al
        progress = progress.substring(0, 2);
        setDownloadProgress(Number(progress));
      }
    }).then((data) => {
      console.log(data);
      setTimeout(() => {
        setDownloadProgress(100);
      }, 1000);
      setTimeout(() => {
        setDownloadProgress(0);
      }, 5000);
      fileDownload(data.data, itemInfo.name)
    })
  }

  function deleteItem(filepath) {
    axios.get(`${Cookies.get("ip")}/delete?password=${Cookies.get("password")}&path=${filepath.slice(1)}`).then((data) => {
      console.log(data);
      if (data.data.response) {
        setRes(data.data.response)
        setTimeout(() => {
          setRes("")
        }, 5000);
      }
      
      readDir()
    }).catch((err) => {
      console.error(err.response.data.err);
      if (err.response.data.err) {
        setError(err.response.data.err)
        setTimeout(() => {
          setError("")
        }, 5000);
      }
    })
  }

  function readDir(asParentPath, pathInput) {
    if (asParentPath && path !== "./") {
      setPath(getParent(path));
      setIsEmpty(false)
      setDir([]);
      axios.get(Cookies.get("ip") + `/read-dir?password=${Cookies.get("password")}&folder=${getParent(path).slice(1)}&mode=${Cookies.get("mode") || "Balanced mode"}`)
      .then((data) => {
        console.log(data);
        setIsEmpty(data.data.isEmpty)
        setDir(data.data.data)
        setItemInfo(data.data.directoryInfo)
      })
      return;
    } else if (pathInput === undefined && !asParentPath) {
      setDir([]);
      // if (path.slice(-1) !== "/") {
      //   setPath((prev) => prev + "/")
      // }
      setIsEmpty(false)
      axios.get(Cookies.get("ip") + `/read-dir?password=${Cookies.get("password")}&folder=${path.slice(1)}&mode=${Cookies.get("mode") || "Balanced mode"}`).then((data) => {
        console.log(data);
        if (!data.data.data) {
          setRes(data.data.err)
          return;
        }
        setIsEmpty(data.data.isEmpty);
        setDir(data.data.data)
        setItemInfo(data.data.directoryInfo)
      })
      return;
    } else if (pathInput) {
      setDir([]);
      setIsEmpty(false)
      axios.get(Cookies.get("ip") + `/read-dir?password=${Cookies.get("password")}&folder=${pathInput.slice(1)}&mode=${Cookies.get("mode") || "Balanced mode"}`).then((data) => {
        console.log(data);
        setPath(pathInput)
        setIsEmpty(data.data.isEmpty);
        setDir(data.data.data)
        setItemInfo(data.data.directoryInfo)
      })
    }


  }

  return (
    <div className='home-container'>
      <Header />
      <Options
        path={path}
        setPath={setPath}
        readDir={readDir}
        error={error}
        response={response}
      />
      <div className="flex flex-row w-full justify-center items-center flex-wrap">
        <FileExplorer
          directory={directory}
          setDir={setDir}
          setItemInfo={setItemInfo}
          isEmpty={isEmpty}
          readDir={readDir}
          path={path}
          response={response}
          moveItem={moveItem}
          getParent={getParent}
        />
        {
          Object.keys(itemInfo).length !== 0 ? (
            <ItemInfo
              itemInfo={itemInfo}
              setItemInfo={setItemInfo}
              renameItem={renameItem}
              downloadFile={downloadFile}
              downloadProgress={downloadProgress}
              deleteItem={deleteItem}
            />
          ) : null
        }
      </div>

    </div>
  )
}

export default ExplorerPage