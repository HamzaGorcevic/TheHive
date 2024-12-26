import { useState } from "react";
import Login from "./login";
import { Register } from "./register";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/10">
            <div className="w-full max-w-md">
                {isLogin ? (
                    <Login onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                    <Register onSwitchToLogin={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
}
