/*************************************************
 SIGAP RANI V4
 LAPORAN.GS
*************************************************/

function getLaporan(req){

  const ss = SpreadsheetApp.openById("1VfH5Jdp6OdFHd_Igq5H_8lWeCliqvplpQYAvoCYRtro");
  const sheet = ss.getSheetByName("DATA ABSENSI");

  const data = sheet.getDataRange().getValues();

  const hasil = [];

  const tglFilter = String(req.tanggal || "").trim();
  const kelasFilter = String(req.kelas || "").trim();
  const mapelFilter = String(req.mapel || "").trim();
  const cari = String(req.cari || "").toLowerCase().trim();

  for(let i=1;i<data.length;i++){

    const tanggal = Utilities.formatDate(
      new Date(data[i][2]),
      "Asia/Jakarta",
      "yyyy-MM-dd"
    );

    const jam    = data[i][13];
    const nis    = data[i][4];
    const nama   = data[i][5];

    // KODE KELAS
    const kelas = String(data[i][6]);

    const mapel = data[i][8];
    const guru  = data[i][9];
    const status= data[i][10];

    if(tglFilter && tanggal != tglFilter) continue;

    // FILTER KELAS
    if(kelasFilter && Number(kelas) != Number(kelasFilter)) continue;

    if(mapelFilter && mapel != mapelFilter) continue;

    if(cari){

      const teks = (
        nis+" "+
        nama+" "+
        kelas+" "+
        mapel+" "+
        guru
      ).toLowerCase();

      if(!teks.includes(cari)) continue;
    }

    hasil.push({

      tanggal:tanggal,
      jam:jam,
      nis:nis,
      nama:nama,
      kelas:kelas,
      mapel:mapel,
      guru:guru,
      status:status

    });

  }

  hasil.sort(function(a,b){

    if(a.tanggal>b.tanggal) return -1;
    if(a.tanggal<b.tanggal) return 1;

    return 0;

  });

  return {

    status:true,
    total:hasil.length,
    data:hasil

  };

}
