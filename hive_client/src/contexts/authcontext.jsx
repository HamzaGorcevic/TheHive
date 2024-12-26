import { createContext, useState, useEffect } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const storedAuthData = JSON.parse(localStorage.getItem("authData"));
    const [authData, setAuthData] = useState(storedAuthData || null);

    const loginUser = (data) => {
        const { user, token } = data;
        const newAuthData = { user, token };

        localStorage.setItem("authData", JSON.stringify(newAuthData));

        setAuthData(newAuthData);

        console.log("User logged in", newAuthData);
    };

    const logoutUser = () => {
        localStorage.removeItem("authData");

        setAuthData(null);

        console.log("User logged out");
    };

    const registerUser = (data) => {
        const { user, token } = data;
        const newAuthData = { user, token };

        localStorage.setItem("authData", JSON.stringify(newAuthData));

        setAuthData(newAuthData);

        console.log("User logged in", newAuthData);
    };

    return (
        <StateContext.Provider
            value={{ authData, loginUser, logoutUser, registerUser }}
        >
            {children}
        </StateContext.Provider>
    );
};

export default StateContext;
