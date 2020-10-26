// Shape types
const SHAPE_YELLOW_SQUARE = 0;
const SHAPE_RED_TRIANGLE = 1;
const SHAPE_BLUE_PENTAGON = 2;
const SHAPE_BLUE_ALPHA_PENTAGON = 3;
const SHAPE_GREEN_SQUARE = 4;
const SHAPE_GREEN_TRIANGLE = 5;
const SHAPE_GREEN_PENTAGON = 6;
const SHAPE_HEXAGON = 7;
const SHAPE_EGG = 8;
const SHAPE_HEPTAGON = 9;
const SHAPE_OCTAGON = 10;
const SHAPE_NONAGON = 11;

// Number of shape types. Increment when adding a new shape.
const NUM_SHAPE_TYPES = 12;

// Array of relative shape frequencies. Update when adding a new shape.
// NOTE that these frequencies don't need to add up to any particular number.
var SHAPE_FREQUENCIES = new Array();
SHAPE_FREQUENCIES[SHAPE_YELLOW_SQUARE] = 50000;
SHAPE_FREQUENCIES[SHAPE_EGG] = 10000;
SHAPE_FREQUENCIES[SHAPE_RED_TRIANGLE] = 10000;
SHAPE_FREQUENCIES[SHAPE_BLUE_PENTAGON] = 12000;
SHAPE_FREQUENCIES[SHAPE_HEXAGON] = 2000;
SHAPE_FREQUENCIES[SHAPE_HEPTAGON] = 2000;
SHAPE_FREQUENCIES[SHAPE_OCTAGON] = 2000;
SHAPE_FREQUENCIES[SHAPE_NONAGON] = 2000;
SHAPE_FREQUENCIES[SHAPE_BLUE_ALPHA_PENTAGON] = 9990;
SHAPE_FREQUENCIES[SHAPE_GREEN_SQUARE] = 3;
SHAPE_FREQUENCIES[SHAPE_GREEN_TRIANGLE] = 3;
SHAPE_FREQUENCIES[SHAPE_GREEN_PENTAGON] = 4;

var tempSum = 0;
for (var i = 0; i < NUM_SHAPE_TYPES; i++) {
    tempSum += SHAPE_FREQUENCIES[i];
}
// Sum of shape frequencies. Used when randomly picking shape type.
const SUM_SHAPE_FREQUENCIES = tempSum;

function Shape(x, y, stype) {
    this.type = stype;
    switch(stype) {
        case SHAPE_YELLOW_SQUARE:
            this.color = "#FFE869";
            this.numSides = 4;
            this.size = 20;
            this.maxHealth = 100;
            break;
        case SHAPE_RED_TRIANGLE:
            this.color = "#FC7677";
            this.numSides = 3;
            this.size = 20;
            this.maxHealth = 300;
            break;
        case SHAPE_BLUE_PENTAGON:
            this.color = "#768DFC";
            this.numSides = 5;
            this.size = 36;
            this.maxHealth = 1400;
            break;
        case SHAPE_BLUE_ALPHA_PENTAGON:
            this.color = "#768DFC";
            this.numSides = 5;
            this.size = 85;
            this.maxHealth = 20000;
            break;
        case SHAPE_GREEN_SQUARE:
            this.color =  "#92FF71";
            this.numSides = 4;
            this.size = 20;
            this.maxHealth = 2000;
            break;
        case SHAPE_GREEN_TRIANGLE:
            this.color = "#92FF71";
            this.numSides = 3;
            this.size = 25;
            this.maxHealth = 6000;
            break;
        case SHAPE_GREEN_PENTAGON:
            this.color = "#92FF71";
            this.numSides = 5;
            this.size = 36;
            this.maxHealth = 24000;
            break;
        case SHAPE_HEXAGON:
            this.color = "#EBB67B";
            this.numSides = 6;
            this.size = 52;
            this.maxHealth = 1700;
            break;
        case SHAPE_EGG:
            this.color = "#EEEEEE";
            this.numSides = 99;
            this.size = 8;
            this.maxHealth = 50;
            break;
        case SHAPE_HEPTAGON:
            this.color = "#AD009C";
            this.numSides = 7;
            this.size = 67;
            this.maxHealth = 2000;
            break;
        case SHAPE_OCTAGON:
            this.color = "#CA5E5F";
            this.numSides = 8;
            this.size = 83;
            this.maxHealth = 2300;
            break;
        case SHAPE_NONAGON:
            this.color = "#5E71CA";
            this.numSides = 9;
            this.size = 83;
            this.maxHealth = 2600;
    }

    this.health = this.maxHealth;
    this.initx = offset.totalx;
    this.inity = offset.totaly;
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.rotatespeed = Math.random() - 0.5;
    this.accelx = 0;
    this.accely = 0;
}

function createRandomShape() {
    // Choose random shape type based on shape frequencies
    var random = Math.random() * SUM_SHAPE_FREQUENCIES;
    var stype;
    var totalFrequency = 0;
    for (stype = 0; stype < NUM_SHAPE_TYPES; stype++) {
        totalFrequency += SHAPE_FREQUENCIES[stype];
        if (random < totalFrequency) break;
    }

    return new Shape((Math.random() * c.width), (Math.random() * c.height), stype);
}

function drawShape(shape) {
    drawPoly(shape.x, shape.y, shape.size, shape.angle, shape.color, shape.numSides);

    if (shape.health < shape.maxHealth) {
        ctx.fillStyle = "#555555";
        ctx.roundRect(shape.x - shape.size, shape.y + shape.size + 10, shape.size * 2, 10, 3).fill();
        ctx.fillStyle = "#86C680";
        ctx.roundRect(shape.x - shape.size + 2, shape.y + shape.size + 12, (shape.size * 2) * (shape.health / shape.maxHealth) - 2, 6, 3).fill();
    }
}
