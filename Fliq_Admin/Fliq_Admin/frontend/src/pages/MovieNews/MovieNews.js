import { useState } from "react";
import styles from "./MovieNews.module.scss";
import MovieNewsModal from "./MovieNewsModal";


function MovieNews() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.container}>
          
            <div className={styles.header}>
                <h2 className={styles.heading}>Movie News</h2>
            </div>
            <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                    + Add Movie News
            </button>

            <MovieNewsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* {movieNews.length === 0 && <p className={styles.noNews}>No Movie News Available</p>} */}
        </div> 
    );
}

export default MovieNews;
