export default function KickGracz(gracze, glosy1) {
    
    //usuwa z listy graczy po lewej gracza o id po prawej
    for(let x = 0; x < gracze.length; x++){
        if(gracze[x].id === glosy1.id){
            gracze.splice(x, 1);
        }
    }
    
    return(gracze);
}