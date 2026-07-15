function cekLogin(){

const user=JSON.parse(

localStorage.getItem(

CONFIG.SESSION_KEY

)

);

if(user==null){

window.location="index.html";

return;

}

document.getElementById("namaGuru").innerHTML=

"Selamat Datang<br>"+user.nama;

document.getElementById("mapelGuru").innerHTML=

"Mata Pelajaran : "+user.mapel;

}

function logout(){

localStorage.removeItem(

CONFIG.SESSION_KEY

);

window.location="index.html";

}
