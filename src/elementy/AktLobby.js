import { useEffect, useState } from "react"
import Losowanie from "./Losowanie";
import './AktLobby.css';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

export default function AktLobby() {

    const [kodLobby, setKodLobby] = useState('');

    let wiadomosc = 'elo elo';

    const[wia, setWia] = useState('');
    useEffect(() => {
        setKodLobby(Losowanie);
        socket.emit('dolacz', kodLobby);

    }, []);

    useEffect(() => {
        socket.on('odpo', (data) => {
            setWia(data);
        });
    }, [socket]);


    const wyslij = () => {
        socket.emit('wiado', wiadomosc, kodLobby);
    }

    return(
        <>
            <div id='kodLobby'>KOD<br/><b>{kodLobby}</b></div>
            <h1>AktLobby</h1>
            <button onClick={wyslij}></button>

            <h1>{wia}</h1>
            

            <div id='ListaGraczy'>

            </div>
        </>
    )
}