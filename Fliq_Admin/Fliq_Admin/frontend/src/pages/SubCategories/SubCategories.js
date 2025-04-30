import { useRef, useState } from "react";
import styles from "./SubCategories.module.scss";
import { MdOutlineImage } from "react-icons/md";
import axiosInstance from "../../services/axiosInstance";
import { uploadToS3 } from "../../utils/s3Upload";

function SubCategories({ isOpen, onClose, categoryId }) {
    const [subcategoryName, setSubcategoryName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    // console.log("Image: ",imageFile);
    
    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const uploadedImageUrl = await uploadToS3(file);
                setImageUrl(uploadedImageUrl);
            } catch(error){
                alert("Failed to upload image");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryId) {
            alert("Category ID is missing!");
            return;
        }

        if(!subcategoryName.trim()) {
            alert("Subcategory name is required");
            return;
        }

        if (!imageUrl) {
            alert("Please select an image");
            return;
        }
        // let uploadedImageUrl = "";

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
        // // formData.append("name", subcategoryName);
        // formData.append("title", subcategoryName);

        // formData.append("category", categoryId);
        // if (imageFile) {
        //     formData.append("imageFile", imageFile); 
        // } else if (imageUrl.trim()) {
        //     formData.append("imageUrl", imageUrl.trim());
        // } else {
        //     alert("Please provide an image file or URL!");
        //     return;
        // }

        try {
            await axiosInstance.post("/subcategories/create", {
                // headers: {
                //     "Content-Type": "multipart/form-data",
                // },
                title: subcategoryName.trim(),
                imageUrl: imageUrl,
                category: categoryId,
            });

            alert("Subcategory added successfully!");
            setSubcategoryName("");
            setImageUrl("");
            setImageFile(null);
            fileInputRef.current.value = null;
            onClose();
        } catch (error) {
            console.error("Error adding subcategory:", error);

        if (error.response) {
            if (error.response.status === 500) {
                alert("Subcategory name already exists! Please choose a different name.");
            } else {
                alert(error.response.data.message || "Failed to add subcategory!");
            }
        } else {
            alert("Network error! Please try again.");
        }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.cancel}>X</button>
                <h2>Inserting Subcategory</h2>
                
                <label>Sub-Category Name</label>
                <div className={styles.inputContainer}>
                    <input 
                        type="text" 
                        placeholder="Enter subcategory name"
                        value={subcategoryName}
                        onChange={(e) => setSubcategoryName(e.target.value)}
                        required
                    />
                </div>

                <label>Sub-Category Thumbnail Image</label>
                <div className={styles.inputContainer}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                    <input
                        type="text"
                        placeholder="Enter Image URL or Select Image"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        //disabled={imageFile !== null} // Disable if file is selected
                    />
                    <MdOutlineImage className={styles.icon} onClick={handleIconClick} />
                </div>

                <div className={styles.modalActions}>
                    <button onClick={handleSubmit} className={styles.add}>Add Subcategory</button>
                </div>
            </div>
        </div>
    );
}

export default SubCategories;
