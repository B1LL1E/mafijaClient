import { useEffect, useMemo, useState } from "react";
import './Rozgrywka.css';
import './Walec.css';
import './css/wyrzuconyGracz.css';

import DisGracza from "./DisGracza";
import './DisGracza.css';

export default function RozgrywkaHost(props) {

    const [gracze ,setGracze] = useState(props.gracze);


    //twoje ID
    const [twojeID, setTwojeID] = useState('');
    useEffect(() => {
        setTwojeID(props.socket.id);
        console.log(props.socket.id);
    }, []);


    //losowanie klas
    const losowanieKlass = () => {
        
        let klasy = ['Ochroniarz', 'Policja', 'Debil', 'Haker'];

        let iloscGraczy = gracze.length;
        // console.log(iloscGraczy);
        let iloscKlas = klasy.length;
        let nrKlasy = 0;

        // console.log(klasy); 
        nrKlasy = Math.floor(Math.random() * iloscKlas);
        setTwojaKlasa(klasy[nrKlasy]);
        klasy = klasy.filter((ele) => ele !== klasy[nrKlasy]);
        // console.log(klasy);

        for(let i = 1; i < iloscGraczy; i++){
            iloscKlas = klasy.length;
            nrKlasy = Math.floor(Math.random() * iloscKlas);   
            props.socket.emit('twojaRola', gracze[i].id, klasy[nrKlasy]);
            klasy = klasy.filter((ele) => ele !== klasy[nrKlasy]);
            // console.log(klasy);
        }    
        
    };

    //rozpoczaencie losowania
    const [twojaKlasa, setTwojaKlasa] = useState('');
    useEffect(() => {
        setTimeout(() => {
            losowanieKlass();
        }, 2000);

        console.log('list of players');
        console.log(props.listOfPlayers);
    }, [])

    let nrGracza = 0;
    let nrGracza1= 0;


    //wybieranie gracza
    const [selectGracz, setSelectGracz] = useState('');
    const [selectedGraczNick, setSelectGraczNick] = useState('');
    const [starygracz, setStarygracz] = useState('')
    const [pierwszyRaz, setPierwszyRaz] = useState('TAK')
    const [wysPowtwierdzenie, setWysPowtwierdzenie] = useState('NIE');
    const wybierz = (e) => {
        console.log('WYBIERZ');
        console.log(wysPowtwierdzenie);
        setWysPowtwierdzenie('TAK');
        if(pierwszyRaz === 'TAK'){
            setPierwszyRaz('NIE');
            setStarygracz(e.currentTarget.id);
            document.getElementById(e.currentTarget.id).id = 'selectedGracz';
            setSelectGracz(e.target.getAttribute('data-id'));
            setSelectGraczNick(e.target.getAttribute('data-nick'));

            console.log('dziala');
        }
        else{
            document.getElementById('selectedGracz').id = starygracz;
            setStarygracz(e.currentTarget.id);
            document.getElementById(e.currentTarget.id).id = 'selectedGracz';
            setSelectGracz(e.target.getAttribute('data-id')); 
            setSelectGraczNick(e.target.getAttribute('data-nick'));

            console.log('nie dziala');
        }  
        console.log('---');  
    }
    // useEffect(() => {
    //     console.log(selectGracz);
    // }, [selectGracz])



     
    //wyswietla przycisk potwierdzenia
    useEffect(() => {   
        console.log('WYSPOTW')
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
    //sprawdza czy liczba glosow wynosi 0
    useEffect(() => {
        if(liczbaGlosow === 0){
            document.getElementById('liczbaGlosow').style.display = 'none';
        }
        else{
            document.getElementById('liczbaGlosow').style.display = 'block';
        }
    }, [liczbaGlosow]);



    let iloGra = gracze.length;
    const [glosyGracze, setGlosyGracze] = useState(new Array(iloGra).fill({id: 'puste', glosy: 0}));
 



    //wypisanie wszystkich graczy i ustawienie do glosow
    useEffect(() => {
        setTimeout(() => {
            let mojawartosc = [...glosyGracze];     
            // console.log(glosyGracze);
            // console.log(gracze[0].id);
            for(let x = 0; x < iloGra; x++){
                mojawartosc[x] = {id: gracze[x].id, glosy: 0} ;
                // console.log(gracze[x].id);
            }
            props.socket.emit('liczbaGlosow', mojawartosc, props.room);
            setGlosyGracze([...mojawartosc]);
        }, 100);
    }, [])
    
    

    
    //nowyGlos
    props.socket.off('GlosOdp').on('GlosOdp', (nowyGlos) => {
        // console.log(props.socket.id);
        // console.log('mam');
        setLiczbaGlosow(liczbaGlosow + 1);

        let wartosc = glosyGracze;

        for(let x = 0; x < iloGra; x++){
            // console.log('tutaj');
            // console.log(wartosc[x].id);
            if(wartosc[x].id === nowyGlos){
                wartosc[x] = {id: nowyGlos, glosy: wartosc[x].glosy + 1};

                console.log('wyslalem nowe glosy');
                console.log(wartosc[x]);

                setGlosyGracze([...wartosc]);   
            }         
        }
        props.socket.emit('liczbaGlosow', wartosc, props.room);
    });
    useEffect(() => {
        props.socket.emit('iloscGlosujacych', liczbaGlosow, props.room);
    }, [liczbaGlosow])


    

    const [wysBlokada, setWysBlokada] = useState('NIE');

    //potwierdzenie wyboru oraz ustawianie glosu dla hosta
    const zaglosuj = () => {
        setWysBlokada('TAK');
        setLiczbaGlosow(liczbaGlosow + 1);

        let wartosc = glosyGracze;

        for(let x = 0; x < iloGra; x++){
            // console.log(wartosc[0].id);
            // console.log(selectGracz);
            if(wartosc[x].id === selectGracz){
                wartosc[x] = {id: selectGracz, glosy: wartosc[x].glosy + 1};

                props.socket.emit('liczbaGlosow', wartosc, props.room); 
                console.log('wyslalem nowe glosy');

                setGlosyGracze([...wartosc]);
                console.log(wartosc[x]);
            }
        } 
        
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



    

    const [wyrzucony, setWyrzucony] = useState('');
    //sprawdzenie czy wszyscy gracze zaglosowali
    useEffect(() => {
        let glosy1 = {id: 'puste', glosy: 0};
        let glosy2 = {id: 'puste', glosy: 0};
        let glosy3 = {id: 'puste', glosy: 0};

        if(liczbaGlosow === iloGra){
            console.log('wszyscy zaglosowali');
            for(let x = 0; x < glosyGracze.length; x++){
                if(glosyGracze[x].glosy > glosy1.glosy){
                    glosy1 = {id: glosyGracze[x].id, glosy: glosyGracze[x].glosy}
                }
                else if(glosyGracze[x].glosy === glosy1.glosy){
                    glosy2 = {id: glosyGracze[x].id, glosy: glosyGracze[x].glosy}
                }
                else if(glosyGracze[x].glosy === glosy2.glosy){
                    glosy3 = {id: glosyGracze[x].id, glosy: glosyGracze[x].glosy}
                    break;
                }
            }
            // console.log('najwicej glosow ma')
            // console.log(glosy1);
            // console.log(glosy2);
            // console.log(glosy3);


            //wyrzucanie graczy
            if(glosy1.glosy > glosy2.glosy){
                // console.log('wyglosowano gracza ' + glosy1.id);
                // console.log(glosyGracze);

                //gracze
                let wartosc = gracze;
                for(let x = 0; x < wartosc.length; x++){
                    if(wartosc[x].id === glosy1.id){
                        console.log();
                        setWyrzucony(wartosc[x].nick);
                        document.getElementById('wyrzuconyGracz').style.opacity = '100%';
                        wartosc.splice(x, 1);
                    }
                }
                setGracze([...wartosc]);

                
                //lista glosow
                let mojawartosc = glosyGracze; 
                for(let x = 0; x < mojawartosc.length; x++){
                    mojawartosc[x].glosy = 0;
                    if(mojawartosc[x].id === glosy1.id){
                        mojawartosc.splice(x, 1);
                    }
                } 

                setGlosyGracze([...mojawartosc]);
                console.log(wartosc);
                console.log(mojawartosc);
                


                // smierc, wlaniecie presą
                setTimeout(() => {
                    document.getElementById('walec').style.top = '50%';
                    document.getElementById('blokada1').style.opacity = '0%';
                    setTimeout(() => {
                        setWyrzucony('');
                        document.getElementById('wyrzuconyGracz').style.opacity = '0%';
                        // document.getElementById('graczNr2').classList.add = 'graczNr';
                        // setTimeout(() => {
                        //     document.getElementById('graczNr1','graczNr2','graczNr3','graczNr4','graczNr5','graczNr6','graczNr7','graczNr8').classList.remove = 'graczNr';
                        // }, 5000);
                    }, 50);

                    
                    
                    setTimeout(() => {
                        document.getElementById('walec').style.top = '-50%';
                        
                        
                        if(twojeID === glosy1.id){
                            // document.getElementById('kolo').style.opacity = '50%';
                            document.getElementById('zgon').style.opacity = '100%';
                        }
                        else{
                            setWysBlokada('NIE');
                            setTimeout(() => {
                                document.getElementById('blokada1').style.opacity = '100%';
                            }, 3000)
                        }
                    },2000);


                    
                }, 1500)

                //                             glosy1, room,       gracze,   GlosyGracze
                props.socket.emit('wyrzucono', glosy1, props.room, wartosc, mojawartosc) 
            }

            if(glosy1.glosy === glosy2.glosy){
                console.log('liczba glosw jest rowna z graczem ' + glosy1.id + ' oraz ' + glosy2.id);
                
            }

            if(glosy1.glosy === glosy2.glosy && glosy2.glosy === glosy3.glosy){
                console.log('pass glosowania');
            }

            setWysPowtwierdzenie('NIE');
            setPierwszyRaz('TAK');
            setLiczbaGlosow(0);
        }
    }, [liczbaGlosow])
    
    


    


    return(
        <>
            <h1>RozgrywkaHOST</h1>
            
            <div id='twojaKlasa'>
                {twojaKlasa}
                <div id='zgon'>✖</div>
            </div> 

            <div id='grupa'>
                <div id='koloBack'></div> 
                <div id='kolo'>
                    {                  
                        gracze.map((gracz) => {
                            nrGracza++;
                            return(    
                                <>  
                                    <div key={gracz.id}  id={'graczNr' + nrGracza} className={'graczNr' + nrGracza}  onClick={wybierz} style={{'--rot':nrGracza}} data-id={gracz.id} data-nick={gracz.nick} data-licGlo={0}>{gracz.nick}</div>
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


            <div id='noc'>
                NOC
            </div>


            <div id='walec'>
                <div id='walecSciana' style={{ '--x':1 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':2 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':3 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':4 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':5 }}><div id='walecImg'></div></div>
                <div id='walecSciana' style={{ '--x':6 }}><div id='walecImg'></div></div>
            </div>

            
            
        </>
    )
}