import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import axios from "axios";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from './module/authentication/component/login/login';
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-datepicker/dist/react-datepicker.css";

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAtom } from 'jotai';
import { authenticatedUserInfo } from './atoms';
import MovieList from './module/movie/component/movie-list/movie-list';
import 'react-loading-skeleton/dist/skeleton.css';
import CreateMovie from './module/movie/component/create-movie/create-movie';

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  const [getUserInfo, setUserInfo] = useAtom(authenticatedUserInfo);

  // axios http interceptor for request 
  axios.interceptors.request.use((request) => {
    if (request.headers) {
      if (getUserInfo !== null) {
        request.headers['Authorization'] = getUserInfo.token;
      }
    }
    return request;
  }, (error) => {
    return Promise.reject(error);
  });

  // axios http interceptor for response
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    // when unauthorized , redirect to login page
    if (error.response.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/login";
    }
    return error
  });

  useEffect(() => {
    sessionStorage.getItem('userLogin') ? setUserInfo(JSON.parse(sessionStorage.getItem('userLogin') || '')) : setUserInfo(null);
  }, [setUserInfo]);

  return (
    <div className='container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/movie-list' element={<MovieList />} />
          <Route path='/create-movie' element={<CreateMovie />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

root.render(
  <div>
    <App />
  </div>
);
reportWebVitals();