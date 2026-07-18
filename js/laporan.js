/*************************************************
 SIGAP RANI V4
 laporan.js
 Tidak mengganggu Scanner QR
*************************************************/

let semuaData = [];
let dataFilter = [];

window.onload = function () {

    loadLaporan();

};

async function loadLaporan() {

    try {

        const hasil = await postAPI({

            action: "laporan"

        });

        if (!hasil.status) {

            alert("Data laporan gagal dimuat");

            return;

        }

        semuaData = hasil.data;
        dataFilter = hasil.data;

        isiFilter();
        hitungStatistik();
        tampilTabel(dataFilter);

    } catch (e) {

        console.log(e);

        alert("Tidak dapat terhubung ke server");

    }
 /*************************************************
 MEMBUAT FILTER
*************************************************/

function isiFilter() {

    function isiFilter(){

    const kelas=document.getElementById("kelas");
    const mapel=document.getElementById("mapel");

    kelas.innerHTML="<option value=''>Semua Kelas</option>";
    mapel.innerHTML="<option value=''>Semua Mapel</option>";

    let daftarKelas=[];
    let daftarMapel=[];

    semuaData.forEach(function(item){

        const k=String(item.kelas||"").trim();
        const m=String(item.mapel||"").trim();

        if(k!="" && daftarKelas.indexOf(k)==-1){

            daftarKelas.push(k);

        }

        if(m!="" && daftarMapel.indexOf(m)==-1){

            daftarMapel.push(m);

        }

    });

    daftarKelas.sort();
    daftarMapel.sort();

    daftarKelas.forEach(function(k){

        kelas.innerHTML +=
        "<option value='"+k+"'>"+k+"</option>";

    });

    daftarMapel.forEach(function(m){

        mapel.innerHTML +=
        "<option value='"+m+"'>"+m+"</option>";

    });

}
        if (d.mapel && !listMapel.includes(d.mapel)) {

            listMapel.push(d.mapel);

        }

    });

    listKelas.sort();

    listMapel.sort();

    listKelas.forEach(function (k) {

        kelas.innerHTML +=
            "<option value='" + k + "'>" +
            k +
            "</option>";

    });

    listMapel.forEach(function (m) {

        mapel.innerHTML +=
            "<option value='" + m + "'>" +
            m +
            "</option>";

    });

}
 /*************************************************
 STATISTIK
*************************************************/

function hitungStatistik(){

    const total = semuaData.length;

    let hadir = 0;
    let tidak = 0;

    semuaData.forEach(function(item){

        if(String(item.status).trim().toLowerCase()=="hadir"){

            hadir++;

        }else{

            tidak++;

        }

    });

    document.getElementById("totalData").innerHTML = total;

    document.getElementById("hadir").innerHTML = hadir;

    document.getElementById("tidak").innerHTML = tidak;

    let persen = 0;

    if(total>0){

        persen = Math.round((hadir/total)*100);

    }

    document.getElementById("persen").innerHTML = persen + "%";

 
}
 /*************************************************
 FORMAT TANGGAL
*************************************************/

function formatTanggal(tanggal){

    if(!tanggal) return "-";

    try{

        const d = new Date(tanggal);

        return d.toLocaleDateString("id-ID");

    }catch(e){

        return tanggal;

    }

}
 /*************************************************
 MENAMPILKAN TABEL
*************************************************/

function tampilTabel(data){

    const tbody = document.getElementById("tbodyLaporan");

    if(!tbody){
        return;
    }

    tbody.innerHTML = "";

    if(data.length===0){

        tbody.innerHTML =
        "<tr><td colspan='8' align='center'>Tidak ada data</td></tr>";

        return;

    }

    data.forEach(function(item,index){

        let tr = "";

        tr += "<tr>";

        tr += "<td>"+(index+1)+"</td>";

        tr += "<td>"+formatTanggal(item.tanggal)+"</td>";

        tr += "<td>"+(item.jam||"-")+"</td>";

        tr += "<td>"+(item.nama||"-")+"</td>";

        tr += "<td>"+(item.kelas||"-")+"</td>";

        tr += "<td>"+(item.mapel||"-")+"</td>";

        tr += "<td>"+(item.guru||"-")+"</td>";

        tr += "<td>"+(item.status||"-")+"</td>";

        tr += "</tr>";

        tbody.innerHTML += tr;

    });

}

}
