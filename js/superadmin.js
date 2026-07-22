const user=JSON.parse(localStorage.getItem(CONFIG.SESSION_KEY));

if(!user){

location="index.html";

}

if(String(user.level).toLowerCase()!="super admin"){

alert("Akses ditolak");

location="dashboard.html";

}

function logout(){

localStorage.removeItem(CONFIG.SESSION_KEY);

location="index.html";

}
