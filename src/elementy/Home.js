import './Home.css';
import { Link } from 'react-router-dom';
import Losowanie from './Losowanie';
import { useEffect } from 'react';

export default function Home(props) {
  

    return(
        <div id='wysz'>
            <div id='wyszLeft'> 
                <span id='wysz'>Stwórz Lobby</span><br/>
                <Link to='HostLobby'><button id='wysz'>Stwórz</button></Link>
            </div>

            <div id='wyszMid'>
                <span id='wysz'>LUB</span>
            </div>

            <div id='wyszRight'>
                <span id='wysz'>Dołącz</span>
                <form>
                    <input id='wysz' type='text' value={props.room} placeholder='ID' maxLength='6' onChange={(e) => {props.setRoom(e.target.value)}}/><br/>
                    <Link to='GuestLobby'><input id='wysz'type='submit' value='Dołącz' /></Link>
                </form>
            </div>

            

        </div>
    )
}

