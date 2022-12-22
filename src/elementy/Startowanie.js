import './Startowanie.css'
import { useState } from 'react'

export default function Startowanie() {    



    return(
        <div id='startowanie'>
            <div id='startowanieTlo'></div>
            <div id='startowanieNapis' style={{ '--i': 1}}>3</div>
            <div id='startowanieNapis' style={{ '--i': 2}}>2</div>
            <div id='startowanieNapis' style={{ '--i': 3}}>1</div>
        </div>
    )
}