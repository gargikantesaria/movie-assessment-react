import React, { useEffect, useState } from "react";
import { UncontrolledTooltip } from "reactstrap";
import './movie-list.css';
import { MovieService } from '../../service/movie.service';
import { AWS_S3_URL } from "../../../shared/static/constants";
import Skeleton from 'react-loading-skeleton';
import { useAtom } from "jotai";
import { authenticatedUserInfo } from "../../../../atoms";
import { useNavigate } from "react-router-dom";

const MovieList = () => {

    const [movieList, setmovieList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const movieService = new MovieService();
    const [getUserInfo, setUserInfo] = useAtom(authenticatedUserInfo);

    const [hasScrollbar, setHasScrollbar] = useState(false);
    // navigation
    const navigate = useNavigate();

    useEffect(() => {
        const checkScrollbar = () => {
          const hasScroll = document.body.scrollHeight > window.innerHeight;
          setHasScrollbar(hasScroll);
        };
    
        const handleResize = () => {
          checkScrollbar();
        };
    
        // Check for scrollbar initially
        checkScrollbar();
        setTimeout(checkScrollbar, 100);
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

    useEffect(() => {
        getMovieList();    
    }, []);

    const getMovieList = () => {
        setLoading(true);
        movieService.getMovieList().then((response) => {
            setmovieList(response.data);
            setLoading(false);
        });
    }

    // clear session storage and global varibale
    const onclickLogOut = () => {
        sessionStorage.clear();
        setUserInfo(null);
        window.location.reload();
    }

    const goToCreateMovie = () => {
        navigate('/create-movie');
    }

    const handleCardClick = (movie_uuid) => {
        navigate(`/create-movie?movie_uuid=${movie_uuid}`);
    };

    return (
        <>
            <div className={`movie-list-page ${hasScrollbar ? '' : 'full-height'} ${movieList?.length > 0 ? 'm-b-160' : ''}`}>
                <div className='container movie-list-container px-4 px-lg-5'>
                    <div className='d-flex justify-content-between align-items-center py-5'>
                        <h2 className='movie-list-head mb-0'>My movies <img src="/assets/add_circle_outline_black.svg" alt="logo" className="img-fluid add-movie-icon" onClick={goToCreateMovie} role="button" tabIndex={0} id="add-movie-icon"/>
                        <UncontrolledTooltip placement="right" target="add-movie-icon" style={{ background: 'black' }}>Add Movie</UncontrolledTooltip>
                        </h2>
                        <p className='mb-0 logout-text' onClick={onclickLogOut}> <span className="d-none d-md-inline">Logout</span> <img src="/assets/logout_black.svg" alt="logo" className="img-fluid logo-img ms-2 logout-icon" /></p>
                    </div>
                    
                    {isLoading ? <div className='row movie-list-card-row'>
                        {[1,2,3,4].map((index) => (
                            <div className='col-6 col-lg-3 pt-4' key={index}>
                                <div className='card movie-list-card p-1'>
                                <Skeleton className="movie-poster-image" baseColor="#224957" highlightColor="#093545" />
                                <Skeleton height={20} width={150} style={{ marginTop: '0.5rem' }} baseColor="#224957" highlightColor="#093545" />
                                <Skeleton height={15} width={100} style={{ marginTop: '0.25rem' }} baseColor="#224957" highlightColor="#093545" />
                                </div>
                            </div>
                        ))}
                    </div> : ''}

                    { movieList?.length > 0 && !isLoading ? <div className='row movie-list-card-row'>
                        {movieList.map((movieInfo, index) => (
                            <div className='col-6 col-lg-3 pt-4 cursor-pointer' key={index} onClick={() => handleCardClick(movieInfo.movie_uuid)}>
                                <div className='card movie-list-card p-1'>
                                    <img src={AWS_S3_URL + movieInfo.poster_image_url} alt="" className="movie-poster-image" />
                                    <p className='card-text movie-name pt-3 px-2 mb-0'>{movieInfo.movie_title}</p>
                                    <p className='card-text movie-year px-2 py-2'>{movieInfo.movie_published_year}</p>
                                </div>
                            </div>
                        ))}
                    </div> : '' }

                    { movieList?.length === 0 && !isLoading ? <div className='d-flex justify-content-center align-items-center empty-movie-list flex-column'>
                        <h2>Your movie list is empty</h2>
                        <button className='add-movie-btn border-0 d-block mt-4'>Add a new movie</button>
                    </div> : '' }
                    
                </div>
            </div>
        </>
    )
}

export default MovieList;