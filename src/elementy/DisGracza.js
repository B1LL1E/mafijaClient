import './DisGracza.css'
import { useEffect } from 'react'

export default function DisGracza(props) {

    useEffect(() => {
        if(props.wysDisGracza === 'TAK'){
            document.getElementById('DisGracza').style.opacity = '100%';
        } 
    }, [props.wysDisGracza])

    return(
        <div id='DisGracza'>
            <h1>HOST {props.usuGracz} się rozłaczył</h1>
            <h1>Za moment zostaniewsz przeniesiony do lobby</h1>
        </div>
    )
}