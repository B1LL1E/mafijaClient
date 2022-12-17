import './Home.css';
import { Link } from 'react-router-dom';

export default function Home(props) {
    return(
        <div id='wysz'>
            <div id='wyszLeft'> 
                <span id='wysz'>Stwórz Lobby</span><br/>
                <Link to='joined'><button id='wysz'>Stwórz</button></Link>
            </div>

            <div id='wyszMid'>
                <span id='wysz'>LUB</span>
            </div>

            <div id='wyszRight'>
                <span id='wysz'>Dołącz</span>
                <form>
                <input id='wysz' type='text' placeholder='ID' maxLength='6'/><br/>
                <input id='wysz'type='submit' value='Dołącz' />
                </form>
            </div>
        </div>
    )
}