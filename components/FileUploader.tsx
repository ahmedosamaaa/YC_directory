"use client";
import { useState } from "react";

// Define the types for the props
interface FileUploaderProps {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    imageUrl: string | null;
    setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    handleFileChange,
    selectedFile,
    setSelectedFile,
    imageUrl,
    setImageUrl,
}) => {
    const [fileEnter, setFileEnter] = useState(false);

    const handleReset = () => {
        setSelectedFile(null);
        setImageUrl(null);
    };

    return (
        <>
            {!selectedFile ? (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setFileEnter(true);
                    }}
                    onDragLeave={() => {
                        setFileEnter(false);
                    }}
                    onDragEnd={(e) => {
                        e.preventDefault();
                        setFileEnter(false);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setFileEnter(false);
                        if (e.dataTransfer.items) {
                            [...e.dataTransfer.items].forEach((item) => {
                                if (item.kind === "file") {
                                    const file = item.getAsFile();
                                    if (file) {
                                        const blobUrl =
                                            URL.createObjectURL(file);

                                        setSelectedFile(file);
                                        setImageUrl(blobUrl);
                                    }
                                }
                            });
                        } else {
                            [...e.dataTransfer.files].forEach((file, i) => {
                                console.log(`… file[${i}].name = ${file.name}`);
                            });
                        }
                    }}
                    className={`${
                        fileEnter ? "border-4 border-primary" : "border-2"
                    } mx-auto  bg-white flex flex-col w-full h-72 border-dashed items-center justify-center relative border-2 border-gray-300  rounded-lg p-6 `}
                >
                    <div className="text-center w-full">
                        <img
                            className="mx-auto h-12 w-12"
                            src="https://www.svgrepo.com/show/357902/image-upload.svg"
                            alt=""
                        />

                        <h3 className="relative mt-5 text-sm font-medium text-gray-900">
                            <label htmlFor="file-upload" className="relative">
                                <span>Drag and drop </span>
                                <span className="text-indigo-600  ">
                                    or browse
                                </span>
                                <span> to upload</span>
                                <input
                                    id="file"
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, JPEG or WebP up to 5MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    {imageUrl && (
                        <object
                            className="mt-4 mx-auto max-h-40 w-full object-contain"
                            data={imageUrl}
                            type="image/png" // Update based on file type if needed
                        />
                    )}
                    <button
                        onClick={() => handleReset()}
                        className="px-4 mt-10 uppercase py-2 tracking-widest outline-none bg-primary text-white rounded"
                    >
                        Reset
                    </button>
                </div>
            )}
        </>
    );
};
