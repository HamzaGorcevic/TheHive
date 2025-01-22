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
import Navbar from "./components/navbar/navbar";
import "./app.css";
import ProtectedRoute from "./helpers/protectedRoute";
import RegisterBeekeeper from "./views/auth/registerBeekeeper";
import Profile from "./views/profile/profile";
import BeekeeperService from "./views/beekeeperService/browseBeekeeperServices";
import BrowseServices from "./views/beekeeperService/browseBeekeeperServices";
import CreateService from "./views/beekeeperService/createBeekeeperService";
import CreateCategory from "./views/admin/createCategory";
import Landing from "./views/landing";
import ViewUser from "./views/users/viewUser";
import UsersList from "./views/users/usersList";
import UserReserved from "./views/reservations/userReserved";
import Footer from "./views/footer/footer";
import DetailsService from "./views/beekeeperService/detailsService/detailsService";
import ContactMe from "./views/contact/contactme";
import AccessDenied from "./views/errorViews/accessDenied";
import ReservationSchedule from "./views/reservationSchedule/reservationSchedule";
function App() {
    return (
        <Router>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
                className="custom-toast-container"
            />
            <ContextProvider>
                <Navbar />
                <Routes>
                    {/* for all roles */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["user", "beekeeper", "admin"]}
                            />
                        }
                    >
                        <Route
                            path="/user/view/:user_id/profile"
                            element={<ViewUser />}
                        />
                        <Route path="/users-list" element={<UsersList />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/rooms/:id" element={<Room />} />
                        <Route
                            path="/services/:id"
                            element={<DetailsService />}
                        />
                    </Route>

                    {/* User and beekeepr only */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["user", "beekeeper"]}
                            />
                        }
                    >
                        <Route path="/contact" element={<ContactMe />} />
                        <Route path="/create-room" element={<RoomForm />} />
                        <Route path="/user-rooms" element={<UserRooms />} />
                        <Route
                            path="/user-reserved"
                            element={<UserReserved />}
                        />
                    </Route>
                    {/* beekeeper */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["beekeeper"]} />
                        }
                    >
                        <Route
                            path="/schedule"
                            element={<ReservationSchedule />}
                        />
                    </Route>
                    {/* beekeeper and admin */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["beekeeper", "admin"]}
                            />
                        }
                    >
                        <Route path="/services" element={<BrowseServices />} />
                        <Route
                            path="/create-service"
                            element={<CreateService />}
                        />
                    </Route>
                    {/* availble for admin */}
                    <Route
                        element={<ProtectedRoute allowedRoles={["admin"]} />}
                    >
                        <Route
                            path="/create-category"
                            element={<CreateCategory />}
                        />
                    </Route>
                    {/* availble for everyone */}

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Landing />} />
                    <Route
                        path="/register-beekeeper"
                        element={<RegisterBeekeeper />}
                    />
                    <Route path="/access-denied" element={<AccessDenied />} />
                </Routes>
                <Footer />
            </ContextProvider>
        </Router>
    );
}

export default App;
