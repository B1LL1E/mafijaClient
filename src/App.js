import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import WysNick from './elementy/WysNick';
import Home from './elementy/Home';
import Losowanie from './elementy/Losowanie';
import AktLobby from './elementy/AktLobby';
import { Link, Route, Routes } from 'react-router-dom';

const socket = io.connect('http://localhost:3001');


function App() {

  const [mojNick,setMojNick] = useState('');

  const [wiadomosci, setWiadomosci] = useState('');
  const [wiadomosc1, setWiadomosc1] = useState('');
  const [wia, setWia] = useState('');
  const wyslijWiadomosc = () => {
    socket.emit('wysWia', wia, wysRoom);
    setWiadomosc1(wia);
  };

  useEffect(() => {
    socket.on('odpowiedz', (data) => {
      setWiadomosci(data);
    }); 
  }, [socket]);


  const [room, setRoom] = useState('');
  const [wysRoom, setWysRoom] = useState('');
  const dolacz = () => {
    setWysRoom(room);
    socket.emit('dolacz', room); 
  }

  // let dolaczono = false;
  // const stworzLobby = () => {
  //   let kodlobby = Losowanie();   
  //   dolaczono = true;
  //   alert(dolaczono)
  //}
    

  return (
    <div id='App'>
      
      
      

      {/* <h1 id=''>DZIALA</h1>
      <h1>{wiadomosci}</h1>

      <input type='text' value={wia} onChange={(e) => setWia(e.target.value)}/>
      <button onClick={wyslijWiadomosc}>wyslij wiadomosc</button>
      <br/><br/>

      
      <div id='dolaczDoRoom'>
        <h1> twój pokój to: {wysRoom}</h1>
        <input type='text' value={room} onChange={(e) => setRoom(e.target.value)} placeholder='IdPokoju' required/>
        <button onClick={dolacz}>dołacz</button>
      </div> 
      
      <h1>{wiadomosc1}</h1>
      
      */}



        <Routes>
          <Route index element={
            <>
              <WysNick mojNick={mojNick} setMojNick={setMojNick} />
              <Home/>
            </>
          }/>

          <Route path='joined' element={<AktLobby/>}/>
          
        </Routes>
 
        

      
    </div>
  );
}

export default App;
