import { useEffect, useState, useCallback } from "react";
import ShowReviews from "../ShowReviews/ShowReviews";
import styles from './MovieTitles.module.scss';
import axiosInstance from "../../../services/axiosInstance";
import MovieTitleModal from "./MovieTitleModal";

function MovieTitles({titleId, onBack}) {
    const [showReviews, setShowReviews] = useState(false);
    const [title, setTitle] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTitles = useCallback(async () => {
        try{
            const response = await axiosInstance(`title/getAllTitles/${titleId}`);
            if(Array.isArray(response.data))
                setTitle(response.data);
            //console.log("set Title", titleId);

        } catch(error){
            console.error("Error fetching titles", error);
        }
    }, [titleId]);

    useEffect(() => {
        fetchTitles();
    },[fetchTitles]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
    
        const baseUrl = axiosInstance.defaults.baseURL;
    
        const fullUrl = `${baseUrl}${imagePath}`;
        //console.log("Formatted Image URL:", fullUrl); 
        return fullUrl;
    };

    const openReviewPage = (titleId) => {
        setSelectedId(titleId);
        setShowReviews(true);
    }
    return (
        <div>
            {showReviews ? (
                <ShowReviews titleId={selectedId} onBack={() => setShowReviews(false)}/>
            ) : (
                <>
                    <div className={styles.movieTitle}>
                        <button onClick={onBack} className={styles.backButton}>Back</button>
                        <h2 className={styles.title}>Movie Title</h2>

                        <button className={styles.addButton}
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Add Title
                        </button>
                    </div>
                    <br />

                    <div className={styles.titleContainer}>
                        {title.length > 0 ? (
                            title.map((item) => (
                                <div key={item._id} className={styles.titleCard}>
                                    <img src={getImageUrl(item.imageUrl)} alt={item.name} className={styles.titleImage} />
                                    <p className={styles.itemTitle}>{item.title}</p>
                                    <button className={styles.showReviews} 
                                        onClick={() => openReviewPage(item._id)}
                                    >
                                        Show Reviews
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noMovies}>No Movies found</p>
                        )}
                        <MovieTitleModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onTitleAdded={fetchTitles}
                            sectionId={titleId}
                        />
                    </div>
                </>
            )
        }
        </div>
    );
}

export default MovieTitles;