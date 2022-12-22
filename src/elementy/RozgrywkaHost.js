import { useEffect } from "react";

export default function RozgrywkaHost(props) {

    useEffect(() => {
        
    })

    return(
        <>
            <h1>RozgrywkaHost</h1>
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