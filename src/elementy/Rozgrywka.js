import { useEffect } from "react";

export default function Rozgrywka(props) {

    useEffect(() => {

    })

    return(
        <>
            
            <div id='ListaGraczy'>
                {props.gracze.map((gracz) => {
                    return(
                        <div id='jedenGracz'>{gracz.nick}</div>
                    );
                })}        
            </div>
        </>
    )
}