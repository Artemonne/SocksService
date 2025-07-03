import React from 'react';
import { Outlet } from 'react-router';
import  Header  from '../../widgets/Header/Header.jsx';
import  Footer from '../../widgets/Footer/Footer.jsx';

export default function Layout({ user, setUser }) {
  return (
    <div className='app'>
      <Header user={user} setUser={setUser}/>
      <main className='main'>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
