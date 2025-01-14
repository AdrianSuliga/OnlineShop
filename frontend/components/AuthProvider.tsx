import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
    userID: number;
    token: string;
}

const AuthContext = createContext<{
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}>({
    user: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("userID");
        if (token && userID) {
            setUser({ token, userID: Number(userID) });
        }
    }, []);

    const login = (user: User) => {
        localStorage.setItem("token", user.token);
        localStorage.setItem("userID", user.userID.toString());
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
