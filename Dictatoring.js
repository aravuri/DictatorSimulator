class PriorityQueue {
    constructor({comparator = (a, b) => a - b, initialValues = []} = {}) {
        this.comparator = comparator;
        this.data = initialValues;
        this.heapify();
    }

    peek() {
        if (this.size() === 0) {
            return null;
        }

        return this.data[0];
    }

    push(value) {
        this.data.push(value);
        this.bubbleUp(this.data.length - 1);
    }

    poll() {
        if (this.size() === 0) {
            return null;
        }

        const result = this.data[0];
        const last = this.data.pop();

        if (this.data.length > 0) {
            this.data[0] = last;
            this.bubbleDown(0);
        }

        return result;
    }

    clear() {
        this.data = [];
    }

    size() {
        return this.data.length;
    }

    isEmpty() {
        return this.data.length === 0;
    }

    toArray() {
        return this.data.slice(0).sort(this.comparator);
    }

    heapify() {
        if (this.data.length > 0) {
            for (let i = 1; i < this.data.length; i++) {
                this.bubbleUp(i);
            }
        }
    }

    bubbleUp(pos) {
        while (pos > 0) {
            let parent = (pos - 1) >>> 1;

            if (this.comparator(this.data[pos], this.data[parent]) < 0) {
                const temp = this.data[parent];
                this.data[parent] = this.data[pos];
                this.data[pos] = temp;
                pos = parent;
            } else {
                break;
            }
        }
    }

    bubbleDown(pos) {
        const last = this.data.length - 1;

        while (true) {
            let left = (pos << 1) + 1;
            let right = left + 1;
            let minIndex = pos;

            if (left <= last && this.comparator(this.data[left], this.data[minIndex]) < 0) {
                minIndex = left;
            }

            if (right <= last && this.comparator(this.data[right], this.data[minIndex]) < 0) {
                minIndex = right;
            }

            if (minIndex !== pos) {
                const temp = this.data[minIndex];
                this.data[minIndex] = this.data[pos];
                this.data[pos] = temp;
                pos = minIndex;
            } else {
                break;
            }
        }
    }
}
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
const explorersDisplay = document.getElementById("explorers");
const landLength = 51;
let explorers = 0;
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
let realLand = [];
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
let landData = {
    0: {time: undefined, difficulty: undefined},
    1: {time: 0.5, difficulty: 0.00001},
    2: {time: 4, difficulty: 0.1},
    3: {time: 2, difficulty: 0.03},
    4: {time: 2, difficulty: 0.03},
    5: {time: 1, difficulty: 0.00001},
    6: {time: 2, difficulty: 0.4},
    7: {time: 4, difficulty: 0.2},
    8: {time: 0.5, difficulty: 0.00001},
    9: {time: 6, difficulty: 0.01},
    10: {time: 3, difficulty: 0.05},
    11: {time: 4, difficulty: 0.05},
    12: {time: 3, difficulty: 0.00002},
    13: {time: 4, difficulty: 0.15},
    14: {time: 0.5, difficulty: 0.00001}
};
for (let i = 0; i < landLength; i++) {
    land.push([]);
    realLand.push([]);
}

for (let i = 0; i < landLength; i++) {
    for (let j = 0; j < landLength; j++) {
        land[i].push(0);
        realLand[i].push(Math.floor(Math.random() * 14) + 1)
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
        rect.onclick = function () {
            let x = confirm("Do you want to launch an expedition?");
            if (!x) {
                log("what");
                return;
            }
            log("ok let's start");
            explorers++;
            explorersDisplay.textContent = explorers;
            let bfs = new PriorityQueue({comparator: (a, b) => a[3] - b[3]});
            let visited = land.map((x) => new Array(x.length).fill(false));
            bfs.push([Math.ceil(landLength / 2), Math.ceil(landLength / 2), [], 0]);
            log(bfs.size());
            while (bfs.size() > 0) {
                let state = bfs.poll();
                let y = state[0];
                let x = state[1];
                let exploredLands = state[2];
                let danger = state[3];
                if (visited[y][x]) {
                    continue;
                }
                let thing = JSON.parse(JSON.stringify(exploredLands));
                thing.push([y, x]);
                visited[y][x] = true;
                log(x + " " + y + " " + danger + " " + exploredLands.toString());
                if (y === i && x === j) {
                    let k = 0;
                    let time = 0;
                    let dead = false;
                    for (k = 0; k < thing.length; k++) {
                        time += land[i][j] === 0 ? landData[realLand[thing[k][0]][thing[k][1]]].time : landData[realLand[thing[k][0]][thing[k][1]]].time / 4;
                        if (land[i][j] === 0 && Math.random() < landData[realLand[thing[k][0]][thing[k][1]]].difficulty) {
                            dead = true;
                            break;
                        }
                    }
                    log(time);
                    if (dead) {
                        setTimeout(function () {
                            explorers--;
                            population--;
                            alert("Your explorer died. Sorry.")
                        }, time * 1000)
                    } else {
                        setTimeout(function () {
                            for (k = 0; k < thing.length; k++) {
                                land[thing[k][0]][thing[k][1]] = realLand[thing[k][0]][thing[k][1]];
                            }
                            explorers--;
                            alert("Your explorer discovered things!")
                        }, time * 2 * 1000);
                    }
                    return;
                }
                if (y - 1 >= 0 && !visited[y - 1][x]) {
                    bfs.push([y - 1, x, JSON.parse(JSON.stringify(thing)), 1 - ((1 - danger) * (1 - (land[y - 1][x] === 0 ? landData[realLand[y - 1][x]].difficulty : 0)))]);
                }
                if (y + 1 < landLength && !visited[y + 1][x]) {
                    bfs.push([y + 1, x, JSON.parse(JSON.stringify(thing)), 1 - ((1 - danger) * (1 - (land[y + 1][x] === 0 ? landData[realLand[y + 1][x]].difficulty : 0)))]);
                }
                if (x - 1 >= 0 && !visited[y][x - 1]) {
                    bfs.push([y, x - 1, JSON.parse(JSON.stringify(thing)), 1 - ((1 - danger) * (1 - (land[y][x - 1] === 0 ? landData[realLand[y][x - 1]].difficulty : 0)))]);
                }
                if (x + 1 < landLength && !visited[y][x + 1]) {
                    bfs.push([y, x + 1, JSON.parse(JSON.stringify(thing)), 1 - ((1 - danger) * (1 - (land[y][x + 1] === 0 ? landData[realLand[y][x + 1]].difficulty : 0)))]);
                }
            }
        };
        landDisplay.appendChild(rect)
    }
}

land[Math.ceil(landLength / 2)][Math.ceil(landLength / 2)] = 1;
realLand[Math.ceil(landLength / 2)][Math.ceil(landLength / 2)] = 1;

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

window.onunload = function () {
};

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