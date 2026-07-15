async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const info = document.getElementById("info");

    if (email === "" || password === "") {
        info.innerHTML = "Email dan Password harus diisi.";
        return;
    }

    info.innerHTML = "Sedang login...";

    try {

        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "login",
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (result.status) {

            localStorage.setItem(
                CONFIG.SESSION_KEY,
                JSON.stringify(result.data)
            );

            window.location.href = "dashboard.html";

        } else {

            info.innerHTML = result.message;

        }

    } catch (e) {

        info.innerHTML = "Koneksi ke server gagal.";

    }

}
