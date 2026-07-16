let scanner;

async function mulaiScanner(){

    const user = JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

    if(!user){
        window.location="index.html";
        return;
    }

    document.getElementById("mapel").innerHTML =
        "<option value='"+user.mapel+"'>"+user.mapel+"</option>";

    const kelas = await getAPI("kelas");

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

    scanner = new Html5Qrcode("reader");

    try{

        const devices = await Html5Qrcode.getCameras();

        if(devices && devices.length){

            const cameraId = devices[devices.length-1].id;

            await scanner.start(
                cameraId,
                {
                    fps:10,
                    qrbox:{width:250,height:250}
                },
                scanBerhasil
            );

        }else{

            document.getElementById("hasil").innerHTML="Kamera tidak ditemukan";

        }

    }catch(err){

        document.getElementById("hasil").innerHTML=err;

    }

}

async function scanBerhasil(qr){

    scanner.pause();

    document.getElementById("hasil").innerHTML="Memproses...";

    const user = JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

    const hasil = await postAPI({

        action:"scan",

        qr:qr,

        kelas:document.getElementById("kelas").value,

        jam:document.getElementById("jam").value,

        guru:user.nama,

        mapel:user.mapel

    });

    document.getElementById("hasil").innerHTML=hasil.message;

    setTimeout(function(){

        scanner.resume();

    },2000);

}
