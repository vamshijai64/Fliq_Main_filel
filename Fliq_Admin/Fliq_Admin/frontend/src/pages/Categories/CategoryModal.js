import styles from "./CategoryModal.module.scss";
import { MdOutlineImage } from "react-icons/md";
import { useRef, useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import { uploadToS3 } from "../../utils/s3Upload";

function CategoryModal({ isOpen, onClose, onCategoryAdded}) {
    const [categoryName, setCategoryName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);
    
    if (!isOpen) return null;

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    //         if (!allowedTypes.includes(file.type)) {
    //             alert("Only PNG, JPG, and WEBP images are allowed!");
    //             return;
    //         }
    //         if (file.size > 5 * 1024 * 1024) { // 5MB 
    //             alert("File size exceeds 5MB!");
    //             return;
    //         }
    
    //         setImageFile(file);
    //         setImageUrl(""); 
    //     }
    // };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          setIsUploading(true);
          try {
            const uploadedUrl = await uploadToS3(file);
            setImageUrl(uploadedUrl);
          } catch (error) {
            alert("Failed to upload image");
          } finally {
            setIsUploading(false);
          }
        }
      };
    
    const handleUpload = async () => {
        if (!categoryName.trim()) {
          alert("Please enter category name");
          return;
        }
        if (!imageUrl) {
          alert("Please upload an image");
          return;
        }
    
        try {
          const response = await axiosInstance.post("/categories/create", {
            title: categoryName.trim(),
            imageUrl: imageUrl,
          });
    
          if (response.status === 201) {
            alert("Category created successfully!");
            onCategoryAdded();
            setCategoryName("");
            setImageUrl("");
            onClose();
          }
        } catch (error) {
          console.error("Error creating category:", error);
          alert("Failed to create category");
        }
    }
    // const handleUpload = async () => {
    //     if (!categoryName) {
    //         alert("Please enter category name");
    //         return;
    //     }

    //     if (!imageFile) {
    //         alert("Please select an image");
    //         return;
    //     }
    //     let uploadedImageUrl = "";

    //     if (imageFile) {
    //         try {
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
    
    //     // const formData = new FormData();
    //     // formData.append("title", categoryName);
    
    //     // if (imageFile) {
    //     //     formData.append("image", imageFile);
    //     // } else if (imageUrl) {
    //     //     formData.append("imageUrl", imageUrl);
    //     // }
    
    //     try {
    //         setIsUploading(true);
    //         const response = await axiosInstance.post("/categories/create", {
    //             // headers: { "Content-Type": "multipart/form-data" },
    //             title: categoryName,
    //             imageUrl: uploadedImageUrl,

    //         });
    
    //         if (response.status === 201) {
    //             alert("Category added successfully!");
    //             onCategoryAdded();
    //             setCategoryName("");
    //             setImageUrl("");
    //             setImageFile(null);
    //             onClose();
    //         }
    //     } catch (error) {
    //         console.error("Error creating category:", error);
    
    //         if (error.response) {
    //             if (error.response.status === 409) {
    //                 alert("Category name already exists! Please choose a different name.");
    //             } else {
    //                 alert(error.response.data.message || "Failed to create category");
    //             }
    //         } else {
    //             alert("Network error! Please try again.");
    //         }
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };
    
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.cancel}>X</button>
                <h2>Inserting Category</h2>
                <label>Category Name</label>
                <div className={styles.inputContainer}>
                    <input 
                        type="text"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>

                <label>Category Thumbnail Image</label>
                <div className={styles.inputContainer}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                    <input
                        type="text"
                        placeholder="Enter Image URL or Select Image"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        disabled={imageFile !== null} 
                    />
                    <MdOutlineImage className={styles.icon} onClick={handleIconClick} />
                </div>

                <div className={styles.modalActions}>
                    <button onClick={handleUpload} className={styles.add} disabled={isUploading}>
                        {isUploading ? "Uploading" : "Upload Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryModal;
