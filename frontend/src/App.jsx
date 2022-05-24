import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' 
import MainPage from "./pages/main/MainPage.jsx";
import Login from './pages/login/Login.jsx'
import Register from './pages/register/Register.jsx'
import Docs from './pages/docs/Docs.jsx';
import Collections from './pages/collections/Collections.jsx';
import Pools from './pages/pools/Pools.jsx';
import Tab from './pages/tab/Tab.jsx';
import InstrumentTest from './components/Instruments/InstrumentTest.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login'element={<Login/>}/>
        <Route path='/docs'element={<Docs/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/collections' element={<Collections/>}/>
        <Route path='/pools' element={<Pools/>}/>
        <Route path='/tab' element={<Tab/>}/>
        <Route path='/test' element={<InstrumentTest/>}/>
        <Route exact path='/' element={<MainPage/>} />

      </Routes>
    </Router>
    
  );
}

export default App;
