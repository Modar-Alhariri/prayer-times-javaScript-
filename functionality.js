

let nextPrayerTime = null;

// تشغيل التطبيق مباشرة
getPrayerTimes(31.9539, 35.9106); 

// ==========================
// 1. الموقع
// ==========================
function getLocation(){

    navigator.geolocation.getCurrentPosition(

        (position)=>{

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            getPrayerTimes(lat, lon);

        },

        ()=> alert("يجب السماح بالموقع لتشغيل التطبيق")

    );
}


// ==========================
// 2. API
// ==========================
function getPrayerTimes(lat, lon){

    axios.get(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=4`
    )
    .then(res=>{

        const data = res.data.data;
        const t = data.timings;

        // city
        document.getElementById("city-name").innerHTML = data.meta.timezone;

        //time
        setInterval(()=>{
            document.getElementById("current-time").innerHTML =
                new Date().toLocaleTimeString();
        },1000);

        //  prays
        document.getElementById("fajr").innerHTML = t.Fajr;

        document.getElementById("t_fajr").innerHTML = t.Fajr;
        document.getElementById("t_sunrise").innerHTML = t.Sunrise;
        document.getElementById("t_dhuhr").innerHTML = t.Dhuhr;
        document.getElementById("t_asr").innerHTML = t.Asr;
        document.getElementById("t_maghrib").innerHTML = t.Maghrib;
        document.getElementById("t_isha").innerHTML = t.Isha;

        calculateNextPrayer(t);

    });

}



//  time format

function toDate(time){

    const now = new Date();
    const [h,m] = time.split(":");

    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
}



// nedxt pray
function calculateNextPrayer(t){

    const prayers = [
        {name:"الفجر", time:t.Fajr},
        {name:"الظهر", time:t.Dhuhr},
        {name:"العصر", time:t.Asr},
        {name:"المغرب", time:t.Maghrib},
        {name:"العشاء", time:t.Isha}
    ];

    const now = new Date();
    let next = null;

    for(let p of prayers){

        const pt = toDate(p.time);

        if(now < pt){
            next = {name:p.name, time:pt};
            break;
        }
    }

    if(!next){
        next = {name:"الفجر", time:toDate(t.Fajr)};
        next.time.setDate(next.time.getDate()+1);
    }

    document.getElementById("next-prayer").innerHTML = next.name;

    nextPrayerTime = next.time;

    startCountdown();
}



// remaining time to necxt pray

function startCountdown(){

    setInterval(()=>{

        const now = new Date();
        const diff = nextPrayerTime - now;

        const h = Math.floor(diff/1000/60/60);
        const m = Math.floor(diff/1000/60)%60;
        const s = Math.floor(diff/1000)%60;

        document.getElementById("remaining-time").innerHTML =
            `${h}:${m}:${s}`;

    },1000);
}

