import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Login = () => {

    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        setLoading(true);

        try {
            if (isCreateAccount) {
                const response = await axios.post(`${backendURL}/register`, {
                    name,
                    email,
                    password
                });
                if (response.status === 201) {
                    navigate("/");
                    toast.success("Account created successfully"); 
                }
                else{
                    toast.error("Email already exists");
                }
            } else {
                //Login API
                const response = await axios.post(`${backendURL}/login`, {
                    email,
                    password
                });

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    getUserData();
                    navigate("/");
                    toast.success("Login successful");
                }else{
                    toast.error("Email/Password incorrect");
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
            style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)" }}
        >

            {/* Logo Top Left */}
            <div className="position-absolute top-0 start-0 p-4">
                <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none">
                    <img src={assets.logo} alt="logo" width={32} height={32} className='rounded' />
                    <span className="fw-bold fs-4 text-light">Authify</span>
                </Link>
            </div>

            {/* You can add login form here later */}
            <div className='card p-4' style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className='text-center mb-4'>
                    {isCreateAccount ? "Create account" : "Login"}
                </h2>
                <form onSubmit={onSubmitHandler}>
                    {
                        isCreateAccount && (
                            <div className='mb-3'>
                                <label htmlFor='fullName' className='form-label'>Full Name</label>
                                <input type="text"
                                    id='fullName'
                                    className='form-control'
                                    placeholder='Enter fullName'
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )
                    }
                    <div className='mb-3'>
                        <label htmlFor='email' className='form-label'>Email Id</label>
                        <input type="text"
                            id='email'
                            className='form-control'
                            placeholder='Enter email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input type="password"
                            id='password'
                            className='form-control'
                            placeholder='password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className='d-flex justify-content-between mb-3'>
                        <Link to='/reset-password' className='text-decoration-none'>
                            Forgot password?
                        </Link>
                    </div>

                    <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                        {loading ? "Loading...":isCreateAccount ? "Sign Up" : "Login"}
                    </button>
                </form>

                <div className='text-center mt-3'>
                    <p className='mb-0'>
                        {isCreateAccount ?
                            (<>
                                Already have an account?{" "}
                                <span onClick={() => setIsCreateAccount(false)} className='text-decoration-underline ml-2' style={{ cursor: "pointer" }}>
                                    Login
                                </span>

                            </>) :
                            (
                                <>
                                    Don't have an account?{" "}
                                    <span onClick={() => setIsCreateAccount(true)} className='text-decoration-underline ml-2' style={{ cursor: "pointer" }}>
                                        Sign up
                                    </span>

                                </>
                            )
                        }
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Login
