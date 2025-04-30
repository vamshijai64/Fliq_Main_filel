import axiosInstance from '../../../services/axiosInstance';
import { uploadToS3 } from '../../../utils/s3Upload';
import styles from './MovieTitleModal.module.scss';
import { useRef, useState } from "react";
import { MdOutlineImage } from "react-icons/md";

function MovieTitleModal({isOpen, onClose, sectionId, onTitleAdded}){
    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setImageFile(file);
    //         // setImageUrl(""); 
    //     }
    // };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const uploadedUrl = await uploadToS3(file);
            setImageUrl(uploadedUrl);
          } catch (error) {
            alert("Failed to upload image");
          } 
        }
    };

    const handleUpload = async () => {
        if(!title.trim()) {
            alert("Please enter movie title");
            return;
        }

        if(!imageUrl) {
            alert("Please upload image");
            return;
        }
        console.log("section ID: ",sectionId);
        let uploadedImageUrl = "";
        
        // if (imageFile) {
        //     try {
        //             console.log("Uploading to S3:", imageFile);
        //             uploadedImageUrl = await uploadToS3(imageFile); // Upload to S3 and get URL
        //             console.log("Uploaded Image URL:", uploadedImageUrl);
        //             setImageUrl(uploadedImageUrl); 
        //         } catch (error) {
        //             console.error("Image upload failed:", error);
        //             alert("Image upload failed");
        //             return;
        //         }
        //     }
        
        // const formData = new FormData();
        // formData.append("title", title);
        // formData.append("imageUrl", imageFile);

        try{
            const response = await axiosInstance.post(`/title/addTitle/${sectionId}`,  {
                // headers: {"Content-Type": "multipart/form-data"},
                title: title,
                imageUrl: imageUrl,
            });

            if(response.status === 200) {
                alert("Movie title for reviews added successfully");
                // onReviewAdded();
                onClose();
                setTitle("");
                setImageFile(null);
                setImageUrl("");
                fileInputRef.current.value = "";
                onTitleAdded();
            }
        } catch (error) {
            console.error("Error Details:", error);
            if (error.response) {
                if (error.response.status === 500) {
                    alert("Movie Title already exists! Please choose a different name.");
                } else {
                    alert(error.response.data.message || "Failed to add Movie Title!");
                }
            } else {
                alert("Network error! Please try again.");
            }
        }
    }


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.cancel}>X</button>
                <label>Movie Title</label>
                <div className={styles.inputContainer}>
                    <input 
                        type="text"
                        placeholder="Enter Movie title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
        
                <label>Movie title Thumbnail Image</label>
                <div className={styles.inputContainer}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                    <input
                        type="text"
                        placeholder="Select Image"
                        value={imageUrl}
                        onChange={() => setImageFile(null)}
                        disabled={imageFile !== null} 
                    />
                    <MdOutlineImage className={styles.icon} onClick={handleIconClick} />
                </div>

                <div className={styles.modalActions}>
                    <button onClick={handleUpload} className={styles.add}>Upload Movie Title</button>
                </div>
            </div>
        </div>
    )
}

export default MovieTitleModal;