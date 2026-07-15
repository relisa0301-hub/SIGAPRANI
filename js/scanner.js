let scanner;

function mulaiScanner(){

scanner=new Html5Qrcode("reader");

scanner.start(

{

facingMode:"environment"

},

{

fps:10,

qrbox:250

},

berhasilScan

);

}

async function berhasilScan(qr){

scanner.pause();

document.getElementById("hasil").innerHTML=

"Memproses...";

const user=JSON.parse(

localStorage.getItem(

CONFIG.SESSION_KEY

)

);

const kelas=document.getElementById("kelas").value;

const mapel=document.getElementById("mapel").value;

const hasil=await postAPI({

action:"scan",

guru:user.nama,

kelas:kelas,

mapel:mapel,

qr:qr

});

document.getElementById("hasil").innerHTML=

hasil.message;

setTimeout(()=>{

scanner.resume();

},3000);

}
