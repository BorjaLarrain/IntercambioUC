import './App.css'


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';


function App() {


 return (
   <>
   <Home/>
   <BrowserRouter>
     <Routes>
       {/* ACÁ VAN LAS ROUTES */}
     </Routes>
   </BrowserRouter>
   </>
 )
}


export default App
