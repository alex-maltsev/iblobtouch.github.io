var c = document.getElementById('game'),
    ctx = c.getContext('2d');
// resize the canvas to fill browser window dynamically

// Barrel types
const BARREL_GUN = 0;
const BARREL_TRAP_LAYER = 1;
const BARREL_DRONE_MAKER = 2;
const BARREL_NECRO_DRONE_MAKER = 3;
const BARREL_AUTO_TURRET = 4;

var autofire = false;
var autospin = false;
var editmode = false;
var shiftheld = false;
var autoangle = 0;
var dronelimit = 0;
var necrolimit = 0;
var tankalpha = 1;
var shapetimer = 120;
var undos = [];
var mirrorBarrels = 1;
var nearestShape = null;
var newGraph = true;

var tankpointx = c.width / 2;
var tankpointy = c.height / 2;

var offset = {};
offset.x = 0;
offset.y = 0;
offset.totalx = 0;
offset.totaly = 0;

var accel = {};
accel.x = 0;
accel.y = 0;
accel.amount = 0.005;
accel.max = 1;

var input = {};
input.up = false;
input.down = false;
input.left = false;
input.right = false;
input.f = false;

var mouse = {};
mouse.x = 0;
mouse.y = 0;
mouse.held = false;
mouse.rightdown = false;

function Barrel(a, type) {
    this.angle = a;
    //Angle is the offset from the angle from mouse to tank.
    this.xoffset = parseFloat(validateField(document.getElementById("offsetx").value, 0, true));
    //xoffset affect how far into the tank the barrel it.
    this.yoffset = parseFloat(validateField(document.getElementById("offset").value, 0, true));
    //yoffset affect how far away from the center the barrel rotates.
    this.width = parseFloat(validateField(document.getElementById("width").value, 20));
    //width affects the width of the barrel.
    this.baselength = parseFloat(validateField(document.getElementById("length").value, 60));
    //baselength is the starting length of the barrel.
    this.length = parseFloat(validateField(document.getElementById("length").value, 60));
    //length affects the width of the barrel.
    this.basereload = parseFloat(validateField(document.getElementById("reload").value * 60, 120));
    //basereload is the maximum delay between shots in frames.
    this.reload = 0;
    //Reload is how many frames until the barrel can fire again.
    this.basedelay = parseFloat(validateField(document.getElementById("basedelay").value * 60, 0));
    //basedelay is the maximum delay before first shot.
    this.delay = 0;
    //delay is how many frames until the barrel first fire.
    this.delayed = true;
    //delayed is a toggle to ensure the delay script runs only once each time it's needed.
    this.hasKnockBack = true;
    //Does firing a bullet from this barrel knock you back?
    this.type = type;
    //0 = bullet firer, 1 = trap layer, 2 = drone maker.
    this.knockback = parseFloat(validateField(document.getElementById("knockback").value, 0, false)) / 10;
    this.disabled = document.getElementById("disable").checked;
    this.spread = parseFloat(validateField(document.getElementById("spread").value, 0, false));
    this.image = document.getElementById("barrellImage").value;
    this.color = document.getElementById("barrellcolor").value;
    this.bulletColor = document.getElementById("bulletColor").value;

    if (document.getElementById("use").checked === false) {
        // Using custom bullet parameters
        this.bulletSize = parseFloat(validateField(document.getElementById("size").value - 10, 5, false));
        this.bulletSpeed = parseFloat(validateField(document.getElementById("speed").value, 1, false)) / 10; 
        this.bulletLifetime = parseFloat(validateField(document.getElementById("time").value * 60, 180, false));
    } else {
        // Using default bullet parameters based on barrel dimensions
        this.bulletSize = parseFloat(validateField(document.getElementById("width").value, 20)) / 2;
        this.bulletSpeed = parseFloat(validateField(document.getElementById("length").value, 60)) / 10; 
        this.bulletLifetime = 360;
    }
    this.damage = parseFloat(validateField(document.getElementById("damage").value, 10, false));
    this.comment = "";
}

//Array containing all the barrels, each entry is a Barrel object.
var barrels = [];

function Bullet(barrel, x, y, targetx, targety, spr, color) {
    this.xoffset = barrel.xoffset;
    this.yoffset = barrel.yoffset;
    this.x = x;
    this.y = y;
    this.bangle = barrel.angle + (Math.random() * spr) - (spr / 2);
    this.size = barrel.bulletSize;
    this.knockback = barrel.knockback;
    this.damage = barrel.damage;
    this.speed = barrel.bulletSpeed;
    this.health = 100;
    this.distance = barrel.length;
    this.time = barrel.bulletLifetime;
    this.type = barrel.type;
    this.targetx = targetx;
    this.targety = targety;
    this.initoffx = offset.totalx;
    this.initoffy = offset.totaly;
    this.transparency = 1;
    this.color = color;
}

function isDrone(bullet) {
    return bullet.type === BARREL_DRONE_MAKER || bullet.type === BARREL_NECRO_DRONE_MAKER;
}

// Array containing all the bullets. Each entry is a Bullet object.
var bullets = [];

// Array containing all the shapes. Each entry is a Shape object.
var shapes = [];

function angle(cx, cy, ex, ey) {
    var dy = ey - cy,
        dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    //theta *= (Math.PI / 180);
    return theta;
}

function editButtonClick() {
    if (editmode === false) {
        editmode = true;
        autofire = false;
        autospin = false;
        accel.x = 0;
        accel.y = 0;
        tankalpha = 1.0;
        showhide("visible", "hidden", "hidden", "hidden", "visible", "hidden", "hidden", "hidden", "hidden");
    } else {
        editmode = false;
        showhide("hidden", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden");
    }
}

function bodyClick() {
    showhide("visible", "visible", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden");
}

function barrelClick() {
    showhide("visible", "hidden", "visible", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden");
}

function bulletClick() {
    showhide("visible", "hidden", "hidden", "visible", "hidden", "hidden", "hidden", "hidden", "hidden");
}

function saveClick() {
    showhide("visible", "hidden", "hidden", "hidden", "visible", "hidden", "hidden", "hidden", "hidden");
}

function infoClick() {
    showhide("visible", "hidden", "hidden", "hidden", "hidden", "visible", "hidden", "hidden", "hidden");
}

function settingsClick() {
    showhide("visible", "hidden", "hidden", "hidden", "hidden", "hidden", "visible", "hidden", "hidden");
}

function changeClick() {
    showhide("visible", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden", "visible", "hidden");
}

function expClick() {
    showhide("visible", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden", "hidden", "visible");
}

function showhide(e, bo, ba, bu, sa, inf, se, cha, exp) {
    var elements = document.getElementsByClassName("editbuttons");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = e;
    }

    elements = document.getElementsByClassName("tanksettings");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = bo;
        if (elements[i].classList.contains("custom")) {
            if (document.getElementById("shape").value === "custom") {
                elements[i].style.visibility = bo;
            } else {
                elements[i].style.visibility = "hidden";
            }
        }
    }

    elements = document.getElementsByClassName("barrelsettings");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = ba;
    }

    elements = document.getElementsByClassName("bulletsettings");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = bu;
    }

    elements = document.getElementsByClassName("savesettings");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = sa;
    }

    elements = document.getElementsByClassName("infosettings");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = inf;
    }

    elements = document.getElementsByClassName("settingssettings");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = se;
    }

    elements = document.getElementsByClassName("changelog");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = cha;
    }

    elements = document.getElementsByClassName("expsettings");

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.visibility = exp;
    }
}

function validateField(value, returnval, ignoreneg) {
    if (value.length == 0) {
        return returnval;
    }
    if ((value < 0) && (ignoreneg !== true)) {
        return returnval;
    }
    if (isNaN(value) === true) {
        return returnval;
    } else {
        return value;
    }
}

function printObject() {
    var barreltext = "";
    var outtext = parseFloat(validateField(document.getElementById("body").value, 0, true)) + "*" + document.getElementById("shape").value + "*" + document.getElementById("color").value + "*" + document.getElementById("scolo").value + "*" + parseFloat(validateField(document.getElementById("customsides").value, 0, true)) + "/" + parseFloat(validateField(document.getElementById("customssides").value, 0, true)) + "/" + parseFloat(validateField(document.getElementById("customdistance").value, 0, true)) + "/" + parseFloat(validateField(document.getElementById("customsdist").value, 0, true)) + "/" + parseFloat(validateField(document.getElementById("customangle").value, 0, true)) + "/" + parseFloat(validateField(document.getElementById("customsangle").value, 0, true)) + "/" + parseFloat(validateField(document.getElementById("customssize").value, 0, true)) + "[";
    for (var i = 0; i < barrels.length; i += 1) {
        let barrel = barrels[i];
        //Prevents timers from outputting current times to code.
        barrel.reload = 0;
        barrel.delay = 0;
        barrel.delayed = true;

        outtext += JSON.stringify(barrel);
        if (i < barrels.length - 1) {
            outtext += ", ";
        }
    }
    outtext += "]";
    document.getElementById("save").value = outtext;
}

function xdistancefrom(x, y, cx, cy, distance, aoffset) {
    var anglefrom = (angle(x, y, cx, cy) + aoffset) * (Math.PI / 180);
    return Math.cos(anglefrom) * (distance);
    //return cx - x;
}

function ydistancefrom(x, y, cx, cy, distance, aoffset) {
    var anglefrom = (angle(x, y, cx, cy) + aoffset) * (Math.PI / 180);
    return Math.sin(anglefrom) * (distance);
    //return cy - y;
}

//Completely resets tank.
function clearObject() {
    document.getElementById("body").value = 32;
    document.getElementById("shape").value = "circle";
    document.getElementById("color").value = "#00b2e1";
    document.getElementById("scolo").value = "#555555";
    barrels = [];
}

function clearShapes() {
    shapes = [];
}

function clearBullets() {
    bullets = [];
}

//These functions do nothing on their own. They are for development purposes.
function debugCommandA() {}

function debugCommandB() {}

function debugCommandC() {}
//End of debug commands.

function importObject() {
    var inputtext = "" + document.getElementById("save").value;

    if (inputtext.length < 1) {
        return;
    }

    var firstAst = inputtext.indexOf("*");
    var secondAst = inputtext.indexOf("*", firstAst + 1);
    var thirdAst = inputtext.indexOf("*", secondAst + 1);
    var fourthAst = inputtext.indexOf("*", thirdAst + 1);
    var firstSlash = inputtext.indexOf("/", fourthAst + 1);
    var secondSlash = inputtext.indexOf("/", firstSlash + 1);
    var thirdSlash = inputtext.indexOf("/", secondSlash + 1);
    var fourthSlash = inputtext.indexOf("/", thirdSlash + 1);
    var fifthSlash = inputtext.indexOf("/", fourthSlash + 1);
    var sixthSlash = inputtext.indexOf("/", fifthSlash + 1);
    var bracketOpen = inputtext.indexOf("[", sixthSlash);
    var bracketClose = inputtext.lastIndexOf("]");

    // Defaults
    document.getElementById("body").value = 32;
    document.getElementById("shape").value = "circle";
    document.getElementById("color").value = "#00b2e1";
    document.getElementById("scolo").value = "#555555";
    barrels = [];

    // Barrels
    if (bracketOpen > -1, bracketClose > -1) {
        barrels = JSON.parse(inputtext.substr(bracketOpen, bracketClose - bracketOpen + 1));
        // Ignore everything after the brackts
        inputtext = inputtext.substr(0, bracketOpen);
    }

    // Find color location

    if (sixthSlash > -1 && inputtext.length > sixthSlash) {
        document.getElementById("customssize").value = inputtext.substr(sixthSlash + 1);
        inputtext = inputtext.substr(0, sixthSlash);
    }

    if (fifthSlash > -1 && inputtext.length > fifthSlash) {
        document.getElementById("customsangle").value = inputtext.substr(fifthSlash + 1);
        inputtext = inputtext.substr(0, fifthSlash);
    }

    if (fourthSlash > -1 && inputtext.length > fourthSlash) {
        document.getElementById("customangle").value = inputtext.substr(fourthSlash + 1);
        inputtext = inputtext.substr(0, fourthSlash);
    }

    if (thirdSlash > -1 && inputtext.length > thirdSlash) {
        document.getElementById("customsdist").value = inputtext.substr(thirdSlash + 1);
        inputtext = inputtext.substr(0, thirdSlash);
    }

    if (secondSlash > -1 && inputtext.length > secondSlash) {
        document.getElementById("customdistance").value = inputtext.substr(secondSlash + 1);
        inputtext = inputtext.substr(0, secondSlash);
    }

    if (firstSlash > -1 && inputtext.length > firstSlash) {
        document.getElementById("customssides").value = inputtext.substr(firstSlash + 1);
        inputtext = inputtext.substr(0, firstSlash);
    }

    if (fourthAst > -1 && inputtext.length > fourthAst) {
        document.getElementById("customsides").value = inputtext.substr(fourthAst + 1);
        inputtext = inputtext.substr(0, fourthAst);
    }

    var scoloIndex = -1;
    if (thirdAst > -1 && inputtext[thirdAst + 1] === "#") {
        scoloIndex = thirdAst;
    } else if (secondAst > -1 && inputtext[secondAst + 1] === "#") {
        scoloIndex = secondAst;
    }

    if (scoloIndex > -1) {
        var scoloCode = inputtext.substr(scoloIndex + 1, 7);
        if (scoloCode.length === 7) {
            document.getElementById("scolo").value = scoloCode
        }
        inputtext = inputtext.substr(0, scoloIndex);
    }

    var colorIndex = -1;
    if (secondAst > -1 && inputtext[secondAst + 1] === "#") {
        colorIndex = secondAst;
    } else if (firstAst > -1 && inputtext[firstAst + 1] === "#") {
        colorIndex = firstAst;
    }

    if (colorIndex > -1) {
        var colorCode = inputtext.substr(colorIndex + 1, 7);
        if (colorCode.length === 7) {
            document.getElementById("color").value = colorCode
        }
        inputtext = inputtext.substr(0, colorIndex);
    }

    if (firstAst > -1 && inputtext.length > firstAst) {
        document.getElementById("shape").value = inputtext.substr(firstAst + 1);
        inputtext = inputtext.substr(0, firstAst);
    }

    if (inputtext.length > 0 && !isNaN(inputtext)) {
        document.getElementById("body").value = inputtext
    }

    for (let barrel of barrels) {
        if (barrel.image === undefined) {
            barrel.image = "rectangle";
            barrel.color = "#888888";
        }
        if (barrel.bulletColor === undefined) {
            barrel.bulletColor = "#ffffff";
        }
    }
    undos = [];
}

function graClick() {
    if (newGraph === true) {
        newGraph = false;
        document.getElementById("graphicButton").innerHTML = "Old";
    } else if (newGraph === false) {
        newGraph = true;
        document.getElementById("graphicButton").innerHTML = "New";
    }
}

function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#",
        c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

function updateList() {
    var elements = document.getElementsByClassName("tanksettings");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains("custom")) {
            if (document.getElementById("shape").value === "custom") {
                elements[i].style.visibility = "visible";
            } else {
                elements[i].style.visibility = "hidden";
            }
        }
    }
}
