import React, { useRef, useState } from "react";
import styles from "./MovieNewsModal.module.scss";
import { MdOutlineImage } from "react-icons/md";
import axiosInstance from "../../services/axiosInstance";
import { uploadToS3 } from "../../utils/s3Upload";

function MovieNewsModal({ isOpen, onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    // const [previewUrl, setPreviewUrl] = useState(""); //For showing preview
    // const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        // if (file) {

        //     // const allowedTypes = ["image/jpeg", "im"]
        //     console.log("Selected file:", file); 
        //     setImageFile(file);    
        // }
        if(file) {
            try{
                const uploadedImageUrl  = await uploadToS3(file);
                setImageUrl(uploadedImageUrl); 
            } catch (error) {
                alert("Failed to upload image");
            } 
        }
    };

    const handleUpload = async () => {
        if (!title.trim()) {
            alert("Please enter a movie title");
            return;
        }
    
        if (!description.trim()) {
            alert("Please enter a description");
            return;
        }
    
        if (!imageUrl) {
            alert("Please upload an image");
            return;
        }

        // if (imageFile) {
        //     try {
        //         console.log("Uploading to S3:", imageFile);
        //         uploadedImageUrl = await uploadToS3(imageFile); // Upload to S3 and get URL
        //         console.log("Uploaded Image URL:", uploadedImageUrl);
        //         setImageUrl(uploadedImageUrl); 
        //     } catch (error) {
        //         console.error("Image upload failed:", error);
        //         alert("Image upload failed");
        //         return;
        //     }
        // }
    
        // const formData = new FormData();
        // formData.append("title", title);
        // formData.append("description", description);
        // formData.append("image", imageFile);
    
        // console.log("Uploading data:", { title, description, imageFile });
        // console.log("Trimmed Description:", description.trim());
    
        try {
            const response = await axiosInstance.post("/movienews/addmovienews", {
                // headers: { "Content-Type": "multipart/form-data" },
                title: title,
                description: description,
                imageUrl,
            });
    
            if (response.status === 201) {
                alert("Movie News added successfully!");
                onClose();
                setTitle("");
                setDescription("");
                setImageFile(null);
                setImageUrl("");
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error adding movie news:", error.response?.data || error);
            alert("Failed to add movie news: " + (error.response?.data?.message || "Unknown error"));
        }
    };
        
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.closeButton}>✖</button>
                <h2>Add Movie News</h2>

                <label>Title</label>
                <div className={styles.inputContainer}>
                    
                    <input 
                        type="text"
                        placeholder="Enter movie title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.inputField}
                    />
                </div>
                
                <label>Description</label>
                <div className={styles.textarea}>
                    <textarea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        // className={styles.textAreaField}
                    />
                </div>
 
                <label>Thumbnail Image</label>
                <div className={styles.inputContainer}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                    <input
                        type="text"
                        placeholder="Select Image"
                        value={imageUrl}
                        onChange={() => {
                            setImageFile(null); 
                        }}
                        //disabled={imageFile !== null} 
                            // className={styles.inputField}
                    />
                    <MdOutlineImage className={styles.icon} onClick={handleIconClick} />
                        {/* <button onClick={() => fileInputRef.current.click()} className={styles.uploadButton}>
                            Upload Image
                        </button> */}
                    
                </div>

                <div className={styles.modalActions}>
                    <button onClick={handleUpload} className={styles.add}>Upload News</button>
                </div>
            </div>
        </div>
    );
}

export default MovieNewsModal;
