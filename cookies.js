function clearCookie() {
    document.cookie = "name=";
    document.cookie = "place=";
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
    document.cookie = "money=" + money;
    document.cookie = "taxes=" + taxes;
    document.cookie = "land=" + JSON.stringify(land);
    document.cookie = "realLand=" + JSON.stringify(land);
};

// clearCookie();
log(document.cookie);

answer.addEventListener("keyup", function (event) {
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
    // noinspection JSConstantReassignment
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
