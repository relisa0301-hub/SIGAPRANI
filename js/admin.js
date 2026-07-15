async function loadDashboard(){

const hasil=await postAPI({

action:"dashboard"

});

document.getElementById("jumlahSiswa").innerHTML=hasil.jumlahSiswa;

document.getElementById("jumlahGuru").innerHTML=hasil.jumlahGuru;

document.getElementById("hadirHariIni").innerHTML=hasil.hadirHariIni;

document.getElementById("totalAbsensi").innerHTML=hasil.totalAbsensi;

}

function logout(){

localStorage.removeItem(CONFIG.SESSION_KEY);

window.location="index.html";

}
