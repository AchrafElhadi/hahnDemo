import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add" element={<UserForm isEdit={false} />} />
          <Route path="/edit/:id" element={<UserForm isEdit={true} />} />
          <Route path="*" element={<UserList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
