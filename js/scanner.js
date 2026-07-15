let scanner;

async function mulaiScanner(){

const user=JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

if(user==null){

window.location="index.html";

return;

}

document.getElementById("mapel").innerHTML=

"<option value='"+user.mapel+"'>"+user.mapel+"</option>";

const kelas=await postAPI({

action:"kelas"

});

let html="<option value=''>Pilih Kelas</option>";

kelas.data.forEach(function(k){

html+="<option value='"+k.kode+"'>"+k.nama+"</option>";

});

document.getElementById("kelas").innerHTML=html;

let jam="";

for(let i=1;i<=10;i++){

jam+="<option value='"+i+"'>Jam "+i+"</option>";

}

document.getElementById("jam").innerHTML=jam;

scanner=new Html5Qrcode("reader");

scanner.start(

{facingMode:"environment"},

{

fps:10,

qrbox:250

},

scanBerhasil

);

}

async function scanBerhasil(qr){

scanner.pause();

const user=JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

const hasil=await postAPI({

action:"scan",

guru:user.nama,

mapel:user.mapel,

kelas:document.getElementById("kelas").value,

jam:document.getElementById("jam").value,

qr:qr

});

document.getElementById("hasil").innerHTML=hasil.message;

setTimeout(()=>{

scanner.resume();

},2500);

}
