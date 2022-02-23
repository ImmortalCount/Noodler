import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' 
import MainPage from "./pages/main/MainPage.jsx";
import Login from './pages/login/Login.jsx'
import Register from './pages/register/Register.jsx'
import Docs from './pages/docs/Docs.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login'element={<Login/>}/>
        <Route path='/docs'element={<Docs/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route exact path='/' element={<MainPage/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
