import styles from './SideNav.module.scss';
import { Link } from 'react-router-dom';
import { PiHashStraightDuotone } from "react-icons/pi";
import { SlBulb } from "react-icons/sl";
import { MdOutlineLocalMovies, MdMovieEdit } from "react-icons/md";
import { useEffect, useState } from 'react';

function SideMenu({ isOpen, toggleSidebar }) {
    const [sidebarClass, setSidebarClass] = useState('');

    useEffect(() => {
        setSidebarClass(isOpen ? styles.open : '');
    }, [isOpen]);

    return (
        <>
            <button className={styles.hamburgerMenu} onClick={toggleSidebar}>
                ☰
            </button>

            <div className={`${styles.sidemenu} ${sidebarClass}`}>
                <h2>CineQuiz</h2>
                <nav>
                    <p><Link to='categories'><PiHashStraightDuotone /><span>Categories</span></Link></p>
                    <p><Link to='questions'><SlBulb /><span>Questions</span></Link></p>
                    <p><Link to='news'><MdMovieEdit /><span>Movie News</span></Link></p>
                    <p><Link to='reviews'><MdOutlineLocalMovies /><span>Movie Reviews</span></Link></p> 
                </nav>
            </div>
        </>
    );
}

export default SideMenu;
