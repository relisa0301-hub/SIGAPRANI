/*************************************************
 SIGAP RANI V4
 profil.js
*************************************************/

window.onload = function () {

    loadProfil();

};

function loadProfil() {

    const user = JSON.parse(
        localStorage.getItem(CONFIG.SESSION_KEY)
    );

    if (!user) {

        window.location = "index.html";
        return;

    }

    document.getElementById("pNama").innerHTML =
        user.nama || "-";

    document.getElementById("pEmail").innerHTML =
        user.email || "-";

    document.getElementById("pMapel").innerHTML =
        user.mapel || "-";

    document.getElementById("pStatus").innerHTML =
        "<span style='color:green;font-weight:bold'>Aktif</span>";

    hitungStatistikGuru(user.nama);

}

async function hitungStatistikGuru(namaGuru){

    try{

        const hasil = await postAPI({

            action:"laporan"

        });

        if(!hasil.status){

            return;

        }

        let hariIni = 0;
        let total = 0;

        const hari =
            new Date().toLocaleDateString("en-CA");

        hasil.data.forEach(function(d){

            if(String(d.guru).trim()==String(namaGuru).trim()){

                total++;

                if(String(d.tanggal).indexOf(hari)>=0){

                    hariIni++;

                }

            }

        });

        document.getElementById("scanHariIni").innerHTML =
            hariIni;

        document.getElementById("totalScan").innerHTML =
            total;

    }catch(e){

        console.log(e);

    }

}
