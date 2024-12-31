import { createContext, useState, useEffect } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const storedAuthData = JSON.parse(localStorage.getItem("authData"));
    const [authData, setAuthData] = useState(storedAuthData || null);

    const loginUser = (data) => {
        const { user, token } = data;
        const newAuthData = { user, token };
        const decodedToken = decodeToken(token);

        localStorage.setItem("authData", JSON.stringify(newAuthData));

        setAuthData(newAuthData);
        // checkTokenExpiration(token, decodedToken?.exp);
        console.log("User logged in", newAuthData);
    };

    const decodeToken = (token) => {
        try {
            const payload = token?.split(".")[1];
            if (payload) {
                const decodedPayload = JSON.parse(atob(payload));
                return decodedPayload;
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
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
    };
    const checkTokenExpiration = (token, exp) => {
        const currentTime = Math.floor(Date.now() / 1000);

        if (exp <= currentTime) {
            console.warn("Token has already expired.");
            logoutUser();
        } else {
            const timeout = (exp - currentTime) * 1000;

            console.log(
                `Token will expire in ${Math.floor(timeout / 1000)} seconds.`
            );
            setTimeout(() => {
                console.log("Token expired, logging out...");
                logoutUser();
            }, timeout);
        }
    };

    const updateUser = (token, updatedUser) => {
        console.log(token, updateUser);
        const updatedAuthData = { token: token, user: updatedUser };
        localStorage.setItem("authData", JSON.stringify(updatedAuthData));
        setAuthData(updatedAuthData);
        console.log("User updated successfully", updatedAuthData);
    };

    return (
        <StateContext.Provider
            value={{
                authData,
                loginUser,
                logoutUser,
                registerUser,
                updateUser,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export default StateContext;
