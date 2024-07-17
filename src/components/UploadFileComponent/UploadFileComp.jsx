import React from 'react'

const UploadFileComp = ({ setFile, uploadFile, response, error, uploadProgress }) => {
    return (
        <div className='flex flex-col w-1/2 mx-auto mt-40 gap-2 p-5 bg-gray-700'>
            <h1 className="text-center text-4xl font-extrabold text-violet-300">
                UPLOAD
            </h1>
            <input
                type="file"
                onChange={(e) => {
                    setFile(e.target.files[0])
                }}
            />
            {!uploadProgress ?
                <button
                    className='text-center bg-violet-500 text-xl font-bold'
                    onClick={() => {
                        uploadFile()
                    }}
                >Upload</button> :
                <div>
                    <h1 className="text-center">{uploadProgress === 100 ? "Uploaded" : "Uploading..."}</h1>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }} />
                    </div>
                </div>
            }
            {response ?
                <h1 className='text-center text-emerald-300'>
                    {response}
                </h1> : error ?
                    <h1 className='text-center text-red-300'>
                        {error}
                    </h1>
                    : null}
        </div>
    )
}

export default UploadFileComp