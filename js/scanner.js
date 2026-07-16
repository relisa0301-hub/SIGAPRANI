let scanner;

async function mulaiScanner(){

const user=JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

if(user==null){

window.location="index.html";

return;

}

document.getElementById("mapel").innerHTML=

"<option value='"+user.mapel+"'>"+user.mapel+"</option>";

const kelas = await getAPI("kelas");
alert("API KELAS DIPANGGIL");
alert(JSON.stringify(kelas));
alert(JSON.stringify(kelas));
let isi="<option value=''>Pilih Kelas</option>";

kelas.data.forEach(function(k){

isi+="<option value='"+k.nama+"'>"+k.nama+"</option>";

});

document.getElementById("kelas").innerHTML=isi;

let jam="";

for(let i=1;i<=10;i++){

jam+="<option value='"+i+"'>Jam Pelajaran "+i+"</option>";

}

document.getElementById("jam").innerHTML=jam;

scanner=new Html5Qrcode("reader");

scanner.start(

{

facingMode:"environment"

},

{

fps:10,

qrbox:250

},

scanBerhasil

);

}

async function scanBerhasil(qr){

scanner.pause();

document.getElementById("hasil").innerHTML="Memproses...";

const user=JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

const hasil=await postAPI({

action:"scan",

qr:qr,

kelas:document.getElementById("kelas").value,

jam:document.getElementById("jam").value,

guru:user.nama,

mapel:user.mapel

});

document.getElementById("hasil").innerHTML=hasil.message;

setTimeout(function(){

scanner.resume();

},3000);

}
