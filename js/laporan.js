/*************************************************
 SIGAP RANI V4
 LAPORAN.JS
*************************************************/

let semuaData = [];
let dataTampil = [];
let dataTidakHadir = [];

/* MEMUAT LAPORAN */
async function loadLaporan() {
    try {
        const hasil = await postAPI({ action: "laporan" });

        if (!hasil || !hasil.status) {
            alert("Data laporan gagal dimuat.");
            return;
        }

        semuaData = hasil.data || [];
        dataTampil = [...semuaData];

        await isiFilter();
        await loadMapelFilter();
        hitungStatistik(dataTampil);
        tampilTabel(dataTampil);

    } catch (err) {
        console.error("Gagal memuat laporan:", err);
        alert("Data laporan gagal dimuat. Periksa Console browser.");
    }
}

/* FILTER KELAS */
async function isiFilter() {
    const elemen = document.getElementById("kelas");
    if (!elemen) return;

    const nilaiLama = elemen.value;

    elemen.innerHTML = "<option value=''>Semua Kelas</option>";

    let daftar = [...new Set(
        semuaData.map(d => String(d.kelas || "").trim()).filter(Boolean)
    )];

    daftar.sort();

    daftar.forEach(k => {
        const opsi = document.createElement("option");
        opsi.value = k;
        opsi.textContent = k;
        elemen.appendChild(opsi);
    });

    elemen.value = nilaiLama;
}

/* FILTER MAPEL */
async function loadMapelFilter() {
    const elemen = document.getElementById("mapel");
    if (!elemen) return;

    const nilaiLama = elemen.value;

    try {
        const hasil = await postAPI({ action: "mapel" });

        if (hasil && hasil.status && Array.isArray(hasil.data)) {
            elemen.innerHTML = "<option value=''>Semua Mapel</option>";

            hasil.data.forEach(m => {
                const opsi = document.createElement("option");
                opsi.value = m;
                opsi.textContent = m;
                elemen.appendChild(opsi);
            });
        }
    } catch (err) {
        console.error("Gagal memuat mapel:", err);
    }

    elemen.value = nilaiLama;
}

/* TABEL LAPORAN */
function tampilTabel(data) {
    const tbody = document.getElementById("tbodyLaporan");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML =
            "<tr><td colspan='9' style='text-align:center;padding:20px'>Tidak ada data.</td></tr>";
        return;
    }

    data.forEach((d, i) => {
        const tr = document.createElement("tr");

        [
            i + 1,
            formatTanggal(d.tanggal),
            d.jam || "-",
            d.nis || "-",
            d.nama || "-",
            d.kelas || "-",
            d.mapel || "-",
            d.guru || "-",
            d.status || "-"
        ].forEach(nilai => {
            const td = document.createElement("td");
            td.textContent = nilai;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

/* FORMAT TANGGAL */
function formatTanggal(tgl) {
    if (!tgl) return "-";

    const cocok = String(tgl).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (cocok) {
        return cocok[3] + "/" + cocok[2] + "/" + cocok[1];
    }

    return tgl;
}

/* STATISTIK */
function hitungStatistik(data = semuaData) {
    const total = data.length;

    const hadir = data.filter(
        d => String(d.status || "").trim().toLowerCase() === "hadir"
    ).length;

    document.getElementById("totalData").textContent = total;
    document.getElementById("hadir").textContent = hadir;
    document.getElementById("tidak").textContent = total - hadir;

    document.getElementById("persen").textContent =
        (total ? Math.round(hadir / total * 100) : 0) + "%";
}

/* FILTER LAPORAN */
function filterData() {
    const tgl = document.getElementById("tgl").value;
    const kelas = document.getElementById("kelas").value;
    const mapel = document.getElementById("mapel").value;
    const cari = document.getElementById("cari").value.toLowerCase().trim();

    dataTampil = semuaData.filter(d => {
        if (tgl && String(d.tanggal).substring(0, 10) !== tgl) return false;
        if (kelas && String(d.kelas).trim() !== kelas) return false;
        if (mapel && String(d.mapel).trim() !== mapel) return false;
        if (cari && !String(d.nama || "").toLowerCase().includes(cari)) return false;

        return true;
    });

    hitungStatistik(dataTampil);
    tampilTabel(dataTampil);
}

/* TAMPILKAN SISWA TIDAK HADIR */
async function tampilkanTidakHadir() {
    const tanggal = document.getElementById("tgl").value;
    const kelas = document.getElementById("kelas").value;
    const mapel = document.getElementById("mapel").value;
    const jam = document.getElementById("jamTidakHadir").value;

    if (!tanggal || !kelas || !mapel || !jam) {
        alert("Pilih tanggal, kelas, mapel, dan jam pelajaran terlebih dahulu.");
        return;
    }

    try {
        const hasil = await postAPI({
            action: "laporanTidakHadir",
            tanggal: tanggal,
            kelas: kelas,
            mapel: mapel,
            jam: jam
        });

        if (!hasil || !hasil.status) {
            alert(
                (hasil && hasil.message) ||
                "Gagal mengambil data tidak hadir."
            );
            return;
        }

        dataTidakHadir = hasil.data || [];

        const tbody = document.getElementById("tbodyLaporan");
        tbody.innerHTML = "";

        if (dataTidakHadir.length === 0) {
            tbody.innerHTML =
                "<tr><td colspan='9' style='text-align:center;padding:20px'>" +
                "Semua siswa sudah tercatat hadir pada pilihan ini." +
                "</td></tr>";
        } else {
            dataTidakHadir.forEach((d, i) => {
                const tr = document.createElement("tr");

                [
                    i + 1,
                    formatTanggal(d.tanggal),
                    d.jam || "-",
                    d.nis || "-",
                    d.nama || "-",
                    d.kelas || "-",
                    d.mapel || "-",
                    "-",
                    "Tidak Hadir"
                ].forEach(nilai => {
                    const td = document.createElement("td");
                    td.textContent = nilai;
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });
        }

        document.getElementById("totalData").textContent =
            dataTidakHadir.length;

        document.getElementById("hadir").textContent = 0;

        document.getElementById("tidak").textContent =
            dataTidakHadir.length;

        document.getElementById("persen").textContent = "0%";

    } catch (err) {
        console.error("Gagal memuat siswa tidak hadir:", err);
        alert("Gagal mengambil daftar tidak hadir. Periksa koneksi dan API.");
    }
}

/* DOWNLOAD SISWA TIDAK HADIR */
function exportTidakHadirExcel() {
    if (!dataTidakHadir.length) {
        alert("Tampilkan daftar Tidak Hadir terlebih dahulu.");
        return;
    }

    const tanggal = document.getElementById("tgl").value;
    const kelas = document.getElementById("kelas").value;
    const mapel = document.getElementById("mapel").value;
    const jam = document.getElementById("jamTidakHadir").value;

    const baris = [
        ["LAPORAN SISWA TIDAK HADIR"],
        ["Tanggal", tanggal],
        ["Kelas", kelas],
        ["Mapel", mapel],
        ["Jam Pelajaran", jam],
        [],
        ["No", "NIS", "Nama Siswa", "Kelas", "Mapel", "Jam", "Status"]
    ];

    dataTidakHadir.forEach((d, i) => {
        baris.push([
            i + 1,
            d.nis,
            d.nama,
            d.kelas,
            d.mapel,
            d.jam,
            "Tidak Hadir"
        ]);
    });

    const csv = "\uFEFF" + baris.map(row =>
        row.map(v =>
            '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'
        ).join(";")
    ).join("\r\n");

    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
        "Tidak_Hadir_" + tanggal + "_Kelas_" + kelas + ".csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

/* EXPORT PDF */
function exportPDF() {
    const tabel = document.getElementById("tblLaporan");

    if (!tabel) {
        alert("Tabel laporan tidak ditemukan.");
        return;
    }

    const jendela = window.open("", "_blank");

    if (!jendela) {
        alert("Izinkan pop-up browser untuk mencetak PDF.");
        return;
    }

    const htmlLaporan = [
        "<!DOCTYPE html>",
        '<html lang="id">',
        "<head>",
        '<meta charset="UTF-8">',
        "<title>Laporan Absensi SIGAP RANI</title>",
        "<style>",
        "body{font-family:Arial,sans-serif;padding:20px}",
        "h2{text-align:center}",
        "table{width:100%;border-collapse:collapse}",
        "th,td{border:1px solid #555;padding:7px;text-align:left}",
        "th{background:#eee}",
        "</style>",
        "</head>",
        "<body>",
        "<h2>LAPORAN ABSENSI SIGAP RANI</h2>",
        tabel.outerHTML,
        "</body>",
        "</html>"
    ].join("");

    jendela.document.open();
    jendela.document.write(htmlLaporan);
    jendela.document.close();
    jendela.focus();
    jendela.print();
}

/* EXPORT EXCEL LAPORAN */
function exportExcel() {
    const tabel = document.getElementById("tblLaporan");
    if (!tabel) return;

    const blob = new Blob(
        ["\uFEFF", tabel.outerHTML],
        { type: "application/vnd.ms-excel;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Laporan_Absensi_SIGAP_RANI.xls";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

/* EVENT FILTER */
window.addEventListener("load", function () {
    ["tgl", "kelas", "mapel", "cari"].forEach(id => {
        const elemen = document.getElementById(id);
        if (!elemen) return;

        elemen.addEventListener(
            id === "cari" ? "input" : "change",
            filterData
        );
    });
});
