import { useEffect, useMemo, useState } from "react";
import './Rozgrywka.css';
import './Walec.css';
import './css/wyrzuconyGracz.css';
import './css/Noc.css';
import ListaKlas from "./ListaKlas";

// import DisGracza from "./DisGracza";
// import './DisGracza.css';

export default function RozgrywkaHost(props) {


    const [gracze ,setGracze] = useState(props.gracze);
    //dodawnia do obiektu pustej klasy
    useEffect(() => {
        let wartosc = gracze;
        for(let x = 0; x < gracze.length; x++){
            wartosc[x] = {id: wartosc[x].id, room: wartosc[x].room, nick: wartosc[x].nick, klasa: 'PUSTE' };
            
        }
        console.log(wartosc);
        setGracze(wartosc);
    }, [])

    


    //twoje ID
    const [twojeID, setTwojeID] = useState('');
    useEffect(() => {
        setTwojeID(props.socket.id);
        console.log(props.socket.id);
    }, []);


    const [iloMafia, setIloMafia] = useState(0);
    const [iloCywil, setIloCywil] = useState(0);


    //losowanie klas
    const losowanieKlass = () => {
        
        let klasy = ['Mafia1', 'Cywil1', 'Cywil2', 'Cywil3'];

        let iloscGraczy = gracze.length;
        let iloscKlas = klasy.length;
        let nrKlasy = 0;

        let iloCywil1 = 0;
        let iloMafia1 = 0;


        // Dodanie mojej klasy
        nrKlasy = Math.floor(Math.random() * iloscKlas);
        let string1 = klasy[nrKlasy];
        klasy = klasy.filter((ele) => ele !== klasy[nrKlasy]);
        string1 = string1.substring(0, string1.length - 1);
        setTwojaKlasa(string1);
        gracze[0].klasa = string1;

        if(string1 === 'Mafia'){   
            iloMafia1 = iloMafia1 + 1;
        }
        if(string1 === 'Cywil'){
            iloCywil1 = iloCywil1 + 1;
        }


        
        for(let i = 1; i < iloscGraczy; i++){
            iloscKlas = klasy.length;
            nrKlasy = Math.floor(Math.random() * iloscKlas);   
            string1 = klasy[nrKlasy];
            klasy = klasy.filter((ele) => ele !== klasy[nrKlasy]);
            string1 = string1.substring(0, string1.length - 1);



            if(string1 === 'Mafia'){   
                iloMafia1 = iloMafia1 + 1;
            }
            if(string1 === 'Cywil'){
                iloCywil1 = iloCywil1 + 1;
            }
            

            props.socket.emit('twojaRola', gracze[i].id, string1);
            gracze[i].klasa = string1;
        }   
        setIloMafia(iloMafia1); 
        setIloCywil(iloCywil1);
        
    
        console.log(iloMafia1);
        console.log(iloCywil1);
    }; 
    

    useEffect(() => {
        console.log(iloMafia);
        console.log(iloCywil);
    }, [iloMafia, iloCywil])




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
                console.log(document.getElementById('potwierdzenie').style.display);
                document.getElementById('potwierdzenie').style.display = 'none'; 
            }, 100);

            document.getElementById('blokada').style.display = 'block'; 
            setTimeout(() => {
                    document.getElementById('blokada').style.opacity = '50%'; 
            }, 100);
        }
        else{
            document.getElementById('blokada').style.opacity = '0%';
            setTimeout(() => {    
                document.getElementById('blokada').style.display = 'none'; 
            }, 100)
        }
    }, [wysBlokada])





    
    // NOC
    const czasWysNoc = 2000; //czas jak dlugo ma trwac noc 
    const wysNoc = () => {

        document.getElementById('noc').style.display = 'block';
        setTimeout(() => {
            document.getElementById('noc').style.opacity = '100%';


            setTimeout(() => {
                document.getElementById('noc').style.opacity = '0%';
                setTimeout(() => {
                    document.getElementById('noc').style.display = 'none';
                }, 2000);

                
            }, czasWysNoc);
        }, 2000);
    }
    




    const [zwyciesca, setZwyciesta] = useState('');
    const [startGry, setStartGry] = useState('NIE');
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





            //wyrzucanie graczy
            if(glosy1.glosy > glosy2.glosy){
                // console.log('wyglosowano gracza ' + glosy1.id);
                // console.log(glosyGracze);



                //gracze 
                let wartosc = gracze;
                for(let x = 0; x < wartosc.length; x++){
                    setWysBlokada('TAK');
                    if(wartosc[x].id === glosy1.id){
                        console.log();
                        setWyrzucony(wartosc[x].nick);
                        document.getElementById('wyrzuconyGracz').style.opacity = '100%';
                  
                        
                        //sprawdzanie czy host nie zostal wyglosowany
                        //JA NIE ZYJE
                        
                        // if(wartosc[x].id === twojeID){  
                        //     document.getElementById('zgon').style.opacity = '100%';
                        //     document.getElementById('blokada1').style.opacity = '0%';
                        //     document.getElementById('blokada').style.display = 'block';
                        // }



                        //odejmowanie ilosci klas
                        if(wartosc[x].klasa === 'Mafia'){
                            setIloMafia(iloMafia - 1);
                        }
                        if(wartosc[x].klasa === 'Cywil'){
                            setIloCywil(iloCywil - 1);
                        }
                        console.log(wartosc[x].klasa);

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
                        
                    }, 50);

                    
                    
                    setTimeout(() => {
                        document.getElementById('walec').style.top = '-50%';
                        



                        //sprawdza czy umarlem
                        //JA NIE ZYJE
                        if(twojeID === glosy1.id){
                            document.getElementById('zgon').style.opacity = '100%';
                            document.getElementById('blokada').style.display = 'block'; 
                            setTimeout(() => {
                                document.getElementById('blokada').style.opacity = '50%';
                            }, 100)
                            
                        }
                        else{
                            setWysBlokada('NIE');
                            setTimeout(() => {
                                document.getElementById('blokada1').style.opacity = '100%';
                            }, 3000)
                        }
                    },2000);


                    wysNoc();
                }, 1500)





                //                             glosy1, room,       gracze,   GlosyGracze
                props.socket.emit('wyrzucono', glosy1, props.room, wartosc, mojawartosc) 

                
            }


            //reset głosów
            let mojawartosc = glosyGracze; 
            for(let x = 0; x < mojawartosc.length; x++){
                mojawartosc[x].glosy = 0;
            }

            //remis z 2 os
            if(glosy1.glosy === glosy2.glosy){
                console.log('liczba glosw jest rowna z graczem ' + glosy1.id + ' oraz ' + glosy2.id);
                wysNoc();
                document.getElementById('selectedGracz').id = starygracz;

                //                                room,       gracze,   GlosyGracze
                props.socket.emit('wyrzuconoNull', props.room, gracze, mojawartosc) 
            }


            //remis z 3 os i wiecej
            if(glosy1.glosy === glosy2.glosy && glosy2.glosy === glosy3.glosy){
                console.log('pass glosowania');
                wysNoc();
                document.getElementById('selectedGracz').id = starygracz;

                //                                room,       gracze,   GlosyGracze
                props.socket.emit('wyrzuconoNull', props.room, gracze, mojawartosc) 
            }

            setWysBlokada('NIE');
            setWysPowtwierdzenie('NIE');
            setPierwszyRaz('TAK');
            setLiczbaGlosow(0);

            glosy1 = {id: 'puste', glosy: 0};
            glosy2 = {id: 'puste', glosy: 0};
            glosy3 = {id: 'puste', glosy: 0};



            setStartGry('TAK');
        }
    }, [liczbaGlosow])

    //SPRAWDZANIE ZWYCIESCY
    useEffect(() => {
        if(startGry === 'TAK'){
            console.log('MAFIA ' + iloMafia);
            console.log('MIASTO ' + iloCywil);
            if(iloCywil === iloMafia){
                console.log('mafia wygrywa');
                setZwyciesta('MAFIA');
            }
            if(iloMafia === 0){
                console.log('Miasto Wygyrwa');
                setZwyciesta('MIASTO');
            }
        }
    }, [iloCywil, iloMafia, startGry]);
    


    


    return(
        <>
            <h1>RozgrywkaHOST</h1>
            
            

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


            <div id='twojaKlasa1'>
                {twojaKlasa}<br />
                <div id='zgon'>✖</div>
                {zwyciesca}
            </div>

            <div id='noc'>
                NOC
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

            {/* <div id='twojaKlasa'>
                <div id='twojaKlasa1'>
                    {twojaKlasa}
                    <div id='zgon'>✖</div>
                </div>
                
                <div id='OpisKlasyBack'>
                    <ListaKlas twojaKlasa={twojaKlasa}/>
                </div>

                <div id='twojaKlasaStrzalka'>
                    \/
                </div>
            </div>  */}

                

            
            
        </>
    )
}