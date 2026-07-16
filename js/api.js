async function postAPI(data) {
    try {
        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Gagal POST ke API:", error);
        return { status: "error", message: "Gagal menghubungi server. Cek koneksi internet." };
    }
}

async function getAPI(action) {
    try {
        const response = await fetch(
            CONFIG.API_URL + "?action=" + action
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Gagal GET dari API:", error);
        return { status: "error", message: "Gagal menghubungi server. Cek koneksi internet." };
    }
}