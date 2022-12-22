import React ,{ useEffect, useState } from "react";
import './Guest.css';
import DisGracza from "./DisGracza";



export default function Guest(props) {
    
    //lista graczy
    const [gracze, setGracze] = useState([]);

    //nick gracza
    const mojNick = props.mojNick;

    //dołaczanie
    useEffect(() => {
        props.socket.emit('dolacz', props.room, mojNick);
    }, [])
    
    

    //pobieranie listy graczy
    props.socket.on('listaOdp', (players) => {
        setGracze(players); 
        console.log([players]);
    });   

    



    //dissconnect hosta
    let hostID = '';
    let hostNICK = '';
    useEffect(() => {
        let nrGracz = 0;
        gracze.map((ele) => {
            if(nrGracz === 1){
                hostID = ele.id;
                hostNICK = ele.nick;
            }
        })
    }, [gracze]);
  
    const [usuGracz, setUsuGracz] = useState('');
    const [wysDisGracza, setWysDisGracza] = useState('NIE');
    props.socket.on('usun', (id) => {
        setUsuGracz(id.nick);    
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    });
    useEffect(() => {
        if(usuGracz !== ''){
            setWysDisGracza('TAK');
        }
    }, [usuGracz]);


    

    return(
        <>
            <h1>Guest</h1>
            <div id='menu'>
                
                <div id='kodLobby'>KOD<br/><b>{props.room}</b></div>
                    
                <div id='ListaGraczy'>
                    {
                        gracze.map((ele) => {
                            return(
                                <div id='jedenGracz'>{ele.nick}</div>
                            )
                        })
                    }
                </div>

                
            </div>

            <DisGracza id='DisGracza' usuGracz={usuGracz} wysDisGracza={wysDisGracza}/>
        </>
    )
}