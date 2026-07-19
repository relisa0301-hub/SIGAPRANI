/*************************************************
 SIGAP RANI V4
 laporan.js
 Dibuat ulang agar stabil
 Tidak mempengaruhi Scanner QR
*************************************************/

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
        dataTampil = [...semuaData];

        isiFilter();
        hitungStatistik();
        tampilTabel(dataTampil);

    } catch (err) {

        console.log(err);

        alert("Tidak dapat mengambil data laporan.");

    }

}
/*************************************************
MENGISI FILTER KELAS & MAPEL
*************************************************/

function isiFilter() {

    const kelas = document.getElementById("kelas");
    const mapel = document.getElementById("mapel");

    if (!kelas || !mapel) return;

    kelas.innerHTML =
        "<option value=''>Semua Kelas</option>";

    mapel.innerHTML =
        "<option value=''>Semua Mapel</option>";

    let daftarKelas = [];
    let daftarMapel = [];

    semuaData.forEach(function (d) {

        if (
            d.kelas &&
            !daftarKelas.includes(d.kelas)
        ) {

            daftarKelas.push(d.kelas);

        }

        if (
            d.mapel &&
            !daftarMapel.includes(d.mapel)
        ) {

            daftarMapel.push(d.mapel);

        }

    });

    daftarKelas.sort();

    daftarMapel.sort();

    daftarKelas.forEach(function (k) {

        kelas.innerHTML +=
            "<option value='" +
            k +
            "'>" +
            k +
            "</option>";

    });

    daftarMapel.forEach(function (m) {

        mapel.innerHTML +=
            "<option value='" +
            m +
            "'>" +
            m +
            "</option>";

    });

}
/*************************************************
MENAMPILKAN TABEL LAPORAN
*************************************************/

function tampilTabel(data) {

    const tbody =
        document.getElementById("tbodyLaporan");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (data.length == 0) {

        tbody.innerHTML =
            "<tr><td colspan='9' style='text-align:center;padding:20px;'>Tidak ada data.</td></tr>";

        return;

    }

    data.forEach(function (d, index) {

        let row = "<tr>";

        row += "<td>" + (index + 1) + "</td>";

        row += "<td>" + formatTanggal(d.tanggal) + "</td>";

        row += "<td>" + (d.jam || "-") + "</td>";

        row += "<td>" + (d.nama || "-") + "</td>";

        row += "<td>" + (d.kelas || "-") + "</td>";

        row += "<td>" + (d.mapel || "-") + "</td>";

        row += "<td>" + (d.guru || "-") + "</td>";

        row += "<td>" + (d.status || "-") + "</td>";

        row += "</tr>";

        tbody.innerHTML += row;

    });

}

function formatTanggal(tgl) {

    if (!tgl) return "-";

    try {

        return new Date(tgl).toLocaleDateString(
            "id-ID"
        );

    } catch (e) {

        return tgl;

    }

}
/*************************************************
STATISTIK LAPORAN
*************************************************/

function hitungStatistik() {

    const total = semuaData.length;

    let hadir = 0;
    let tidak = 0;

    semuaData.forEach(function (d) {

        if (String(d.status).trim() == "Hadir") {

            hadir++;

        } else {

            tidak++;

        }

    });

    document.getElementById("totalData").innerHTML = total;
    document.getElementById("hadir").innerHTML = hadir;
    document.getElementById("tidak").innerHTML = tidak;

    let persen = 0;

    if (total > 0) {

        persen = Math.round((hadir / total) * 100);

    }

    document.getElementById("persen").innerHTML =
        persen + "%";

}

/*************************************************
FILTER DATA
*************************************************/

function filterData() {

    const tgl =
        document.getElementById("tgl").value;

    const kelas =
        document.getElementById("kelas").value;

    const mapel =
        document.getElementById("mapel").value;

    const cari =
        document.getElementById("cari")
        .value
        .toLowerCase();

    dataTampil = semuaData.filter(function (d) {

        let cocok = true;

        if (tgl && String(d.tanggal).indexOf(tgl) < 0)
            cocok = false;

        if (kelas && d.kelas != kelas)
            cocok = false;

        if (mapel && d.mapel != mapel)
            cocok = false;

        if (
            cari &&
            String(d.nama)
                .toLowerCase()
                .indexOf(cari) < 0
        )
            cocok = false;

        return cocok;

    });

    tampilTabel(dataTampil);

}

/*************************************************
EVENT FILTER
*************************************************/

window.addEventListener("load", function () {

    const tgl =
        document.getElementById("tgl");

    const kelas =
        document.getElementById("kelas");

    const mapel =
        document.getElementById("mapel");

    const cari =
        document.getElementById("cari");

    if (tgl)
        tgl.onchange = filterData;

    if (kelas)
        kelas.onchange = filterData;

    if (mapel)
        mapel.onchange = filterData;

    if (cari)
        cari.onkeyup = filterData;

});
