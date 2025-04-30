import { useEffect, useState } from 'react';
import styles from './MovieCategory.module.scss'
import axiosInstance from '../../../services/axiosInstance';
import MovieCategoryModal from './MovieCategoryModal';
// import MovieTitles from '../MovieTitles/MovieTitles';
import MovieTitlesModal from './MovieTitleModal';
import MovieTitles from '../MovieTitles/MovieTitles';

function MovieCategory() {
    const [title, setTitle] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTitleId, setSelectedTitleId] = useState(null);
    const [showTitles, setShowTitles] = useState(false);
    // const [sectionId, setSectionId] = useState("");
    const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    },[]);

    const fetchCategories = async () => {
        try{
            const response = await axiosInstance('section/getAllSections');
            //console.log(response.data);
            if(Array.isArray(response.data))
                setTitle(response.data);
        } catch(error){
            console.error("Error fetching categories", error);
        }
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
    
        const baseUrl = axiosInstance.defaults.baseURL;
    
        return `${baseUrl}${imagePath}`;
    };

    const openSubCategoryModal = (sectionId) => {
        setSelectedTitleId(sectionId);
        setIsSubCategoryModalOpen(true);
    }

    const openMoviesPage = (titleId) => {
        setSelectedTitleId(titleId);
        setShowTitles(true);
    };

    return (
        <div>
            {showTitles ? (
                <MovieTitles 
                    titleId={selectedTitleId} 
                    onBack={() => setShowTitles(false)} 
                />
            ) : (
                <>
                    <div className={styles.movieCategory}>
                        <h2 className={styles.title}>Movie Category</h2>
                        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                            + Add Movie Category
                        </button>
                    </div>
                    <br />

                    <div className={styles.categoryContainer}>
                        {title.length > 0 ? (
                            title.map((item) => (
                                <div key={item._id} className={styles.titleCard}>
                                    <img src={getImageUrl(item.imageUrl)} alt={item.name} className={styles.titleImage} />
                                    
                                    <button className={styles.addTitleButton} onClick={() => openSubCategoryModal(item._id)}>
                                        +
                                    </button>
                                    <p className={styles.itemTitle}>{item.title}</p>
                                    <button className={styles.showMovies} onClick={() => openMoviesPage(item._id)}>
                                        Show Movies
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noMovies}>No Movie Categories found</p>
                        )}
                    </div>

                    <MovieCategoryModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onCategoryAdded={fetchCategories}
                    />

                    <MovieTitlesModal 
                        isOpen={isSubCategoryModalOpen}
                        onClose={() => setIsSubCategoryModalOpen(false)}
                        sectionId={selectedTitleId}
                    />
                </>
            )}
        </div>
    );
}

export default MovieCategory;
