async function postAPI(data){

    const response = await fetch(CONFIG.API_URL,{

        method:"POST",

        body:JSON.stringify(data)

    });

    return await response.json();

}
