async function loadLaporan(){

    const tbody = document.querySelector("#tblLaporan tbody");

    tbody.innerHTML = `
        <tr>
            <td colspan="8" align="center">
                Memuat data...
            </td>
        </tr>
    `;

    try{

       const hasil = await postAPI({

    action:"laporan",

    tanggal:document.getElementById("tgl").value,

    kelas:document.getElementById("kelas").value,

    mapel:document.getElementById("mapel").value,

    cari:document.getElementById("cari").value

});

        if(!hasil.status){

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" align="center">
                        Belum ada data.
                    </td>
                </tr>
            `;

            return;

        }

        tbody.innerHTML="";

        let hadir=0;
        let tidak=0;

        hasil.data.forEach((d,index)=>{

            if(d.status=="Hadir"){
                hadir++;
            }else{
                tidak++;
            }

            tbody.innerHTML+=`

            <tr>

                <td>${index+1}</td>

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

        document.getElementById("totalData").innerHTML=hasil.data.length;
        document.getElementById("hadir").innerHTML=hadir;
        document.getElementById("tidak").innerHTML=tidak;

        let persen=0;

        if(hasil.data.length>0){

            persen=Math.round((hadir/hasil.data.length)*100);

        }

        document.getElementById("persen").innerHTML=persen+"%";

    }catch(err){

        console.log(err);

        tbody.innerHTML=`
            <tr>
                <td colspan="8" align="center">
                    Gagal mengambil data.
                </td>
            </tr>
        `;

    }

}

function exportPDF(){

    window.print();

}

function exportExcel(){
document.getElementById("tgl").onchange=loadLaporan;

document.getElementById("kelas").onchange=loadLaporan;

document.getElementById("mapel").onchange=loadLaporan;

document.getElementById("cari").onkeyup=loadLaporan;
    alert("Export Excel akan kita aktifkan pada revisi berikutnya.");

}
