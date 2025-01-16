import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const LoginPage = () => {
    const [registering, setRegistering] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            email: formData.get("loginEmail"),
            password: formData.get("loginPassword"),
        };

        try {
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                const user = { userID: result.userID, token: result.token };
                login(user);
                console.log(result.user)
                navigate("/"); 
            } else {
                const error = await response.json();
                alert(`Login failed: ${error.message || response.status}`);
            }
        } catch (error) {
            alert(error);
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            email: formData.get("registerEmail"),
            password: formData.get("registerPassword"),
            userName: formData.get("registerUsername"),
            adminRights: false,
        };

        try {
            const response = await fetch("http://localhost:3000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                const user = { userID: result.userID, token: result.token };
                login(user);
                console.log(result.token)
                navigate("/");
            } else {
                const error = await response.json();
                alert(`Registration failed: ${error.message || response.status}`);
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <h1>{registering ? "Register" : "Login"}</h1>
            <form onSubmit={registering ? handleRegister : handleLogin}>
                {registering && (
                    <>
                        <label htmlFor="registerUsername">Name:</label>
                        <input id="registerUsername" name="registerUsername" type="text" required />
                        <br></br>
                        <br></br>
                    </>
                )}

                <label htmlFor={registering ? "registerEmail" : "loginEmail"}>Email:</label>
                <input id={registering ? "registerEmail" : "loginEmail"} name={registering ? "registerEmail" : "loginEmail"} type="email" required />
                <br></br>
                <br></br>
                <label htmlFor={registering ? "registerPassword" : "loginPassword"}>Password:</label>
                <input id={registering ? "registerPassword" : "loginPassword"} name={registering ? "registerPassword" : "loginPassword"} type="password" required />
                <br></br>
                <br></br>
                <button type="submit">{registering ? "Register" : "Login"}</button>
                <br></br>
                <br></br>
                <button type="button" onClick={() => setRegistering(!registering)}>
                    {registering ? "Go to login" : "Go to register"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
