function clearCookie() {
    document.cookie = "name=";
    document.cookie = "place=";
}

clearCookie();
var unshrinkify = function (x) {
    x = x + "";
    var c = x.charAt(x.length - 1);
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
var shrinkify = function (x) {
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

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
var birthrate = 0.0189;
var name, place;
var ask = document.getElementById("ask");
var question = document.getElementById("question");
var answer = document.getElementById("answer");
var submit = document.getElementById("submit");
var navbar = document.getElementById("navbar");
var buyMenu = document.getElementById("buymenu");
var dictatorMenu = document.getElementById("dictatorMenu");
var money = 1000000000;
var moneyText = document.getElementById("money");
var population = 100;
var populationText = document.getElementById("population");
var taxValue = document.getElementById("taxValue");
var taxSlider = document.getElementById("taxes");
var taxes = 0;
taxes = taxSlider.value;
taxSlider.oninput = function() {
    taxes = this.value;
    taxValue.textContent = taxes;
};
var pps = 0;
var mps = 0;
var menus = document.getElementsByClassName("menu");
var currmenu = menus[0];
var powerPerDay = 0;
var powerPerDayText = document.getElementById("powerperday");
var waterPerDay = 0;
var waterPerDayText = document.getElementById("waterperday");
var averageWages = 120;
var averageMoney = 500000;
console.log(document.cookie);
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
    console.log("ask name");
}

function gotName() {
    name = answer.value;
    answer.value = '';
    document.cookie = "name=" + name;
    console.log(name);
    ask.classList.add("hidden");
    if (getCookie("place").length === 0) {
        askPlace()
    } else {
        place = getCookie("place");
        console.log(place);
        startGame();
    }
    console.log("got name");
}
function askPlace() {
    ask.classList.remove("hidden");
    question.textContent = "What is the name of your country?";
    submit.onclick = gotPlace;
    console.log("ask place");
}
function gotPlace() {
    place = answer.value;
    answer.value = '';
    document.cookie = "place=" + place;
    console.log(place);
    ask.classList.add("hidden");
    console.log("got place");
    console.log(document.cookie);
    startGame();
}
function startGame() {
    navbar.classList.remove("hidden");
    buyMenu.classList.remove("hidden");
    dictatorMenu.classList.remove("hidden");
    update();
    setInterval(update, 1000);
}
for (let i = 0; i < menus.length; i++) {
    menus[i].addEventListener('click', function () {
        document.getElementById(currmenu.textContent + "Buy").classList.add("hidden");
        console.log(currmenu);
        currmenu = this;
        console.log(currmenu);
        document.getElementById(currmenu.textContent + "Buy").classList.remove("hidden");
    })
}
if (getCookie("name").length === 0) {
    askName();
} else {
    name = getCookie("name");
    console.log(name);
    if (getCookie("place").length === 0) {
        askPlace();
    } else {
        place = getCookie("place");
        console.log(place);
        startGame();
    }
}
function update() {
    averageMoney += averageWages;
    let change = averageMoney*taxes;
    mps = Math.floor(change*population);
    averageMoney -= change;
    averageMoney = Math.max(0, averageMoney);
    pps = 0;
    for (let i = 0; i < population; i++) {
        let x = Math.random();
        if (x <= birthrate) {
            console.log(x);
            pps++;
        }
    }
    money += mps;
    population += pps;
    moneyText.textContent = shrinkify(money);
    populationText.textContent = shrinkify(population);
    powerPerDayText.textContent = shrinkify(powerPerDay);
    waterPerDayText.textContent = shrinkify(waterPerDay);
}
