import { useState } from "react";
import './WysNick.css'

export default function WysNick(props) {

    //wyswietlanie nicku na gorze strony
    const predkoscWypisywania = 45; 
    const NapisPrzedNazwa = 'Witaj '


    const [wysZmienNick, setWysZmienNick] = useState('NIE');
    const zmienNick = () => {
        

        if(wysZmienNick === 'TAK'){
            document.getElementById('WysNick').style.bottom = '50%'
            setWysZmienNick('NIE');
        }else{
            document.getElementById('WysNick').style.bottom = '-50%'
            setWysZmienNick('TAK'); 
        }
    }

    const [wysNick,setWysNick] = useState(NapisPrzedNazwa);
    const wypisywanieNicku = (e) => {
        e.preventDefault();

        zmienNick();
        setTimeout(() => {  
        
            if(wysNick !== (NapisPrzedNazwa + props.mojNick)){
                let dlugosc = props.mojNick.length;
                let liczbaWyk = 0;
                let wyraz = NapisPrzedNazwa
                
                if(wysNick === NapisPrzedNazwa){        
                let mojInterval = setInterval(() => {
                    wyraz = wyraz + props.mojNick.substring(liczbaWyk, liczbaWyk+1);
                    liczbaWyk++;
                    setWysNick(wyraz);
                    if(liczbaWyk === dlugosc){
                    clearInterval(mojInterval);
                    }
                }, predkoscWypisywania)
                }
                else{
                    wyraz =  wysNick;
                    liczbaWyk = wysNick.length - 6;
                    let mojInterval1 = setInterval(() => {
                        wyraz = wyraz.substring(0, wyraz.length - 1);
                        liczbaWyk--;
                        setWysNick(wyraz);
                        if(liczbaWyk === 0){  
                            clearInterval(mojInterval1);
                            let mojInterval = setInterval(() => {
                            wyraz = wyraz + props.mojNick.substring(liczbaWyk, liczbaWyk+1);
                            liczbaWyk++;
                            setWysNick(wyraz);
                            if(liczbaWyk === dlugosc){
                                clearInterval(mojInterval);
                            }
                        }, predkoscWypisywania)
                        }
                    }, predkoscWypisywania); 
                }
            }
        }, 500)  
    };

    

    return(
        <>
            <div id='przerwa'></div>
            <div id='WysNick'>
                <form>
                    <input id='WysNick' type='text' maxLength='16' placeholder='NICK' value={props.mojNick} onChange={(e) => {props.setMojNick(e.target.value)}}/><br/>
                    <button id='WysNick' onClick={wypisywanieNicku}>USTAW NICK</button>  
                </form> 
            </div>
            <h1 id='WysNick' onClick={zmienNick}>{wysNick}</h1>
            <span id='WysNick' >Naciśnij na nick, aby zmień</span>
            
        </>
    )
};
