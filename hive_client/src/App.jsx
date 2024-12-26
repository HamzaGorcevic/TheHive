import AuthPage from "./views/auth/authPage";
import StateContext, { ContextProvider } from "./contexts/authcontext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/auth/login";
import { Register } from "./views/auth/register";
import { Slide, ToastContainer } from "react-toastify";
import RoomForm from "./views/room/roomForm";
import { UserRooms } from "./views/room/userRooms";
import Rooms from "./views/room/rooms";
import Room from "./views/room/room";

function App() {
    return (
        <Router>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
            />
            <ContextProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create-room" element={<RoomForm />} />
                    <Route path="/user-rooms" element={<UserRooms />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/rooms/:id" element={<Room />} />
                </Routes>
            </ContextProvider>
        </Router>
    );
}

export default App;
