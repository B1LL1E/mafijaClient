export default function KickGracz(gracze, glosy1) {
    // gracze.map((ele) => {
    //     if(glosy1.id === ele.id){

    //     }
    //     console.log(ele);
    // })
    // let nrwTabeli
    // gracze.map((ele) => {
    //     if(ele.id === glosy1.id){

    //     }
    //     nrwTabeli++;
    // });
    for(let x = 0; x < gracze.length; x++){
        if(gracze[x].id === glosy1.id){
            gracze.splice(x, 1);
            break;
        }
    }
    console.log(gracze);
    return(gracze);
}