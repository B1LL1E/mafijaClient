import './css/ListaKlas.css';

export default function ListaKlas(props) {

    if(props.twojaKlasa === 'Mafia'){
        return(
            <>
                <div id='OpisKlasy'>
                    Cel: Zabić pozostałych graczy
                </div>
            </>
        )
    }
    
    if(props.twojaKlasa === 'Cywil'){
        return(
            <>
                <div id='OpisKlasy'>
                    Cel: Wyglosować wszystkich morderców
                </div>
            </>
        )
    }

    if(props.twojaKlasa === ''){
        return(
            <>
                <div id='OpisKlasy'>

                </div>
            </>
        )
    }
}