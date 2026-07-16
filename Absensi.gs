/************************************************
 SIGAP RANI V4
 ABSENSI.GS
************************************************/

function prosesScan(data){

  const ss = SpreadsheetApp.openById("1VfH5Jdp6OdFHd_Igq5H_8lWeCliqvplpQYAvoCYRtro");

  const siswaSheet = ss.getSheetByName("DATA SISWA");
  const absenSheet = ss.getSheetByName("DATA ABSENSI");

  const qr = String(data.qr).trim();

  const siswa = siswaSheet.getDataRange().getValues();

  let ditemukan = null;

  for(let i=1;i<siswa.length;i++){

    if(String(siswa[i][6]).trim()==qr){

      ditemukan=siswa[i];
      break;

    }

  }

  if(ditemukan==null){

    return{

      status:false,
      message:"QR Tidak Terdaftar"

    };

  }

  const nis=ditemukan[0];
  const nama=ditemukan[2];
  const kelas=ditemukan[3];
  const wa=ditemukan[5];

  const tanggal=Utilities.formatDate(new Date(),"Asia/Jakarta","yyyy-MM-dd");

  const idUnik=
      tanggal+"_"+nis+"_"+data.mapel;

  const absen=absenSheet.getDataRange().getValues();

  for(let i=1;i<absen.length;i++){

      if(String(absen[i][14])==idUnik){

          return{

            status:false,

            message:"Siswa sudah absen hari ini."

          };

      }

  }

  absenSheet.appendRow([

    Utilities.getUuid(),

    qr,

    new Date(),

    Utilities.formatDate(new Date(),"Asia/Jakarta","HH:mm:ss"),

    nis,

    nama,

    kelas,

    wa,

    data.mapel,

    data.guru,

    "HADIR",

    "",

    Utilities.formatDate(new Date(),"Asia/Jakarta","EEEE"),

    "",

    idUnik

  ]);

  // kirimWAOtomatis(
//      wa,
//      nama,
//      kelas,
//      data.mapel,
//      data.guru
// );

  return{

    status:true,

    message:"Absensi Berhasil"

  };

}
