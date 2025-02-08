import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import AllMovies from "./pages//movies/AllMovies";
import OneMovie from "./pages//movies/OneMovie";
import AllSerials from "./pages//serials/AllSerials";
import OneSerial from "./pages/serials/OneSerial";
import SharedLayout from "./pages/layout/SharedLayout";
import AddMovie from "./pages/form/AddMovie";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route path="/all-movies" element={<AllMovies />} />
            <Route path="/add-movie" element={<AddMovie />} />
            <Route path="/all-serials" element={<AllSerials />} />
            <Route path="/one-movie/:movieId" element={<OneMovie />} />
            <Route path="/one-serial/:serialId" element={<OneSerial />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
