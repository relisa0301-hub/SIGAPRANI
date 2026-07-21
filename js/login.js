async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const info = document.getElementById("info");

    if(email=="" || password==""){
        info.innerHTML="Email dan Password harus diisi";
        return;
    }

    info.innerHTML="Sedang login...";

    const hasil = await postAPI({

        action:"login",

        email:email,

        password:password

    });

    if(hasil.status){

        localStorage.setItem(
            CONFIG.SESSION_KEY,
            JSON.stringify(hasil.data)
        );

        const level = String(hasil.data.level).toLowerCase().trim();

        if(level=="superadmin"){

            window.location="superadmin.html";

        }else if(level=="admin"){

            window.location="admin.html";

        }else{

            window.location="dashboard.html";

        }

    }else{

        info.innerHTML=hasil.message;

    }

}
