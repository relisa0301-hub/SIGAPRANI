let scanner;

let jumlahHadir = 0;
let jumlahSiswa = 0;

async function mulaiScanner(){

    const user = JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

    if(!user){
        window.location="index.html";
        return;
    }

    document.getElementById("mapel").innerHTML =
        "<option value='"+user.mapel+"'>"+user.mapel+"</option>";

    const kelas = await getAPI("kelas");

    let isi="";

    kelas.data.forEach(function(k){

        isi += "<option value='"+k.nama+"' data-jumlah='"+k.jumlah+"'>"+k.nama+"</option>";

    });

    document.getElementById("kelas").innerHTML = isi;

    document.getElementById("infoKelas").innerHTML =
    document.getElementById("kelas").value;

    document.getElementById("infoMapel").innerHTML =
    user.mapel;

    jumlahSiswa =
    Number(document.getElementById("kelas").options[0].dataset.jumlah);

    let jam="";

    for(let i=1;i<=10;i++){

        jam += "<option value='"+i+"'>Jam Pelajaran "+i+"</option>";

    }

    document.getElementById("jam").innerHTML = jam;

    document.getElementById("infoJam").innerHTML =
    "Jam Pelajaran 1";

    updateCounter();

    await tampilBelumHadir();

    document.getElementById("kelas").onchange = async function(){

        document.getElementById("infoKelas").innerHTML = this.value;

        jumlahSiswa =
        Number(this.options[this.selectedIndex].dataset.jumlah);

        jumlahHadir = 0;

        updateCounter();

        await tampilBelumHadir();

    };

    document.getElementById("jam").onchange = async function(){

        document.getElementById("infoJam").innerHTML =
        "Jam Pelajaran " + this.value;

        await tampilBelumHadir();

    };

    document.getElementById("hasil").innerHTML =
    "Membuka kamera...";

    scanner = new Html5Qrcode("reader");

    try{

        await scanner.start(
            {
                facingMode:{
                    exact:"environment"
                }
            },
            {
                fps:10,
                qrbox:250
            },
            scanBerhasil
        );

        document.getElementById("hasil").innerHTML="";

    }catch(e){

        try{

            await scanner.start(
                {
                    facingMode:"environment"
                },
                {
                    fps:10,
                    qrbox:250
                },
                scanBerhasil
            );

            document.getElementById("hasil").innerHTML="";

        }catch(err){

            document.getElementById("hasil").innerHTML =
            "Kamera tidak dapat dibuka : " + err;

        }

    }

}

async function scanBerhasil(qr){

    scanner.pause();

    const hasilBox =
    document.getElementById("hasil");

    hasilBox.style.padding="15px";
    hasilBox.style.borderRadius="10px";
    hasilBox.style.fontWeight="bold";
    hasilBox.innerHTML="Memproses...";

    const user =
    JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

    const hasil = await postAPI({

        action:"scan",

        qr:qr,

        kelas:document.getElementById("kelas").value,

        jam:document.getElementById("jam").value,

        guru:user.nama,

        mapel:user.mapel

    });    console.log(hasil);

    if(hasil.status){

        hasilBox.style.background="#d4edda";
        hasilBox.style.color="#155724";
        hasilBox.style.border="2px solid #28a745";

        hasilBox.innerHTML=

        "<h3>✅ "+hasil.message+"</h3>"+

        "<hr>"+

        "<b>Nama :</b> "+(hasil.nama||"-")+"<br>"+

        "<b>Kelas :</b> "+(hasil.kelas||"-")+"<br>"+

        "<b>Mapel :</b> "+(hasil.mapel||"-")+"<br>"+

        "<b>Guru :</b> "+(hasil.guru||"-")+"<br>"+

        "<b>Jam :</b> "+(hasil.jam||"-");

        tambahRiwayat(hasil);

        jumlahHadir++;

        updateCounter();

        await tampilBelumHadir();

        if(navigator.vibrate){

            navigator.vibrate(200);

        }

        try{

            new Audio("success.mp3").play();

        }catch(e){}

    }else{

        hasilBox.style.background="#f8d7da";

        hasilBox.style.color="#721c24";

        hasilBox.style.border="2px solid #dc3545";

        hasilBox.innerHTML="❌ "+hasil.message;

        if(navigator.vibrate){

            navigator.vibrate([100,100,100]);

        }

    }

    setTimeout(function(){

        hasilBox.innerHTML="";

        hasilBox.style.background="";

        hasilBox.style.border="";

        scanner.resume();

    },2500);

}



function tambahRiwayat(data){

    const tbody=document.querySelector("#riwayat tbody");

    const row=tbody.insertRow(0);

    row.innerHTML=

    "<td>"+data.jam+"</td>"+

    "<td>"+data.nama+"</td>"+

    "<td>"+data.kelas+"</td>";

    while(tbody.rows.length>10){

        tbody.deleteRow(10);

    }

}



function updateCounter(){

    document.getElementById("counter").innerHTML=

    "Hadir : "+jumlahHadir+" / "+jumlahSiswa;

    const belum=jumlahSiswa-jumlahHadir;

    document.getElementById("belumHadir").innerHTML=

    "Belum Hadir : "+belum;

    let persen=0;

    if(jumlahSiswa>0){

        persen=Math.round(

            (jumlahHadir/jumlahSiswa)*100

        );

    }

    document.getElementById("persenHadir").innerHTML=

    persen+"%";

    document.getElementById("progressBar").style.width=

    persen+"%";

    const bar=document.getElementById("progressBar");

    if(persen<50){

        bar.style.background="#dc3545";

    }else if(persen<80){

        bar.style.background="#ffc107";

    }else{

        bar.style.background="#28a745";

    }
async function tampilBelumHadir(){

    try{

        const hasil = await getBelumHadir(

            document.getElementById("kelas").value,

            document.getElementById("jam").value,

            document.getElementById("mapel").value

        );

        const div = document.getElementById("listBelumHadir");

        if(!div){
            return;
        }

        if(!hasil.status){

            div.innerHTML =
            "<span style='color:red'>Gagal memuat data.</span>";

            return;

        }

        if(hasil.data.length==0){

            div.innerHTML =
            "<span style='color:green'>🎉 Semua siswa sudah hadir.</span>";

            return;

        }

        let html =
        "<b>"+hasil.data.length+
        " siswa belum hadir</b><hr>";

        hasil.data.forEach(function(s){

            html +=
            "• "+
            s.nis+
            " - "+
            s.nama+
            "<br>";

        });

        div.innerHTML = html;

    }catch(err){

        console.log(err);

        const div=document.getElementById("listBelumHadir");

        if(div){

            div.innerHTML =
            "<span style='color:red'>Tidak dapat mengambil data.</span>";

        }

    }

}
}
