import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import EditPostPage from "./pages/EditPostPage";
import PostPage from "./pages/PostPage";
import CategoriesPage from "./pages/CategoriesPage";
import TagsPage from "./pages/TagsPage";
import DraftsPage from "./pages/DraftsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import {AuthProvider, useAuth} from "./components/AuthContext";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import ContactMessagesPage from "./pages/ContactMessages.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import Bookings from "./pages/Bookings.tsx";
import BookingView from "./pages/BookingView.tsx";
import BookingUserPage from "./pages/BookingUserPage.tsx";
function AppContent() {
    const { isAuthenticated, logout, user, isAdmin } = useAuth(); // Add isAdmin here

    return (
        <BrowserRouter>
            <NavBar
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                userProfile={user ? {
                    name: user.name,
                    avatar: undefined
                } : undefined}
                onLogout={logout}
            />
            <main className="container mx-auto py-6">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage/>} />
                    <Route
                        path="/posts/new"
                        element={
                            <ProtectedRoute adminOnly>
                                <EditPostPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/posts/:id" element={<PostPage />} />
                    <Route
                        path="/posts/:id/edit"
                        element={
                            <ProtectedRoute adminOnly>
                                <EditPostPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <ProtectedRoute adminOnly>
                                <CategoriesPage isAuthenticated={isAuthenticated} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tags"
                        element={
                            <ProtectedRoute adminOnly>
                                <TagsPage isAuthenticated={isAuthenticated} />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/contact" element={<ContactPage/>}
                           />
                    <Route path="/contact-messages" element={<ProtectedRoute adminOnly><ContactMessagesPage/></ProtectedRoute> }
                           />
                    <Route
                        path="/posts/drafts"
                        element={
                            <ProtectedRoute adminOnly>
                                <DraftsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/despre-mine" element={<AboutPage/>}/>
                    <Route path="/booking" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
                    <Route path="/servicii" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
                    <Route path="/programarile-mele-admin" element={<ProtectedRoute adminOnly><BookingView/></ProtectedRoute>} />
                    <Route path="/programarile-mele" element={<ProtectedRoute><BookingUserPage/></ProtectedRoute>} />

                </Routes>
            </main>
        </BrowserRouter>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent/>
        </AuthProvider>
    );
}

export default App;