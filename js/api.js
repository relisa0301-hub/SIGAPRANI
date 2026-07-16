async function postAPI(data){

    const formData = new FormData();

    for(const key in data){
        formData.append(key,data[key]);
    }

    const response = await fetch(CONFIG.API_URL,{
        method:"POST",
        body:formData
    });

    return await response.json();

}

async function getAPI(action){

    const response = await fetch(
        CONFIG.API_URL+"?action="+action
    );

    return await response.json();

}
