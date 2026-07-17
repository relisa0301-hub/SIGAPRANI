async function postAPI(data){

    const response = await fetch(CONFIG.API_URL,{
        method:"POST",
        headers:{
            "Content-Type":"text/plain;charset=utf-8"
        },
        body:JSON.stringify(data)
    });

    return await response.json();

}

async function getAPI(action){

    const response = await fetch(
        CONFIG.API_URL+"?action="+action
        async function getBelumHadir(kelas,jam,mapel){

    return await postAPI({

        action:"belumHadir",

        kelas:kelas,

        jam:jam,

        mapel:mapel

    });

}
    );

    return await response.json();

}
