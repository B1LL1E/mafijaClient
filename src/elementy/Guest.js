import React ,{ useEffect, useState } from "react";
import './Guest.css';
import DisGracza from "./DisGracza";
import { useNavigate } from "react-router-dom";


export default function Guest(props) {
    
    const navigate = useNavigate();

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
        props.setGracze(players);
        console.log([players]);
    });   

    


    //dissconnect hosta
    let hostID = '';
    let hostNICK = '';
    useEffect(() => {
        let nrGracz = 0;
        gracze.map((ele) => {
            nrGracz++;
            if(nrGracz === 1){
                hostID = ele.id;
                console.log(hostID);
                hostNICK = ele.nick;
            }
        })
    }, [gracze]);
  
    //sprawdza czy host jest aktywny
    const [usuGracz, setUsunGracz] = useState('');
    let usuGraczID = '';
    const [wysDisGracza, setWysDisGracza] = useState('NIE');
    props.socket.on('usun', (gracz) => {
        setUsunGracz(gracz.nick); 
        usuGraczID = gracz.id;
        // console.log(usuGraczID);
        // console.log(hostID);
        if(usuGraczID === hostID){
            setWysDisGracza('TAK');
            setTimeout(() => {
                window.location.reload();
            }, 4000)
        }  
    });
    

    props.socket.on('startGryOdp', () => {
        setTimeout(() => {
            navigate("/Rozgrywka");
        }, 2000)
    })

    return(
        <>
            <h1>Guest</h1>
            <div id='menu'>
                
                <div id='kodLobby'>KOD<br/><b>{props.room}</b></div>
                    
                <div  id='ListaGraczy'>
                    {
                        gracze.map((ele) => {
                            return(
                                <div key={ele.id} id='jedenGracz'>{ele.nick}</div>
                            )
                        })
                    }
                </div>

                
            </div>

            <DisGracza id='DisGracza' usuGracz={usuGracz} wysDisGracza={wysDisGracza}/>
        </>
    )
}