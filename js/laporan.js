async function loadLaporan() {

    const tbody = document.querySelector("#tblLaporan tbody");

    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center">
                Memuat data...
            </td>
        </tr>
    `;

    try {

        const res = await postAPI({
            action: "laporan"
        });

        if (!res.status) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">Data tidak ditemukan</td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = "";

        res.data.forEach((d, i) => {

            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${d.tanggal}</td>
                    <td>${d.nama}</td>
                    <td>${d.kelas}</td>
                    <td>${d.mapel}</td>
                    <td>${d.guru}</td>
                    <td>${d.status}</td>
                </tr>
            `;

        });

    } catch (e) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7">Gagal mengambil data.</td>
            </tr>
        `;

    }

}
