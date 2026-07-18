/*************************************************
 SIGAP RANI V4
 profil.js
*************************************************/

window.onload = async function(){

    const user = JSON.parse(
        localStorage.getItem(CONFIG.SESSION_KEY)
    );

    if(!user){

        location="index.html";
        return;

    }

    document.getElementById("pNama").innerHTML =
        user.nama || "-";

    document.getElementById("pEmail").innerHTML =
        user.email || "-";

    document.getElementById("pMapel").innerHTML =
        user.mapel || "-";

    document.getElementById("loginTerakhir").innerHTML =
        new Date().toLocaleString("id-ID");

    await hitungStatistikGuru(user.nama);

};

async function hitungStatistikGuru(namaGuru){

    try{

        const hasil = await postAPI({

            action:"laporan"

        });

        if(!hasil.status){

            return;

        }

        let total = 0;
        let hariIni = 0;

        const hari =
            new Date().toISOString().substring(0,10);

        hasil.data.forEach(function(d){

            if(String(d.guru).trim()==String(namaGuru).trim()){

                total++;

                if(String(d.tanggal).indexOf(hari)>=0){

                    hariIni++;

                }

            }

        });

        document.getElementById("totalScan").innerHTML =
            total;

        document.getElementById("scanHariIni").innerHTML =
            hariIni;

    }catch(err){

        console.log(err);

    }

}
