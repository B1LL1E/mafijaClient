import React ,{ useEffect, useState } from "react";
import './Guest.css';
import DisGracza from "./DisGracza";
import { useNavigate } from "react-router-dom";


export default function Guest(props) {
    
    const navigate = useNavigate();

    //lista graczy
    const [gracze, setGracze] = useState([]);
    const [twojeID, setTwojeID] = useState('');
    let twojeID1 = '';
    useEffect(() => {
        console.log(props.socket.id);
    }, []);

    props.socket.on('connect', () => {
        setTwojeID(props.socket.id);
        twojeID1 = props.socket.id;
    });

    //nick gracza
    const mojNick = props.mojNick;

    //dołaczanie
    useEffect(() => {
        props.socket.emit('dolacz', props.room, mojNick);
    }, [])
    
 
    

    const [liczbaGraczy, setLiczbaGraczy] = useState(0);
    //sprawdza czy jest 4 graczy
    useEffect(() => {
        if(gracze.length < 4){
            setLiczbaGraczy(props.gracze.length + ' / 8, min 4');
        }
        else{
            //pojawia start
            setLiczbaGraczy(props.gracze.length);
        }
        
    }, [props.gracze]);



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
    }, []);
  
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
        else{
            setWysDisGracza('TAK');
        }
        setTimeout(() => {
            setWysDisGracza('NIE');
        }, 5000);
    });
    useEffect(() => {
        if(wysDisGracza === 'TAK'){
            setTimeout(() => {
                document.getElementById('DisGracza').style.opacity = '100%';
            }, 200);
            document.getElementById('DisGracza').style.display = 'block';
        } 
        else{
            setTimeout(() => {
                document.getElementById('DisGracza').style.display = 'none';
            }, 200)
            document.getElementById('DisGracza').style.opacity = '0%';
        }
        
    }, [wysDisGracza])
    // const [usuGracz, setUsunGracz] = useState('');
    // let usuGraczID = '';
    // const [wysDisGracza, setWysDisGracza] = useState('NIE');
    // props.socket.on('usun', (gracz) => {
    //     if(gracz !== undefined){
    //         setUsunGracz(gracz.nick); 
    //         usuGraczID = gracz.id;
    //         // console.log(usuGraczID);
    //         // console.log(hostID);
    //         if(usuGraczID === hostID){
    //             setWysDisGracza('TAK');
    //             setTimeout(() => {
    //                 window.location.reload();
    //             }, 4000)
    //             alert('tutaj');
    //         }  
    //         else{
    //             setWysDisGracza('TAK');
    //             setTimeout(() => {

    //             }, 4000);
    //         }
    //     }  
    // });
    

    props.socket.on('startGryOdp', () => {
        setTimeout(() => {
            navigate("/Rozgrywka");
        }, 2000)
    })




    const [rozPok, setRozPok] = useState('xXxXxX');
    //sprawdza czy dolaczono
    props.socket.on('rozlaczOdp', (room, id1) => {
        props.socket.disconnect();
        console.log('rozlaczODP ' + room + ' ' + id1);
        setRozPok(room);

        document.getElementById('rozloczono').style.display = 'block'; 
        setTimeout(() => {
            window.location.reload();
        }, 5000);
        console.log(id1);
        console.log(twojeID1);
    });





    //sprawdza czy jest 4 graczy
    useEffect(() => {
        if(gracze.length < 4){
            //znika start
            setLiczbaGraczy(gracze.length + ' / 8, min 4');
            document.getElementById('liczbaGraczy').style.color = 'red';
        }
        else{
            //pojawia start
            setLiczbaGraczy(gracze.length + ' / 8');
            document.getElementById('liczbaGraczy').style.color = 'black';
        }
    }, [gracze]);





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

            <div id='liczbaGraczy'>
                <div id='liczbaGraczy1'>Liczba graczy</div>
                {liczbaGraczy}
            </div>

            <DisGracza id='DisGracza' usuGracz={usuGracz} wysDisGracza={wysDisGracza}/>


            <div id='rozloczono'>
                <div id='rozloczono1'>
                    Nie udało się połaczyc z <br/>{rozPok}<br/>
                    Za chwile przeniesiemy cię spowrotem
                </div>
            </div>
        </>
    )
}