const ask = document.getElementById("ask");
const question = document.getElementById("question");
const daycounter = document.getElementById("day-counter");
const answer = document.getElementById("answer");
const submit = document.getElementById("submit");
const navbar = document.getElementById("navbar");
const buyMenu = document.getElementById("buymenu");
const dictatorMenu = document.getElementById("dictatorMenu");
const moneyText = document.getElementById("money");
const populationText = document.getElementById("population");
const taxValue = document.getElementById("taxValue");
const taxSlider = document.getElementById("taxes");
const waterPerDayText = document.getElementById("waterperday");
const menus = document.getElementsByClassName("menu");
const powerPerDayText = document.getElementById("powerperday");
let money = 3000000000;
let birthrate = 0.00002082191;
let name, place;
let population = 329968629;
let taxes = 0;
let days = 0;
let pps = 0;
let mps = 0;
let currmenu = menus[0];
let powerPerDay = 0;
let waterPerDay = 0;
let averageWages = 68815.9090909091/365;
let averageMoney = 114457.142857143;


let log = function (X) {
    console.log(X);
};

function clearCookie() {
    document.cookie = "name=";
    document.cookie = "place=";
}

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// clearCookie();

let unshrinkify = function (x) {
    x = x + "";
    let c = x.charAt(x.length - 1);
    if (c === "T") {
        return parseFloat(x.substring(0, x.length - 1))*1000000000000;
    } else if (c === "B") {
        return parseFloat(x.substring(0, x.length - 1))*1000000000;
    } else if (c === "M") {
        return parseFloat(x.substring(0, x.length - 1))*1000000;
    } else if (c === "K") {
        return parseFloat(x.substring(0, x.length - 1))*1000;
    }
    return parseFloat(x);
};

let shrinkify = function (x) {
    if (Math.abs(x) / 1000000000000 >= 1) {
        return Math.round(x/1000000000)/1000 + "T";
    } else if (Math.abs(x) / 1000000000 >= 1) {
        return Math.round(x/1000000)/1000 + "B";
    } else if (Math.abs(x) / 1000000 >= 1) {
        return Math.round(x/1000)/1000 + "M";
    } else if (Math.abs(x) / 1000 >= 1) {
        return Math.round(x)/1000 + "K";
    }
    return x;
};
log(document.cookie);

taxSlider.oninput = function() {
    taxes = this.value;
    taxValue.textContent = taxes;
};

answer.addEventListener("keyup", function(event) {
    if (event.key.toLowerCase() === "enter") {
        event.preventDefault();
        submit.click();
    }
});

function askName() {
    ask.classList.remove("hidden");
    question.textContent = "What is your name?";
    submit.onclick = gotName;
    log("ask name");
}

function gotName() {
    name = answer.value;
    answer.value = '';
    document.cookie = "name=" + name;
    log(name);
    ask.classList.add("hidden");
    if (getCookie("place").length === 0) {
        askPlace()
    } else {
        place = getCookie("place");
        log(place);
        startGame();
    }
    log("got name");
}

function askPlace() {
    ask.classList.remove("hidden");
    question.textContent = "What is the name of your country?";
    submit.onclick = gotPlace;
    log("ask place");
}

function gotPlace() {
    place = answer.value;
    answer.value = '';
    document.cookie = "place=" + place;
    log(place);
    ask.classList.add("hidden");
    log("got place");
    log(document.cookie);
    startGame();
}

function startGame() {
    taxSlider.value = 16;
    taxes = taxSlider.value;
    taxValue.textContent = taxes;
    navbar.classList.remove("hidden");
    buyMenu.classList.remove("hidden");
    dictatorMenu.classList.remove("hidden");
    update();
    setInterval(update, 1000);
}
for (let i = 0; i < menus.length; i++) {
    menus[i].addEventListener('click', function () {
        document.getElementById(currmenu.textContent + "Buy").classList.add("hidden");
        log(currmenu);
        currmenu = this;
        log(currmenu);
        document.getElementById(currmenu.textContent + "Buy").classList.remove("hidden");
    })
}
if (getCookie("name").length === 0) {
    askName();
} else {
    name = getCookie("name");
    log(name);
    if (getCookie("place").length === 0) {
        askPlace();
    } else {
        place = getCookie("place");
        log(place);
        startGame();
    }
}

function update() {  // Assuming that each update is a day
    averageMoney += averageWages;
    let change = averageWages * (taxes / 100.0);  // People are taxed by income, not by the amount of money they have

    mps = Math.floor(change * population);
    averageMoney -= change;
    averageMoney = Math.max(0, averageMoney);

    pps = Math.floor(population * birthrate * rand(0.875, 1.125));

    money += mps;
    population += pps;
    moneyText.textContent = shrinkify(money);
    populationText.textContent = shrinkify(population);
    powerPerDayText.textContent = shrinkify(powerPerDay);
    waterPerDayText.textContent = shrinkify(waterPerDay);

    days++;
    daycounter.textContent = days;
}
