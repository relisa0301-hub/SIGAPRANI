/*************************************************
 SIGAP RANI V4
 LAPORAN.JS
*************************************************/

let dataLaporan = [];

async function loadLaporan(){

    const tbody = document.querySelector('#tblLaporan tbody');

    tbody.innerHTML = `
        <tr>
            <td colspan="8" align="center">Memuat data...</td>
        </tr>
    `;

    try{

        //await loadKelas();
        //await loadMapel();

        const hasil = await postAPI({
            action: 'laporan',
            tanggal: document.getElementById('tgl').value,
            kelas: document.getElementById('kelas').value,
            mapel: document.getElementById('mapel').value,
            cari: document.getElementById('cari').value
        });
console.log(hasil);
        if(!hasil.status || !hasil.data){

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" align="center">Tidak ada data.</td>
                </tr>
            `;

            document.getElementById('totalData').innerHTML = '0';
            document.getElementById('hadir').innerHTML = '0';
            document.getElementById('tidak').innerHTML = '0';
            document.getElementById('persen').innerHTML = '0%';

            return;
        }

        dataLaporan = hasil.data;
        tampilData(dataLaporan);

    }catch(err){

        console.log(err);

        tbody.innerHTML = `
            <tr>
                <td colspan="8" align="center">Gagal mengambil data.</td>
            </tr>
        `;
    }
}

async function loadKelas(){

    const select = document.getElementById('kelas');

    if(select.options.length > 1) return;

    try{

        const hasil = await getAPI('kelas');

        if(!hasil.status || !hasil.data) return;

        hasil.data.forEach(function(k){
            select.innerHTML +=
                '<option value="' + k.nama + '">' +
                k.nama +
                '</option>';
        });

    }catch(err){
        console.log(err);
    }
}

async function loadMapel(){

    const select = document.getElementById('mapel');

    if(select.options.length > 1) return;

    try{

        const user = JSON.parse(
            localStorage.getItem(CONFIG.SESSION_KEY)
        );

        if(user && user.mapel){
            select.innerHTML +=
                '<option value="' + user.mapel + '">' +
                user.mapel +
                '</option>';
        }

    }catch(err){
        console.log(err);
    }
}

function tampilData(data){

    const tbody = document.querySelector('#tblLaporan tbody');

    tbody.innerHTML = '';

    if(data.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="8" align="center">Data tidak ditemukan</td>
            </tr>
        `;

        document.getElementById('totalData').innerHTML = '0';
        document.getElementById('hadir').innerHTML = '0';
        document.getElementById('tidak').innerHTML = '0';
        document.getElementById('persen').innerHTML = '0%';

        return;
    }

    let hadir = 0;
    let tidak = 0;

    data.forEach(function(d, index){

        if(String(d.status).toLowerCase() === 'hadir'){
            hadir++;
        }else{
            tidak++;
        }

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${d.tanggal}</td>
                <td>${d.jam}</td>
                <td>${d.nama}</td>
                <td>${d.kelas}</td>
                <td>${d.mapel}</td>
                <td>${d.guru}</td>
                <td>${d.status}</td>
            </tr>
        `;
    });

    document.getElementById('totalData').innerHTML = data.length;
    document.getElementById('hadir').innerHTML = hadir;
    document.getElementById('tidak').innerHTML = tidak;

    let persen = 0;

    if(data.length > 0){
        persen = Math.round((hadir / data.length) * 100);
    }

    document.getElementById('persen').innerHTML = persen + '%';
}

function exportPDF(){
    window.print();
}

function exportExcel(){

    if(dataLaporan.length === 0){
        alert('Tidak ada data untuk diexport.');
        return;
    }

    let csv = 'No,Tanggal,Jam,Nama,Kelas,Mapel,Guru,Status\n';

    dataLaporan.forEach(function(d, i){
        csv +=
            (i + 1) + ',' +
            '"' + d.tanggal + '",' +
            '"' + d.jam + '",' +
            '"' + d.nama + '",' +
            '"' + d.kelas + '",' +
            '"' + d.mapel + '",' +
            '"' + d.guru + '",' +
            '"' + d.status + '"\n';
    });

    const blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = 'Laporan_SIGAP_RANI.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

window.onload = async function(){

    const user = JSON.parse(
        localStorage.getItem(CONFIG.SESSION_KEY)
    );

    if(!user){
        location = 'index.html';
        return;
    }

    try{
        document.getElementById('tgl').value =
            new Date().toISOString().split('T')[0];
    }catch(e){}

    document.getElementById('tgl').addEventListener('change', loadLaporan);
    document.getElementById('kelas').addEventListener('change', loadLaporan);
    document.getElementById('mapel').addEventListener('change', loadLaporan);
    document.getElementById('cari').addEventListener('keyup', loadLaporan);

    await loadKelas();
    await loadMapel();
    await loadLaporan();
};
