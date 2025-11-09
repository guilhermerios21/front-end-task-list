import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Tasks from '../pages/Tasks';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Header from '../components/common/Header';

const AppRoutes = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/tasks" 
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    } 
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;