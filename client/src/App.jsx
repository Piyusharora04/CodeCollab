import React from 'react';

import RoomJoinPage from './Components/RoomJoinPage';
import EditorPage from './Components/EditorPage';
import { Toaster } from 'react-hot-toast';
import {BrowserRouter, Routes, Route} from "react-router-dom" ;
import Home from './Components/Home';
import "bootstrap/dist/css/bootstrap.min.css";
import "./../public/CSS/App.css";


function App() {
  return (
    <>
    <div>
      <Toaster  position='top-center' reverseOrder={false} ></Toaster>
    </div>
      <Routes>
      <Route path='/' element={ <Home key="home" signupVal={false} loginVal={false} /> } />
      <Route path='/user/signup' element={ <Home key="signup" signupVal={true} loginVal={false} /> } />
      <Route path='/user/login' element={ <Home key="login" signupVal={false} loginVal={true} /> } />
      <Route path='/roomJoin' element={ <RoomJoinPage /> } />
      <Route path='/editor/:roomId' element={ <EditorPage /> } />
      </Routes>
    {/* <BrowserRouter>
    </BrowserRouter> */}
    </>
  );
}

export default App;
