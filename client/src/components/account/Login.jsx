import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashMessage from "../layout/FlashMessage";
import { useAuth } from "../context/AuthContext"
import { useFlashMessage } from "../context/FlashMessageContext";
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth()
    const { setFlashMessage } = useFlashMessage();

    const resetForm = () => {
        setEmail('');
        setPassword('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5050/account/login",
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true 
                }
            );


            if (response.data.success && response.data.token) {
                // Store the token
                localStorage.setItem('token', response.data.token);

                // Call login from AuthContext if available
                if (login) {
                    login({ id: response.data.user._id, username: response.data.user.username, email: response.data.user.email }, response.data.token);
                    
                }
                resetForm();
                navigate('/journalSelect').then(() => { setFlashMessage("Login successful, " + response.data.user.username + "!") });

            }
        } catch (err) {
            console.error("Login error:", err);
            setMessage(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div>
            <div className="@container grid grid-col-1 justify-center h-dvh items-center bg-[url(images/booksUpscale2.jpg)] bg-center bg-no-repeat bg-cover lg:bg-blue-200">
                <div className="flash-slot h-14">
                    {message && <FlashMessage newMessage={message} />}
                </div>
                <form onSubmit={handleLogin} id="formSignup" className="border-3 p-17 rounded-2xl border-blue-200 bg-gray-700 max-w-105">
                    <h1 className="text-3xl text-amber-100 justify-self-center translate-y-1 font-semibold font-serif">Login</h1>

                    <div>
                        <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
                            <input
                                className="bg-gray-200 rounded p-1.5 text-black"
                                type="text"
                                autoComplete="email"
                                placeholder="Email"
                                value={email}
                                name="email"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="my-10 border-3 border-blue-200 py-3 px-10 rounded-2xl inline-block shadow-2xl">
                            <input
                                type="password"
                                autoComplete="current-password"
                                placeholder="Password"
                                name="password"
                                id="password"
                                value={password}
                                className="bg-gray-200 rounded p-1.5"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                    </div>

                    <button className="p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-300 hover:bg-blue-200 transform hover:-translate-y-px hover:shadow-cyan-100" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
