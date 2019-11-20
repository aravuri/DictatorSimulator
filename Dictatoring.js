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
const landDisplay = document.getElementById("landDisplay");
const landLength = 101;
let money = 3000000000;
let birthrate = 0.00002082191;
let name, place;
let population = 329968629;
let taxes = 0;
let days = 0;
let pps = 0;
let mps = 0;
let temperature = 22; //Imperial Scum.
let pollution = 0;
let currmenu = menus[0];
let powerPerDay = 0;
let waterPerDay = 0;
let averageWages = 68815.9090909091/365;
let averageMoney = 114457.142857143;
let averageExpenses = 164.55;
let land = [];
let landColors = {
    0: "fill: rgb(0, 0, 0)", //Undiscovered
    1: "fill: rgb(51, 204, 51)", //Grassland
    2: "fill: rgb(102, 102, 153)", //Mountain
    3: "fill: rgb(0, 204, 255)", //Lake
    4: "fill: rgb(51, 204, 204)", //Ocean
    5: "fill: rgb(255, 204, 0)", //Beach
    6: "fill: rgb(255, 255, 0)", //Desert
    7: "fill: rgb(128, 0, 0)", //Volcano
    8: "fill: rgb(51, 204, 51)", //Hills
    9: "fill: rgb(51, 102, 0)", //Swamp
    10: "fill: rgb(0, 102, 0)", //Jungle
    11: "fill: rgb(204, 255, 255)", //Ice Plains
    12: "fill: rgb(204, 153, 0)", //Savanna
    13: "fill: rgb(204, 255, 255)", //Taiga
    14: "fill: rgb(51, 204, 51)" //Forest
};

for (let i = 0; i < landLength; i++) {
    land.push([]);
}

for (let i = 0; i < landLength; i++) {
    for (let j = 0; j < landLength; j++) {
        land[i].push(0);
    }
}

for (let i = 0; i < landLength; i++) {
    for (let j = 0; j < landLength; j++) {
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.id = i + "-" + j + "-rect";
        rect.classList.add(i + "-row");
        rect.classList.add(j + "-col");
        rect.setAttributeNS(null, 'x', j * 1010 / landLength);
        rect.setAttributeNS(null, 'y', i * 1010 / landLength);
        rect.setAttributeNS(null, 'height', '' + 1010 / landLength);
        rect.setAttributeNS(null, 'width', '' + 1010 / landLength);
        landDisplay.appendChild(rect)
    }
}

land[Math.ceil(landLength / 2)][Math.ceil(landLength / 2)] = 1;

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
    averageMoney += averageWages - averageExpenses;
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

    for (let i = 0; i < landLength; i++) {
        for (let j = 0; j < landLength; j++) {
            document.getElementById(i + "-" + j + "-rect").setAttributeNS(null, 'style', landColors[land[i][j]]);
        }
    }

    days++;
    daycounter.textContent = days;
}
