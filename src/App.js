import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import WysNick from './elementy/WysNick';
import Home from './elementy/Home';
import { Route, Routes } from 'react-router-dom';
import Guest from './elementy/Guest';
import Host from './elementy/Host';
import RozgrywkaHost from './elementy/RozgrywkaHost';
import Losowanie from './elementy/Losowanie';


const socket = io.connect('http://localhost:3001');

function App() {


  //kodDolaczenia
  const [mojNick,setMojNick] = useState('');
  const [room, setRoom] = useState('');
  const [gracze,setGracze] = useState([]);

  const [kodGry, setKodGry] = useState('');
  useEffect(() => {
    setKodGry(Losowanie());
  }, [])

  return(

      <Routes>
        <Route index element={
          <>
            <WysNick mojNick={mojNick} setMojNick={setMojNick} />
            <Home  room={room} setRoom={setRoom}/>
          </>
        } />

        <Route path='HostLobby'     element={<Host  mojNick={mojNick} room={kodGry}                 gracze={gracze} setGracze={setGracze} socket={socket}/>}/>
        <Route path='GuestLobby'    element={<Guest mojNick={mojNick} room={room} setRoom={setRoom} gracze={gracze} setGracze={setGracze} socket={socket}/>}/>
        <Route path='RozgrywkaHost' element={<RozgrywkaHost                                         gracze={gracze} setGracze={setGracze} socket={socket}/>}/>
      </Routes>
  
  )
}

export default App;
