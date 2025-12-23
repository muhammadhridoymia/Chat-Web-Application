import React from 'react';
import { Route, Routes as Routers } from 'react-router-dom';
import Home from './Pages/Home';
import SignupPage from './Pages/SigninPage';
import LoginPage from './Pages/LoginPage';
import AddFriends from './Pages/AddFriends';
import CreateGroup from './Pages/CreateGroup';
import './App.css';

function App() {
  return (
    <div>
      <Routers>
        <Route path="/" element={<Home/>}/>
        <Route path='/signin' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/addfriends' element={<AddFriends/>}/>
        <Route path='/creategroup' element={<CreateGroup/>}/>
      </Routers>
    </div>
  );
}

export default App;
