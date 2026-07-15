function cekLogin(){

const user=JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

if(user==null){

window.location="index.html";

return;

}

document.getElementById("namaGuru").innerHTML=user.nama;

document.getElementById("mapelGuru").innerHTML=user.mapel;

document.getElementById("emailGuru").innerHTML=user.email;

document.getElementById("levelGuru").innerHTML=user.level;

}

function bukaScan(){

window.location="scan.html";

}

function bukaLaporan(){

window.location="laporan.html";

}

function bukaProfil(){

window.location="profile.html";

}

function logout(){

localStorage.removeItem(CONFIG.SESSION_KEY);

window.location="index.html";

}
