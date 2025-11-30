import React from 'react';
import { Route, Routes as Routers } from 'react-router-dom';
import Home from './Pages/Home';
import SignupPage from './Pages/SigninPage';
import LoginPage from './Pages/LoginPage';
import Message from './Pages/Message';  
import AddFriends from './Pages/AddFriends';



import './App.css';

function App() {
  return (
    <div>
      <Routers>
        <Route path='/' element={<Home/>}/>
        <Route path='/signin' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/message' element={<Message/>}/>
        <Route path='addfriends' element={<AddFriends/>}/>
      </Routers>
    </div>
  );
}

export default App;
