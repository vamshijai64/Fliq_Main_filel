import { useEffect, useRef, useState } from 'react';
import styles from './EditCategory.module.scss'
import { MdOutlineImage } from "react-icons/md";
import axiosInstance from '../../../services/axiosInstance';
import { uploadToS3 } from '../../../utils/s3Upload';


function EditCategory({isOpen, onClose, categoryName, categoryId, imageUrl, onEditCategory}) {
    const [categoryNewName, setCategoryNewName] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setCategoryNewName(categoryName || "");
        setNewImageUrl(imageUrl || "");
    }, [categoryName,imageUrl]);

    if(!isOpen) return null;

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if(file){
    //         setImageFile(file);
    //         setNewImageUrl("");
    //     }
    // }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if(file) {
            try{
                const uploadedImageUrl  = await uploadToS3(file);
                setNewImageUrl(uploadedImageUrl); 
            } catch (error) {
                alert("Failed to upload image");
            } 
        }
    }

    const handleIconClick = () => {
        fileInputRef.current.click();
    }

    const handleEdit = async () => {
        if(!categoryNewName.trim()){
            alert("Please enter category name");
            return;
        }

        console.log("Name: ", categoryNewName);
        // let uploadedImageUrl = "";
        // if (imageFile) {
        //     try {
        //         console.log("Uploading to S3:", imageFile);
        //         uploadedImageUrl = await uploadToS3(imageFile); // Upload to S3 and get URL
        //         console.log("Uploaded Image URL:", uploadedImageUrl);
        //         setNewImageUrl(uploadedImageUrl); 
        //     } catch (error) {
        //         console.error("Image upload failed:", error);
        //         alert("Image upload failed");
        //         return;
        //     }
        // }
        
        // const formData = new FormData();
        // // formData.append("name", categoryNewName);
        // formData.append("title", categoryNewName);

        // if(imageFile){
        //     formData.append("image", imageFile);
        // } else {
        //     formData.append("imageUrl", imageUrl);
        // }

        try{
            const response = await axiosInstance.put(`/categories/${categoryId}`, {
                // headers: {"Content-Type": "multipart/form-data"},
                title: categoryNewName,
                imageUrl: newImageUrl,
            });

            if(response.status === 200) {
                alert("Category updated successfully");
                setCategoryNewName("");
                setNewImageUrl("");
                setImageFile(null);
                onEditCategory();
                onClose(); 
            }
        } catch(error){
            console.error("Error updating category:", error?.response?.data || error.message);
            alert("Failed to edit category");
        }
    }
    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={onClose} className={styles.cancel}>X</button>
                <h2>Altering Categories</h2>
                
                <label>Category Name</label>
                <div className={styles.inputContainer}>
                    <input type='text' 
                        value={categoryNewName || ""}
                        onChange={(e) => setCategoryNewName(e.target.value)}
                    />
                </div>

                <label>Category Url</label>
                <div className={styles.inputContainer}>
                    <input type='file' ref={fileInputRef} onChange={handleFileChange} hidden />
                    <input type='text' 
                        placeholder='Enter image URL'
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)} 
                        disabled={imageFile!==null}
                    />
                    <MdOutlineImage className={styles.icon}  onClick={handleIconClick}/>
                </div>  

                <div className={styles.modalActions}>
                    <button type='submit' onClick={handleEdit} className={styles.edit}>Edit Category</button>
                </div>
            </div>
        </div>
    )
}

export default EditCategory;
