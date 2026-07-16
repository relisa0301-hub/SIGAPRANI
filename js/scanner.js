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
updateCounter();
    let isi = "";

    kelas.data.forEach(function(k){
        isi += "<option value='"+k.nama+"'>"+k.nama+"</option>";
    });

    document.getElementById("kelas").innerHTML = isi;

    let jam = "";

    for(let i=1;i<=10;i++){
        jam += "<option value='"+i+"'>Jam Pelajaran "+i+"</option>";
    }

    document.getElementById("jam").innerHTML = jam;

    document.getElementById("hasil").innerHTML="Membuka kamera...";

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

            document.getElementById("hasil").innerHTML=
            "Kamera tidak dapat dibuka : "+err;

        }

    }

}

async function scanBerhasil(qr){

    scanner.pause();

    const hasilBox = document.getElementById("hasil");

    hasilBox.style.padding = "15px";
    hasilBox.style.borderRadius = "10px";
    hasilBox.style.fontWeight = "bold";
    hasilBox.innerHTML = "Memproses...";

    const user = JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

    const hasil = await postAPI({

        action:"scan",

        qr:qr,

        kelas:document.getElementById("kelas").value,

        jam:document.getElementById("jam").value,

        guru:user.nama,

        mapel:user.mapel

    });

    if(hasil.status){

        hasilBox.style.background="#d4edda";
        hasilBox.style.color="#155724";
        hasilBox.style.border="2px solid #28a745";

       hasilBox.innerHTML=
"<h3>✅ "+hasil.message+"</h3>"+
"<hr>"+
"<b>Nama :</b> "+hasil.nama+"<br>"+
"<b>Kelas :</b> "+hasil.kelas+"<br>"+
"<b>Mapel :</b> "+hasil.mapel+"<br>"+
"<b>Guru :</b> "+hasil.guru+"<br>"+
"<b>Jam :</b> "+hasil.jam;
tambahRiwayat(hasil);
        jumlahHadir++;

updateCounter();
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

        hasilBox.innerHTML=
        "❌ "+hasil.message;

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

row.insertCell(0).innerHTML=data.jam;
row.insertCell(1).innerHTML=data.nama;
row.insertCell(2).innerHTML=data.kelas;

if(tbody.rows.length>10){

tbody.deleteRow(10);

}

}
function updateCounter(){

document.getElementById("counter").innerHTML=

"Hadir : "+jumlahHadir+" / "+jumlahSiswa;

}
