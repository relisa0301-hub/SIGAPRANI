/************************************************
 SIGAP RANI V4
 laporan.js
 Tidak mempengaruhi Scanner QR
************************************************/

let semuaData = [];
let dataTampil = [];

window.onload = async function () {

    await loadLaporan();

};

async function loadLaporan() {

    try {

        const hasil = await postAPI({

            action: "laporan"

        });

        if (!hasil.status) {

            alert("Data laporan gagal dimuat.");

            return;

        }

        semuaData = hasil.data;
        dataTampil = hasil.data;

        isiFilter();
        hitungStatistik();
        tampilTabel(dataTampil);

    } catch (e) {

        console.log(e);

        alert("Tidak dapat terhubung ke server.");

    }
 function isiFilter() {

    const kelas = document.getElementById("filterKelas");
    const mapel = document.getElementById("filterMapel");

    if (!kelas || !mapel) return;

    kelas.innerHTML =
        "<option value=''>Semua Kelas</option>";

    mapel.innerHTML =
        "<option value=''>Semua Mapel</option>";

    let daftarKelas = [];
    let daftarMapel = [];

    semuaData.forEach(function (d) {

        if (!daftarKelas.includes(d.kelas))
            daftarKelas.push(d.kelas);

        if (!daftarMapel.includes(d.mapel))
            daftarMapel.push(d.mapel);

    });

    daftarKelas.sort();

    daftarMapel.sort();

    daftarKelas.forEach(function (k) {

        kelas.innerHTML +=
            "<option value='" + k + "'>" +
            k +
            "</option>";

    });

    daftarMapel.forEach(function (m) {

        mapel.innerHTML +=
            "<option value='" + m + "'>" +
            m +
            "</option>";

    });

}
 /************************************************
 MENAMPILKAN TABEL LAPORAN
************************************************/

function tampilTabel(data){

    const tbody = document.getElementById("tbodyLaporan");

    if(!tbody){
        return;
    }

    tbody.innerHTML = "";

    if(data.length==0){

        tbody.innerHTML =
        "<tr><td colspan='10' style='text-align:center'>Tidak ada data</td></tr>";

        return;

    }

    data.forEach(function(d,index){

        let row = "<tr>";

        row += "<td>"+(index+1)+"</td>";

        row += "<td>"+formatTanggal(d.tanggal)+"</td>";

        row += "<td>"+(d.jam||"-")+"</td>";

        row += "<td>"+(d.nis||"-")+"</td>";

        row += "<td>"+(d.nama||"-")+"</td>";

        row += "<td>"+(d.kelas||"-")+"</td>";

        row += "<td>"+(d.mapel||"-")+"</td>";

        row += "<td>"+(d.guru||"-")+"</td>";

        row += "<td>"+(d.status||"-")+"</td>";

        row += "</tr>";

        tbody.innerHTML += row;

    });

}

function formatTanggal(tgl){

    if(!tgl) return "-";

    try{

        const d = new Date(tgl);

        return d.toLocaleDateString("id-ID");

    }catch(e){

        return tgl;

    }

}

}
/************************************************
 STATISTIK LAPORAN
************************************************/

function hitungStatistik(){

    const total = semuaData.length;

    let hadir = 0;
    let tidakHadir = 0;

    semuaData.forEach(function(d){

        if(String(d.status).toLowerCase()=="hadir"){

            hadir++;

        }else{

            tidakHadir++;

        }

    });

    if(document.getElementById("totalData")){

        document.getElementById("totalData").innerHTML = total;

    }

    if(document.getElementById("totalHadir")){

        document.getElementById("totalHadir").innerHTML = hadir;

    }

    if(document.getElementById("totalTidakHadir")){

        document.getElementById("totalTidakHadir").innerHTML = tidakHadir;

    }

}
