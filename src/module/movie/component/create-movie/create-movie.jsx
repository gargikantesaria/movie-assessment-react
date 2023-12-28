import * as React from 'react';
import { useState, useEffect } from "react";
import './create-movie.css';
//Dropzone
import Dropzone from "react-dropzone";
import { Card, Form, FormFeedback, Input, UncontrolledTooltip } from "reactstrap";
import { useAtom } from 'jotai';
import { authenticatedUserInfo } from '../../../../atoms';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { AWS_S3_URL, createMovieValidationErr } from '../../../shared/static/constants';
import Spinners from '../../../shared/components/common/spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { MovieService } from '../../service/movie.service';
import DatePicker from "react-datepicker";

const CreateMovie = () => {
    const [selectedFiles, setselectedFiles] = useState([]);
    const [fileTypeError, setFileTypeError] = useState(['']);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [getUserInfo, setUserInfo] = useAtom(authenticatedUserInfo);
    const [isLoading, setLoading] = useState(false);
    // navigation
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState();
    const [displaySelectedYear, setDisplaySelectedYear] = useState();

    const movieService = new MovieService();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const movie_uuid = queryParams.get('movie_uuid');
    const [initialValues, setInitialValues] = useState({
        movie_title: "",
        movie_published_year: '',
    });

    useEffect(() => {
        if (movie_uuid) {
            movieService.getMovieDetail(movie_uuid).then(response => {
                if (response.status === 200) {
                    const { movie_title, date, poster_image_url } = response.data;
                    setInitialValues({ movie_title, date });
                    setDisplaySelectedYear(new Date(`${response.data.movie_published_year},01,01`))
                    setSelectedDate(response.data.movie_published_year);
                    // Display preview of poster_image_url
                    setselectedFiles([{ preview: AWS_S3_URL + poster_image_url }]);
                }
            }).catch(error => {
                console.error("Error fetching movie details: ", error);
            });
        }
    }, [movie_uuid]);

    useEffect(() => {
        setIsFileSelected(selectedFiles.length > 0);
    }, [selectedFiles]);

    function handleAcceptedFiles(files) {
        files.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                fileType: fileTypeImg(file)
            })
        );
    }

    // check file type
    function fileTypeImg(file) {
        if (file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg" && file.type !== "image/webp" && file.type !== "image/svg+xml") {
            setselectedFiles([]);
            setFileTypeError(createMovieValidationErr.ERR_FILE_INVALID);
        } else {
            setselectedFiles([file]);
            setFileTypeError('');
        }
    }

    function removeFile() {
        setselectedFiles([]);
        setFileTypeError('');
    }

    // clear session storage and global varibale
    const onclickLogOut = () => {
        sessionStorage.clear();
        setUserInfo(null);
        window.location.reload();
    }

    const goToMovieList = () => {
        navigate("/movie-list");
    }

    // form
    const validation = useFormik({
        // enableReinitialize : use this  flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            movie_title: movie_uuid ? initialValues.movie_title : "",
            // movie_published_year: movie_uuid ? initialValues.movie_published_year : "",
        },
        validationSchema: Yup.object({
            movie_title: Yup.string().required(createMovieValidationErr.ERR_TITLE_REQUIRED),
            // movie_published_year: Yup.string().required(createMovieValidationErr.ERR_PUBLISHING_YEAR_REQUIRED)
        }),
        // submit form
        onSubmit: (movieDetails) => {
            setLoading(true);

            if (!movie_uuid) {
                // add mode
                const addMovieObj = {
                    movie_title: validation.values.movie_title,
                    movie_published_year: selectedDate,
                    poster_image: selectedFiles[0]
                }

                createNewMovie(addMovieObj);
            } else {
                // edit mode
                const editMovieObj = {
                    movie_title: validation.values.movie_title,
                    movie_published_year: selectedDate
                }

                if (selectedFiles.length > 0) {
                    const hasMultipleProperties = Object.keys(selectedFiles[0]).length > 1;
                    if (hasMultipleProperties) {
                        editMovieObj.poster_image = selectedFiles[0];
                    }
                }

                updateMovie(editMovieObj);
            }
        }
    });

    // create movie API call
    const createNewMovie = (addMovieObj) => {
        let formData = new FormData();

        Object.entries(addMovieObj).forEach(([key, value]) => {
            formData.append(key, value);
        });

        movieService.addMovie(formData).then(response => {
            if (response.status === 200) {
                navigate('/movie-list');
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    // update movei API call
    const updateMovie = (updateMovieObj) => {
        let formData = new FormData();

        Object.entries(updateMovieObj).forEach(([key, value]) => {
            formData.append(key, value);
        });

        movieService.updateMovie(movie_uuid, formData).then(response => {
            if (response.status === 200) {
                navigate('/movie-list');
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    const selectPublishingYear = (date) => {
        console.log(date);
        setDisplaySelectedYear(date);
        setSelectedDate(date?.getFullYear());
    }

    return (
        <>
            <div className='create-movie-page'>
                <div className='container px-4 px-lg-5'>
                    <div className='d-flex justify-content-between align-items-center py-5'>
                        <h2 className='create-movie-head mb-0'>{movie_uuid ? 'Edit' : 'Create a new movie'}</h2>
                        <p className='mb-0 logout-text' onClick={onclickLogOut}> <span className='d-none d-md-inline'> Logout</span> <img src="/assets/logout_black.svg" alt="logo" className="img-fluid logo-img ms-2 logout-icon" /></p>
                    </div>
                    <div className='row pt-4 pt-lg-5'>
                        <div className='col-12 col-lg-6'>
                            {/* drag and drop image */}
                            {selectedFiles.length === 0 ? (
                                <Dropzone id="acceptImg"
                                    onDrop={acceptedFiles => {
                                        handleAcceptedFiles(acceptedFiles)
                                    }}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <div className="dropzone d-flex justify-content-center align-items-center flex-column">
                                            <div
                                                className="dz-message cursor-pointer needsclick p-0 d-flex justify-content-center align-items-center flex-column"
                                                {...getRootProps()}
                                            >
                                                <input {...getInputProps()} />
                                                {/* <div className="mb-0">
                                                    <i className="display-4 text-muted bx bxs-cloud-upload" />
                                                </div> */}
                                                <img src="/assets/file_download_black.svg" alt="img" className="img-fluid logo-img ms-2 drag-icon" />
                                                <small className="dropdown-text pt-2">Drop an image here</small>
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            ) : (<div className="dropzone-previews" id="file-previews">
                                {selectedFiles?.map((f, i) => {
                                    return (
                                        <Card
                                            className="m-0 shadow-none dz-processing dz-image-preview dz-success dz-complete border-0"
                                            key={i + "-file"}
                                        >
                                            {/* <div className="p-2">
                                                <Row className="align-items-center">
                                                    <Col className="col-12"> */}
                                            <img
                                                data-dz-thumbnail=""
                                                className="avatar-sm rounded bg-light preview-img"
                                                alt={f.name}
                                                src={f.preview}
                                            />
                                            <i className="bi bi-trash cursor-pointer font-size-17 mt-1 position-absolute top-0 end-0 delete-poster-icon" id='delete-poster-icon' onClick={() => removeFile()}></i>
                                            <UncontrolledTooltip placement="bottom" target="delete-poster-icon" style={{ background: 'black' }}>Remove</UncontrolledTooltip>
                                            {/* </Col>
                                                </Row>
                                            </div> */}
                                        </Card>
                                    )
                                })}
                            </div>)}
                            <span className="invalid-file d-block validation-error-msg">{fileTypeError}</span>
                        </div>
                        <div className='col-12 col-lg-6'>
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                }}
                            >
                                <div className="mb-3 mt-4 mt-lg-0">
                                    <Input
                                        name="movie_title"
                                        className="form-control create-movie-input create-movie-title-input border-0"
                                        placeholder="Title"
                                        type="text"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.movie_title || ""}
                                        invalid={
                                            validation.touched.movie_title && validation.errors.movie_title ? true : false
                                        }
                                    />
                                    {validation.touched.movie_title && validation.errors.movie_title ? (
                                        <FormFeedback type="invalid" className='validation-error-msg'>{validation.errors.movie_title}</FormFeedback>
                                    ) : null}
                                </div>
                                <div className="mb-3">
                                    <DatePicker
                                        id="DatePicker"
                                        type="string"
                                        className="text-primary text-center date-picker-year"
                                        selected={displaySelectedYear}
                                        isOpen={() => {
                                            if (!displaySelectedYear) {
                                                setDisplaySelectedYear('');
                                            }
                                        }}
                                        onChange={(date) => selectPublishingYear(date)}
                                        maxDate={new Date()}
                                        showYearPicker
                                        dateFormat="yyyy"
                                        placeholderText={"Publishing year"}
                                        required
                                    />
                                    {displaySelectedYear === '' || displaySelectedYear === null ? (
                                        <span className="invalid-msg">{createMovieValidationErr.ERR_PUBLISHING_YEAR_REQUIRED}</span>
                                    ) : null}
                                    {/* {validation.touched.movie_published_year && validation.errors.movie_published_year ? (
                                        <FormFeedback type="invalid" className='validation-error-msg'>{validation.errors.movie_published_year}</FormFeedback>
                                    ) : null} */}
                                </div>
                                <div className='d-flex mt-4 mt-lg-5 pt-3'>
                                    <button className='outline-btn border-0 me-3' onClick={goToMovieList}>Cancel</button>
                                    <button className='submit-btn border-0' type='submit' disabled={!validation.isValid || (!isFileSelected) || (!selectedDate)}>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            {/* loader */}
                                            {isLoading ? <Spinners className="" setLoading={setLoading} /> : ''}
                                            <span className='submit-text'> {movie_uuid ? 'Update' : 'Submit'}</span>
                                        </div>
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateMovie;