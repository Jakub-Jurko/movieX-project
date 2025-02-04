import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AllMovies from './pages//movies/AllMovies'
import OneMovie from './pages//movies/OneMovie'
import AllSerials from './pages//serials/AllSerials'
import OneSerial from './pages/serials/OneSerial'
import SharedLayout from './pages/layout/SharedLayout'
import Form from './pages/form/Form'

const App = () => {
    return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      
            <ScrollToTop />

            <Routes>    
              <Route path='/' element={ <SharedLayout /> } >
                <Route index element={ <Home /> } />
                <Route path='/all-movies' element={ <AllMovies /> } />
                <Route path='form' element={ <Form /> } />
                <Route path='/all-serials' element={ <AllSerials /> } /> 
                <Route path='/one-movie/:movieId' element={ <OneMovie /> } />
                <Route path='/one-serial/:serialId' element={ <OneSerial /> } />
              </Route>

            </Routes>
          </BrowserRouter>
};

export default App;