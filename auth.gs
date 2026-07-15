/*************************************************
 SIGAP RANI V4
 AUTH.GS
**************************************************/

function loginGuru(email, password) {

  const ss = SpreadsheetApp.openById("1VfH5Jdp6OdFHd_Igq5H_8lWeCliqvplpQYAvoCYRtro");

  const sheet = ss.getSheetByName("DATA GURU");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    const row = data[i];

    const nama = row[1];
    const mapel = row[2];
    const emailGuru = row[3];
    const passwordGuru = row[4];
    const level = row[5];

    if (
      String(emailGuru).trim().toLowerCase() ==
        String(email).trim().toLowerCase() &&
      String(passwordGuru).trim() ==
        String(password).trim()
    ) {

      return {

        status: true,

        message: "Login Berhasil",

        data: {

          nama: nama,

          email: emailGuru,

          mapel: mapel,

          level: level

        }

      };

    }

  }

  return {

    status: false,

    message: "Email atau Password Salah"

  };

}
