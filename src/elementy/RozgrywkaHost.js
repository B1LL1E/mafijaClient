import { useEffect, useState } from "react";
import './Rozgrywka.css';


export default function RozgrywkaHost(props) {

    //losowanie klas
    const losowanieKlass = () => {
        
        let klasy = ['Ochroniarz', 'Policja', 'Debil', 'Haker'];

        let iloscGraczy = props.gracze.length;
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
            props.socket.emit('twojaRola', props.gracze[i].id, klasy[nrKlasy]);
            klasy = klasy.filter((ele) => ele !== klasy[nrKlasy]);
            // console.log(klasy);
        }    
        
    };

    //rozpoczaencie losowania
    const [twojaKlasa, setTwojaKlasa] = useState('');
    useEffect(() => {
        losowanieKlass();
    }, [])

    let nrGracza = 0;
    let nrGracza1= 0;


    //wybieranie gracza
    const [selectGracz, setSelectGracz] = useState('');
    const [selectedGraczNick, setSelectGraczNick] = useState('');
    const [starygracz, setStarygracz] = useState('')
    const [pierwszyRaz, setPierwszyRaz] = useState('TAK')
    const [wysPowtwierdzenie, setWysPowtwierdzenie] = useState('');
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
    // useEffect(() => {
    //     console.log(selectGracz);
    // }, [selectGracz])



     
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
    //sprawdza czy liczba glosow wynosi 0
    useEffect(() => {
        if(liczbaGlosow === 0){
            document.getElementById('liczbaGlosow').style.display = 'none';
        }
        else{
            document.getElementById('liczbaGlosow').style.display = 'block';
        }
    }, [liczbaGlosow]);



    let iloGra = props.gracze.length;
    // let mojeID = props.gracze[0].id;
    const [glosyGracze, setGlosyGracze] = useState(new Array(iloGra).fill({id: 'puste', glosy: 0}));
 



    //wypisanie wszystkich graczy i ustawienie do glosow
    useEffect(() => {
        setTimeout(() => {
            let mojawartosc = [...glosyGracze];     
            // console.log(glosyGracze);
            // console.log(props.gracze[0].id);
            for(let x = 0; x < iloGra; x++){
                mojawartosc[x] = {id: props.gracze[x].id, glosy: 0} ;
                // console.log(props.gracze[x].id);
            }
            props.socket.emit('liczbaGlosow', mojawartosc, props.room);
            setGlosyGracze(mojawartosc);
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

                setGlosyGracze(wartosc);   
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

                setGlosyGracze(wartosc);
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
    }, [wysBlokada])



    //disconnect



    //sprawdzenie czy wszyscy gracze zaglosowali
    // useEffect(() => {
    //     if(liczbaGlosow === iloGra){

    //     }
    // }, [liczbaGlosow])

    return(
        <>
            <h1>RozgrywkaHOST</h1>
            <h1>{twojaKlasa}</h1>

            <div id='grupa'>
                <div id='kolo'>
                    {
                        props.gracze.map((gracz) => {
                            nrGracza++;
                            return(    
                                <>  
                                    <div id={'graczNr' + nrGracza} className={'graczNr' + nrGracza} onClick={wybierz} style={{'--rot':nrGracza}} data-id={gracz.id} data-nick={gracz.nick} data-licGlo={0}>{gracz.nick}</div>
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

            
            
        </>
    )
}