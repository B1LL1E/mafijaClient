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
import Rozgrywka from './elementy/Rozgrywka';


const socket = io.connect(process.env.REACT_APP_STRONA_SERVERA);


function App() {


  //kodDolaczenia
  const [mojNick,setMojNick] = useState('');
  const [room, setRoom] = useState('');
  const [gracze,setGracze] = useState([]);

  const [kodGry, setKodGry] = useState('');
  useEffect(() => {
    setKodGry(Losowanie());
    console.log(process.env.REACT_APP_STRONA_SERVERA);
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
        <Route path='RozgrywkaHost' element={<RozgrywkaHost mojNick={mojNick}  room={kodGry}        gracze={gracze} setGracze={setGracze} socket={socket}/>}/>
        <Route path='Rozgrywka'     element={<Rozgrywka mojNick={mojNick}      room={room}        gracze={gracze} setGracze={setGracze} socket={socket}/>}/>
      </Routes>
  
  )
}

export default App;
