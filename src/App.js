import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AllMovies from './pages/AllMovies'
import OneMovie from './pages/OneMovie'
import AllSerials from './pages/AllSerials'
import OneSerial from './pages/OneSerial'
import SharedLayout from './pages/SharedLayout'

const App = () => {
    return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>

        <Route path='/' element={ <SharedLayout /> } >
          <Route index element={ <Home /> } />
          <Route path='/all-movies' element={ <AllMovies /> } />
          <Route path='/all-serials' element={ <AllSerials /> } /> 
          <Route path='/one-movie/:movieId' element={ <OneMovie /> } />
          <Route path='/one-serial/:serialId' element={ <OneSerial /> } />
        </Route>

      </Routes>
    </BrowserRouter>
};

export default App;