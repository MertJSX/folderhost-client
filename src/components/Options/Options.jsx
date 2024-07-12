import React from 'react'
import { useNavigate } from 'react-router-dom'


const Options = (props) => {
    const navigate = useNavigate();
    return (
        <div className='flex bg-slate-800 flex-row justify-center w-full mt-14 gap-5 p-2'>
            <div className='flex w-full justify-center'>
                <input
                    type="text"
                    className='w-1/2 bg-slate-600 text-lg min-w-[300px] font-bold font-mono rounded-t-lg rounded-l-lg rounded-b-lg rounded-r-none rounded-tr-none px-2'
                    placeholder='Path'
                    value={props.path}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            navigate(`/explorer/${encodeURIComponent(props.path)}`, { replace: true });
                            props.readDir()
                        }
                        if (e.key === "Backspace" && props.path === "./") {
                            e.preventDefault()
                        }
                        if (e.key === "/" && props.path.slice(-1) === "/") {
                            e.preventDefault()
                        }
                    }}
                    onChange={(e) => {
                        props.setPath(e.target.value)
                    }}
                />
                <button
                    className="bg-sky-600 px-5 active:bg-sky-600 hover:bg-sky-700"
                    onClick={() => {
                        props.readDir()
                    }}
                >Search</button>
            </div>

        </div>
    )
}

export default Options