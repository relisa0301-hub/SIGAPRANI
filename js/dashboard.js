/************************************************
 SIGAP RANI V4
 dashboard.js
 Aman untuk Scan, Laporan & Profil
************************************************/

function cekLogin(){

    const guru = JSON.parse(
        localStorage.getItem(CONFIG.SESSION_KEY)
    );

    if(!guru){

        location="index.html";
        return;

    }

    tampilDashboard(guru);

}

function tampilDashboard(guru){

    // ==========================
    // DATA GURU
    // ==========================

    document.getElementById("namaGuru").innerHTML =
        guru.nama || "-";

    document.getElementById("mapelGuru").innerHTML =
        guru.mapel || "-";

    document.getElementById("kelasGuru").innerHTML =
        guru.kelas || "-";


    // ==========================
    // SAPAAN
    // ==========================

    const jam = new Date().getHours();

    let salam = "Selamat Datang";

    if(jam < 11){

        salam = "🌞 Selamat Pagi";

    }else if(jam < 15){

        salam = "☀️ Selamat Siang";

    }else if(jam < 18){

        salam = "🌤 Selamat Sore";

    }else{

        salam = "🌙 Selamat Malam";

    }

    document.getElementById("sapaan").innerHTML =
        salam + ", " + (guru.nama || "Guru");


    // ==========================
    // JAM REALTIME
    // ==========================

    updateJam();

    setInterval(updateJam,1000);

}


function updateJam(){

    const sekarang = new Date();

    const hari = [

        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"

    ];

    const bulan = [

        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"

    ];

    const tanggal =
        hari[sekarang.getDay()] +
        ", " +
        sekarang.getDate() +
        " " +
        bulan[sekarang.getMonth()] +
        " " +
        sekarang.getFullYear();

    document.getElementById("tanggalHari").innerHTML =
        tanggal;

    const jam =
        String(sekarang.getHours()).padStart(2,"0");

    const menit =
        String(sekarang.getMinutes()).padStart(2,"0");

    const detik =
        String(sekarang.getSeconds()).padStart(2,"0");

    document.getElementById("jamSekarang").innerHTML =
        jam + ":" + menit + ":" + detik;

}


// ====================================
// MENU
// ====================================

function bukaScan(){

    location="scan.html";

}

function bukaLaporan(){

    location="laporan.html";

}

function bukaProfil(){

    location="profil.html";

}

function logout(){

    localStorage.removeItem(CONFIG.SESSION_KEY);

    location="index.html";

}
