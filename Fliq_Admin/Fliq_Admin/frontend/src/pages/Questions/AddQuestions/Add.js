import { useState, useEffect, useRef } from "react";
import styles from "./Add.module.scss";
import axiosInstance from "../../../services/axiosInstance";
import { MdOutlineImage } from "react-icons/md";
import AddQuestionsModal from "./AddQuestionsModal";
import { uploadToS3 } from "../../../utils/s3Upload";

function Add() {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
   
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchCategories();  
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleOpenModal = () => {
        if (!category || !selectedSubcategory || !imageUrl) {
            alert("Please fill all fields before proceeding.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    // const handleFileChange = (event) => {
    //     if (event.target.files.length > 0) {
    //         const file = event.target.files[0];
    //         setImageFile(file);
            
    //         console.log("Selected File:", file);
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

    return (
        <div className={styles.formContainer}>
            <div className={styles.addQuestions}>
                <h2 className={styles.title}>Questions Module</h2>
            </div>

            <div className={styles.inputGroup}>
                <label>Category Name</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label>Subcategory Name</label>
                <input 
                    type="text" 
                    placeholder="Enter subcategory name"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                />
            </div>

            <div className={styles.inputGroup}>
                <label>Subcategory Thumbnail Image</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        placeholder="No file selected"
                        //value={imageUrl ? imageUrl.name : ""}
                        value={imageUrl}
                        readOnly
                    />
                    <MdOutlineImage className={styles.icon} onClick={handleIconClick} />
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className={styles.modalActions}>
                <button className={styles.submitButton} onClick={handleOpenModal}>
                    Enter Questions
                </button>
            </div>

            {isModalOpen && (
                <AddQuestionsModal
                    onClose={() => setIsModalOpen(false)}
                    subcategory={selectedSubcategory}
                    categoryId={category}
                    // imageUrl={imageFile ? URL.createObjectURL(imageFile) : ""} 
                    imageUrl={imageUrl}
                />
            )}
        </div>
    );
}

export default Add;
