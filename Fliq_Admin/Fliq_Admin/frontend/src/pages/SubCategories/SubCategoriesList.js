import { useState, useEffect } from "react";
import styles from "./SubCategoriesList.module.scss";
import axiosInstance from "../../services/axiosInstance";
import AddQuiz from './AddQuiz/AddQuiz';

function SubCategoryList({ isOpen, onClose, categoryId }) {
    const [subcategories, setSubcategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    //const [categoryImage, setCategoryImage] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); 

    useEffect(() => {
        if (!categoryId || !isOpen) return; 

        const fetchSubcategories = async () => {
            try {
                const response = await axiosInstance.get(`/categories/${categoryId}`);
                //console.log("Subcategories fetched:", response.data);
                setSubcategories(response.data.subcategories || []);
                // setCategoryName(response.data.name || "Unknown Category");
                // setCategoryImage(response.data.image || "");
                setCategoryName(response.data.title || "Unknown Category");
                //setCategoryImage(response.data.imageUrl || "");
            } catch (error) {
                //console.error("Error fetching subcategories:", error);
                setSubcategories([]);
            }
        };

        fetchSubcategories();
    }, [categoryId, isOpen]);

    if (!isOpen) return null; 

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";

        if (imagePath.startsWith("http")) return imagePath;

        if (imagePath.startsWith("https")) return imagePath;
    
        const baseUrl = axiosInstance.defaults.baseURL;
    
        const fullUrl = `${baseUrl}${imagePath}`;
        return fullUrl;
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                
                <h2>{categoryName}:</h2>
                
                <div className={styles.subcategoryContainer}>
                    {subcategories.length > 0 ? (
                        subcategories.map((item) => (
                            <div key={item._id} className={styles.subcategoryCard}>
                                <img src={getImageUrl(item.imageUrl)} alt={item.title} className={styles.subcategoryImage} />

                                <p className={styles.subTitle}>{item.title}</p>
                                <button 
                                    className={styles.addQuiz} 
                                    onClick={() => setSelectedSubcategory(item)} 
                                >
                                    Add Quiz
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noSubCategory}>No subcategories found.</p>
                    )}
                </div>
            </div>

            {selectedSubcategory && (
                <AddQuiz
                    isOpen={true} 
                    onClose={() => setSelectedSubcategory(null)} 
                    subcategory={selectedSubcategory} 
                />
            )}
        </div>
    );
}

export default SubCategoryList;
