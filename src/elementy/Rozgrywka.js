import { useEffect, useState } from "react";
import './Rozgrywka.css';
import DisGracza from "./DisGracza";
import './DisGracza.css';

export default function Rozgrywka(props) {


    //odbieranie klasy
    const [twojaKlasa, setTwojaKlasa] = useState('');
    props.socket.on('twojaRolaOdp', (nazwaKlasy) => {
        console.log(nazwaKlasy);
        setTwojaKlasa(nazwaKlasy);
    })




    let nrGracza = 0;
    let nrGracza1= 0;

    //wybieranie gracza
    const [selectGracz, setSelectGracz] = useState('');
    const [selectedGraczNick, setSelectGraczNick] = useState('');
    const [starygracz, setStarygracz] = useState('')
    const [pierwszyRaz, setPierwszyRaz] = useState('TAK')
    const [wysPowtwierdzenie, setWysPowtwierdzenie] = useState('NIE');
    const wybierz = async (e) => {
        if(pierwszyRaz === 'TAK'){
            setPierwszyRaz('NIE');
            setStarygracz(e.currentTarget.id);
            document.getElementById(e.currentTarget.id).id = 'selectedGracz';
            setSelectGracz(e.target.getAttribute('data-id'));
            setSelectGraczNick(e.target.getAttribute('data-nick'));
        }
        else{
            document.getElementById('selectedGracz').id = starygracz;
            setStarygracz(e.currentTarget.id);
            document.getElementById(e.currentTarget.id).id = 'selectedGracz';
            setSelectGracz(e.target.getAttribute('data-id')); 
            setSelectGraczNick(e.target.getAttribute('data-nick'));
        }
        
        setWysPowtwierdzenie('TAK');
    }




     
    //wyswietla przycisk potwierdzenia
    useEffect(() => {   
        if(wysPowtwierdzenie === 'TAK'){
            document.getElementById('potwierdzenie').style.display = 'inline-block';
            setTimeout(() => {
                document.getElementById('potwierdzenie').style.opacity = '100%';
            }, 100) 
        }
        else{
            document.getElementById('potwierdzenie').style.opacity = '0%';
            setTimeout(() => {
                document.getElementById('potwierdzenie').style.display = 'none';
            }, 100) 
            setSelectGracz('');
            setPierwszyRaz('TAK');
            if(pierwszyRaz === 'NIE'){
                document.getElementById('selectedGracz').id = starygracz;
            }
        }
    }, [wysPowtwierdzenie])



    





    //liczba glosow
    const [liczbaGlosow, setLiczbaGlosow] = useState(0);
    let iloGra = props.gracze.length;
    const [glosyGracze, setGlosyGracze] = useState(new Array(iloGra).fill({id: 'puste', glosy: 0}));
    //obieranie glosow
    props.socket.on('liczbaGlosowOdp', (glosy) => {
        setGlosyGracze([...glosy]);
        console.log(glosy);
    });
    //setLiczbaGlosow(licGlo);
    props.socket.on('iloscGlosujacychOdp', (liczGlosujacych) => {
        setLiczbaGlosow(liczGlosujacych);
    });
    


    //sprawdza czy liczba glosow wynosi 0
    useEffect(() => {
        if(liczbaGlosow === 0){
            document.getElementById('liczbaGlosow').style.display = 'none';
        }
        else{
            document.getElementById('liczbaGlosow').style.display = 'block';
        }
    }, [liczbaGlosow]);




    const [wysBlokada, setWysBlokada] = useState('NIE');
    //potwierdzenie wyboru
    const zaglosuj = () => {    
        setWysBlokada('TAK');
        let pokoj = props.room;
        props.socket.emit('Glos', selectGracz, pokoj);
        console.log('wyslij glos na ' + selectGracz);
    }
    




    //ustawianie blokady
    useEffect(() => {
        if(wysBlokada === 'TAK'){
            document.getElementById('potwierdzenie').style.opacity = '0%';
            setTimeout(() => {
                document.getElementById('potwierdzenie').style.display = 'none';
            }, 100) 

            document.getElementById('blokada').style.display = 'block'; 
            setTimeout(() => {
                document.getElementById('blokada').style.opacity = '50%';
            }, 100)
        }
        else{
            document.getElementById('blokada').style.opacity = '0%';
            setTimeout(() => {    
                document.getElementById('blokada').style.display = 'none'; 
            }, 100)
        }
    }, [wysBlokada])





    //dissconnect hosta
    let hostID = '';
    let hostNICK = '';
    useEffect(() => {
        let nrGracz = 0;
        props.gracze.map((ele) => {
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
    });


    

    const [wyrzucony, setWyrzucony] = useState('');
    //usuwa gracza z glosowania
    props.socket.on('wyrzuconoOdp', (glosy1) => {
        let wartosc = [...props.gracze];
        for(let x = 0; x < wartosc.length; x++){
            if(wartosc[x].id === glosy1.id){
                setWyrzucony(wartosc[x].nick);
                document.getElementById('wyrzuconyGracz').style.opacity = '100%';
                wartosc.splice(x, 1);
            }
        }

        props.setGracze([...wartosc]);


        let mojawartosc = [...glosyGracze]; 
        for(let x = 0; x < mojawartosc.length; x++){
            if(mojawartosc[x].id === glosy1.id){
                mojawartosc.splice(x, 1);
            }
        } 

        setGlosyGracze([...mojawartosc]);

        
        //smierc presą
        setTimeout(() => {
            document.getElementById('walec').style.top = '50%';
            document.getElementById('blokada1').style.opacity = '0%';
            setTimeout(() => {
                
                document.getElementById('wyrzuconyGracz').style.opacity = '0%';
                document.getElementById('graczNr2').classList.add = 'graczNr';
                setTimeout(() => {
                    document.getElementById('graczNr1','graczNr2','graczNr3','graczNr4','graczNr5','graczNr6','graczNr7','graczNr8').classList.remove = 'graczNr';
                }, 5000);
            }, 50);

            
            
            setTimeout(() => {
                document.getElementById('walec').style.top = '-50%';
                setWysBlokada('NIE');
                setTimeout(() => {
                    document.getElementById('blokada1').style.opacity = '100%';
                }, 3000)
            },2000);
        }, 1000)

        document.getElementById('selectedGracz').id = starygracz;
        setPierwszyRaz('TAK');
        setLiczbaGlosow(0);
    });



    return(
        <>
            <h1>Rozgrywka</h1>
            <h1>{twojaKlasa}</h1>

            <div id='grupa'>
                <div id='kolo'>
                    {
                        props.gracze.map((gracz) => {
                            nrGracza++;
                            return(    
                                <>
                                    <div id={'graczNr' + nrGracza} className={'graczNr' + nrGracza} onClick={wybierz} style={{'--rot':nrGracza}} data-id={gracz.id} data-nick={gracz.nick}>{gracz.nick}</div>
                                </>
                            )
                        })
                    }

                    { 
                        glosyGracze.map((ele) => {
                            nrGracza1++;
                            return(
                                <div id='mojeGlosy' className={'graczNrGlosy' + nrGracza1}>
                                    {ele.glosy}
                                </div>
                            )
                        })
                    }

                    <div id='wyrzuconyGracz'>{wyrzucony}</div>
                </div>
            </div>

            <div id='potwierdzenie'>
                <div id='wybrany'>{selectedGraczNick}</div>

                <div id='potwierdzenie1'>   
                    <div id='potNapis1' onClick={zaglosuj}>✔</div>
                    <div id='potNapis2' onClick={() => setWysPowtwierdzenie('NIE')}>✖</div>
                </div>
            </div>

            <div id='liczbaGlosow'>
                {liczbaGlosow}/{nrGracza}
            </div>

            <div id='blokada'>
                <div id='blokada1'>
                    🔒
                </div>
            </div>

            <div id='walec'>
                <div id='walecSciana' style={{ '--x':1 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':2 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':3 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':4 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':5 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':6 }}><div id='walecImg'></div></div>
            </div>

            <DisGracza id='DisGracza' usuGracz={usuGracz} wysDisGracza={wysDisGracza}/>
            
        </>
    )
}