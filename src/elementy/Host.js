import React ,{ useEffect, useState } from "react";
import './Host.css'
import { useNavigate } from "react-router-dom";

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
        // console.log('wyslalem');
        // console.log({gracze});
    }, [gracze]);
    


    //ustawia liste graczy
    useEffect(() => {
        props.socket.on('nowyGracz', (id , room ,nick) => {
            setGracze((prevGracz) => [...prevGracz, {id: id, room: room, nick: nick}]);
            props.setGracze((prevGracz) => [...prevGracz, {id: id, room: room, nick: nick}]);
        })    

        
    }, [props.socket]);

    //sprawdza i usuwa graczy
    props.socket.on('usun', (id) => {
        if(gracze.length > 1){
            let nowaLista = gracze.filter(gracz => gracz.id !== id.id);
        setGracze(nowaLista);  
        props.setGracze(nowaLista);
        }
    });


    //start
    const startGame = () => {
        props.socket.emit('startGry', props.room);
        setTimeout(() => {
            console.log('start');
            navigate("/RozgrywkaHost");
            props.setListOfPlayers(gracze);
        }, 2000);
    }


    const [liczbaGraczy, setLiczbaGraczy] = useState(0);
    //sprawdza czy jest 4 graczy
    useEffect(() => {
        if(gracze.length < 4){
            //znika start
            document.getElementById('startBut').style.display = 'none'
            document.getElementById('startFake').style.display = 'block';
            setLiczbaGraczy(gracze.length + ' / min. 4');
            document.getElementById('liczbaGraczy').style.color = 'red';
        }
        else{
            //pojawia start
            document.getElementById('startBut').style.display = 'block';
            document.getElementById('startFake').style.display = 'none';
            setLiczbaGraczy(gracze.length);
            document.getElementById('liczbaGraczy').style.color = 'black';
        }
        
    }, [gracze]);



    let lewoPrawo = 'lewo';
    //przemieszcza fake guzik
    const moveFakeStart = () => {
        console.log('dziala');
        if(lewoPrawo === 'lewo'){
            document.getElementById('startFake').style.left = '20%';
            // document.getElementById('startFake').style.right = '0%';
            lewoPrawo = 'prawo';
        }
        else{
            document.getElementById('startFake').style.left = '4%';
            // document.getElementById('startFake').style.right = '0%';
            lewoPrawo = 'lewo';
        }
    };

    
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
                    <div id='startBut' onClick={startGame}>
                        START
                    </div>

                    
                </div>

                <div id='startFake' onMouseEnter={moveFakeStart}>
                    START
                </div>

                <div id='liczbaGraczy'>
                    <div id='liczbaGraczy1'>Liczba graczy</div>
                    {liczbaGraczy}
                </div>
            </div>
        </>
    )
}