import React ,{ useEffect, useState } from "react";
import './Host.css'
import { useNavigate } from "react-router-dom";
import Losowanie from "./Losowanie";



export default function Host(props) {
    const navigate = useNavigate();
    
    const [wysRoom, setWysRoom] = useState('');
    useEffect(() => {
        setWysRoom(props.room);
    }, [])

    const [gracze, setGracze] = useState([{id: props.socket.id ,room: props.room, nick: props.mojNick}]);

    //tworzy lobby
    useEffect(() => {
        props.socket.emit('stworz', props.room, props.mojNick);
        props.setGracze(gracze);
    }, [])

    useEffect(() => {
        props.socket.emit('lista', props.room, {gracze});
        console.log('wyslalem');
        console.log({gracze});
    }, [gracze]);
    


    //ustawia liste graczy
    useEffect(() => {
        props.socket.on('nowyGracz', (id , room ,nick) => {
            setGracze((prevGracz) => [...prevGracz, {id: id, room: room, nick: nick}]);
            props.setGracze((prevGracz) => [...prevGracz, {id: id, room: room, nick: nick}]);
        })    

        
    }, [props.socket]);

    props.socket.on('usun', (id) => {
        let nowaLista = gracze.filter(gracz => gracz.id !== id.id);
        setGracze(nowaLista);
        props.setGracze(nowaLista);
    });


    //start
    const startGame = () => {
        setTimeout(() => {
            console.log('start');
            navigate("/RozgrywkaHost");
        }, 2000);
    }
    
    return(
        <>
            <h1>HOST</h1>
            <div id='menu'>
                <div id='kodLobby'>KOD<br/><b>{wysRoom}</b></div>

                <div id='ListaGraczy'>
                    {gracze.map((gracz) => {
                        return(
                            <div id='jedenGracz'>{gracz.nick}</div>
                        );
                    })}

                    
                </div>

                <div id='start'>
                    <button id='start' onClick={startGame}>START</button>
                </div>
            </div>
        </>
    )
}