import React, { useState, } from "react";
import CSS from "csstype";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Button, Form, Input } from "antd";

const LoginPage = () => {
    const [registering, setRegistering] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (values) => {
        const data = {
            email: values.loginEmail,
            password: values.loginPassword,
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
                navigate("/");
            } else {
                const error = await response.json();
                alert(`Login failed: ${error.message || response.status}`);
            }
        } catch (error) {
            alert(error);
        }
    };
    
    const handleRegister = async (values) => {
        const data = {
            email: values.registerEmail,
            password: values.registerPassword,
            userName: values.registerUsername,
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
                navigate("/");
            } else {
                const error = await response.json();
                alert(`Registration failed: ${error.message || response.status}`);
            }
        } catch (error) {
            alert(error);
        }
    };

    const formWrapper: CSS.Properties = {
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        textAlign: "center",
        width: "300px", 
    }
    
    return (
        <div style={styles.container}>
            <div style={formWrapper}>
                <h1>{registering ? "Zarejestruj się" : "Zaloguj się"}</h1>
                <Form
                    onFinish={registering ? handleRegister : handleLogin}
                    style={styles.form}
                    layout="vertical"
                >
                    {registering && (
                        <Form.Item
                            label="Nazwa użytkownika"
                            name="registerUsername"
                            rules={[{ required: true, message: "Pole nie może być puste!" }]}
                        >
                            <Input />
                        </Form.Item>
                    )}
        
                    <Form.Item
                        label="Email"
                        name={registering ? "registerEmail" : "loginEmail"}
                        rules={[{ required: true, message: "Pole nie może być puste!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Hasło"
                        name={registering ? "registerPassword" : "loginPassword"}
                        rules={[{ required: true, message: "Pole nie może być puste!" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        {registering ? "Zarejestruj" : "Zaloguj"}
                    </Button>
                    <br/>
                    <br/>
                    {registering && (
                        <p>
                        Masz już konto?
                    </p>
                    ) || (
                        <p>
                        Nie masz jeszcze konta?
                    </p>
                    )}
                    
                    <Button onClick={() => setRegistering(!registering)} htmlType="button">
                        {registering ? "Przejdź do logowania" : "Przejdź do rejestracji"}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    form: {
        maxWidth: "600px",
        
    },
};

export default LoginPage;
