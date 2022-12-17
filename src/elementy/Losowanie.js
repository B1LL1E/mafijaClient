export default function Losowanie() {
    let resultat = '';
    let znaki = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let dluZnaki = znaki.length;
    for(let y = 0; y < 6; y++){
        resultat += znaki.charAt(Math.floor(Math.random() * dluZnaki));
    }
    return(resultat);     
}