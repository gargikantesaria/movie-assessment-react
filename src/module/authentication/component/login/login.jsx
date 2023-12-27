import * as React from 'react';
import { useState } from "react";
import { Row, Col, Card, Container, Form, Input, FormFeedback, Label } from "reactstrap";
// import './login.scss';
import './login.css';
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { loginValidationErr } from '../../../shared/static/constants';
import Spinners from '../../../shared/components/common/spinner';
import { useNavigate } from 'react-router-dom';
import { AuthenticationService } from '../../service/authentication.service';
import { useAtom } from 'jotai';
import { authenticatedUserInfo } from '../../../../atoms';
// toast message
import { ToastContainer } from "react-toastify";

const LogIn = () => {

    // form
    const validation = useFormik({
        // enableReinitialize : use this  flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            email: "",
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required(loginValidationErr.ERR_EMAIL_REQUIRED)
                .email(loginValidationErr.ERR_EMAIL_INVALID),
            password: Yup.string().required(loginValidationErr.ERR_PASSWORD_REQUIRED)
        }),
        // submit form
        onSubmit: (userCredential) => {
            userLoginAndRedirect(userCredential);
        }
    });

    const [, setUserInfo] = useAtom(authenticatedUserInfo);
    // for toggle password show to hide
    const [visiblePassword, setVisiblePassword] = useState(false);
    // loader
    const [isLoading, setLoading] = useState(false);
    // navigation
    const navigate = useNavigate();
    // auth service
    const authenticationService = new AuthenticationService();

    // api call & redirect to page according to loggedin user role
  const userLoginAndRedirect = (userCredentials) => {
    setLoading(true);
    authenticationService.logIn(userCredentials).then(response => {
      // store user data in session storage
      if (response.status === 200) {
        const loggedinUserData = {
          token: response.data.access_token,
          data: {
            user_uuid: response.data.data.user_uuid,
            name: response.data.data.name,
            email: response.data.data.email
          },
        };
        sessionStorage.setItem('userLogin', JSON.stringify(loggedinUserData));
        setUserInfo(JSON.parse(sessionStorage.getItem('userLogin') || ''));
        navigate("/movie-list");
      }
    }).finally(() => {
      setLoading(false);
    });
  }

    return (
        <div className='login-page'>
            <Container>
                <Row>
                    <Col>
                        <Card className='login-card border-0 justify-content-center align-items-center'>
                            <Form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                  }}
                            >
                                <h1 className='text-center login-head mb-4'>Sign in</h1>
                                {/* email */}
                                <div className="mb-3">
                                    <Input
                                        name="email"
                                        className="form-control login-input border-0"
                                        placeholder="Email"
                                        type="email"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.email || ""}
                                        invalid={
                                            validation.touched.email && validation.errors.email ? true : false
                                        }
                                    />
                                    {validation.touched.email && validation.errors.email ? (
                                    <FormFeedback type="invalid" className='validation-error-msg'>{validation.errors.email}</FormFeedback>
                                    ) : null}
                                </div>
                                {/* password */}
                                <div className="mb-3 position-relative">
                                    <Input
                                        name="password"
                                        className="form-control login-input border-0"
                                        placeholder="Password"
                                        type={visiblePassword ? "text" : "password"}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.password || ""}
                                        invalid={
                                            validation.touched.password && validation.errors.password ? true : false
                                        }
                                    />
                                    {validation.values.password.length > 0 && (<i className={`bi login-eye ${!(validation.touched.password && validation.errors.password) ? 'right-5px' : ''}  ${visiblePassword ? 'bi-eye' : 'bi-eye-slash'}`} onClick={() => { setVisiblePassword(!visiblePassword) }}></i>)}
                                    {validation.touched.password && validation.errors.password ? (
                                    <FormFeedback type="invalid" className='validation-error-msg'>{validation.errors.password}</FormFeedback>
                                    ) : null}
                                </div>
                                {/* remember me */}
                                <div className="mb-3 text-center">
                                    <input type="checkbox" className="form-check-input login-check-input border-0 me-2" id="checkbox1"></input>
                                    <Label className='check-label'>Remember me</Label>
                                </div>
                                <button className='login-btn position-relative border-0' type="submit" disabled={!validation.isValid || !validation.dirty}>
                                <div className='d-flex justify-content-center align-items-center'>
                                    {/* loader */}
                                    {isLoading ? <Spinners className="" setLoading={setLoading} /> : ''}
                                    Login
                                </div>
                                </button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {/* toast message */}
            <ToastContainer />
        </div>
    )
}

export default LogIn;