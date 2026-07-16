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

        window.location="dashboard.html";

    }else{

        info.innerHTML=hasil.message;

    }

}
