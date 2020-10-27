function drawBarrel(a, xoffset, yoffset, width, length, alpha, isghost, type, image, colour) {
    ctx.save();
    length = Math.abs(length);
    width = Math.abs(width);
    ctx.strokeStyle = getStrokeStyle(colour);
    ctx.lineWidth = 5;
    ctx.fillStyle = colour;
    ctx.globalAlpha = alpha;
    ctx.translate(tankpointx, tankpointy, 0);
    if (editmode === false) {
        ctx.rotate((angle(tankpointx, tankpointy, mouse.x, mouse.y) + a) * (Math.PI / 180));
    } else if ((isghost === true) && (shiftheld === true)) {
        a -= a % (document.getElementById("increment").value);
        ctx.rotate(a * (Math.PI / 180));
    } else {
        ctx.rotate(a * (Math.PI / 180));
    }

    if (image === "leftTriangle") {
        ctx.beginPath();
        ctx.moveTo(xoffset + length / 2, -(width / 2) - yoffset);
        ctx.lineTo(xoffset + length / 2, (width / 2) - yoffset);
        ctx.lineTo(xoffset + length, (width / 2) - yoffset);
        ctx.lineTo(xoffset + length / 2, -(width / 2) - yoffset);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (image === "rightTriangle") {
        ctx.beginPath();
        ctx.moveTo(xoffset + length / 2, -(width / 2) - yoffset);
        ctx.lineTo(xoffset + length / 2, (width / 2) - yoffset);
        ctx.lineTo(xoffset + length, -(width / 2) - yoffset);
        ctx.lineTo(xoffset + length / 2, -(width / 2) - yoffset);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (image === "trap") {
        ctx.beginPath();
        ctx.moveTo(xoffset + length / 2, -(width / 2) - yoffset);
        ctx.lineTo(xoffset + length / 2 + (length / 2), 0 - ((width * 1.5) + yoffset));
        ctx.lineTo(xoffset + length / 2 + (length / 2), ((width * 1.5) - yoffset));
        ctx.lineTo(xoffset + length / 2, (width / 2) - yoffset);
        ctx.lineTo(xoffset + length / 2, -(width / 2) - yoffset);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (image === "circle") {
        ctx.rotate(0 * (Math.PI / 180));
        ctx.beginPath();
        ctx.arc(xoffset + length, yoffset, length / 2 + 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (image === "single") {
        ctx.fillRect(xoffset, 0 - ((width / 2) + yoffset), length, width);
        ctx.strokeRect(xoffset, 0 - ((width / 2) + yoffset), length, width);
        ctx.beginPath();
        ctx.moveTo(15 + xoffset, -(width) - yoffset);
        ctx.lineTo(47.5 + xoffset, 0 - ((width / 2) + yoffset));
        ctx.lineTo(47.5 + xoffset, ((width / 2) - yoffset));
        ctx.lineTo(15 + xoffset, (width) - yoffset);
        ctx.lineTo(15 + xoffset, -(width) - yoffset);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else {
        switch (type) {
            case BARREL_GUN:
                ctx.fillRect(xoffset, 0 - ((width / 2) + yoffset), length, width);
                ctx.strokeRect(xoffset, 0 - ((width / 2) + yoffset), length, width);
                break;
            case BARREL_TRAP_LAYER:
                ctx.beginPath();
                ctx.moveTo(xoffset + length, -(width / 2) - yoffset);
                ctx.lineTo(xoffset + length + (length / 2), 0 - ((width * 1.5) + yoffset));
                ctx.lineTo(xoffset + length + (length / 2), ((width * 1.5) - yoffset));
                ctx.lineTo(xoffset + length, (width / 2) - yoffset);
                ctx.lineTo(xoffset + length, -(width / 2) - yoffset);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.fillRect(xoffset, 0 - ((width / 2) + yoffset), length, width);
                ctx.strokeRect(xoffset, 0 - ((width / 2) + yoffset), length, width);
                break;
            case BARREL_DRONE_MAKER:
            case BARREL_NECRO_DRONE_MAKER:
                ctx.beginPath();
                ctx.moveTo(xoffset + 20, -(width / 4) - yoffset);
                ctx.lineTo(xoffset + 20 + (length / 2), 0 - ((width / 2) + yoffset) - (width / 4));
                ctx.lineTo(xoffset + 20 + (length / 2), ((width / 2) - yoffset) + (width / 4));
                ctx.lineTo(xoffset + 20, (width / 4) - yoffset);
                ctx.lineTo(xoffset + 20, -(width / 4) - yoffset);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case BARREL_AUTO_TURRET:
                ctx.translate(xoffset + parseInt(validateField(document.getElementById("body").value, 32)), -((width / 2) + yoffset));
                if (!editmode && nearestShape !== null) {
                    ctx.rotate(((angle(tankpointx, tankpointy, mouse.x, mouse.y) + a) * -1) * (Math.PI / 180));
                    ctx.rotate(angle(tankpointx + xoffset + parseFloat(validateField(document.getElementById("body").value, 32)), tankpointy - ((width / 2) + yoffset), nearestShape.x, nearestShape.y) * (Math.PI / 180));
                }
                ctx.fillRect(0, 0, length, width);
                ctx.strokeRect(0, 0, length, width);
                ctx.beginPath();
                ctx.arc(0, width / 2, width, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
        }
    }
    ctx.restore();
}

// Draw the given Bullet object
function drawBullet(bullet) {
    switch (bullet.type) {
        case BARREL_GUN:
        case BARREL_AUTO_TURRET:
            drawCircle(bullet.x, bullet.y, bullet.size, bullet.transparency, bullet.color);
            break;
        case BARREL_TRAP_LAYER:
            drawTrap(bullet.x, bullet.y, bullet.size, bullet.angle, bullet.transparency, bullet.color);
            break;
        case BARREL_DRONE_MAKER:
            drawPoly(bullet.x, bullet.y, bullet.size, angle(bullet.x, bullet.y, mouse.x, mouse.y), bullet.color, 3);
            break;
        case BARREL_NECRO_DRONE_MAKER:
            drawPoly(bullet.x, bullet.y, bullet.size, angle(bullet.x, bullet.y, mouse.x, mouse.y), bullet.color, 4);
            break;
        default:
            console.log("Bad bullet type: " + bullet.type);
    }
}

// Draws the part of the tank body that goes below the barrels
function drawTankBase(shape, tankSize, orientationAngle) {
    //Dominator Base
    if (shape === "dominator") {
        ctx.save();
        ctx.globalAlpha = tankalpha;
        ctx.fillStyle = document.getElementById("scolo").value;
        ctx.globalAlpha = tankalpha;
        drawPoly(tankpointx, tankpointy, tankSize * 1.3, orientationAngle, document.getElementById("scolo").value, 6)
    }

    //Protector Base
    if (shape === "base") {
        ctx.save();
        ctx.globalAlpha = tankalpha;
        ctx.fillStyle = document.getElementById("scolo").value;
        ctx.globalAlpha = tankalpha;
        drawPoly(tankpointx, tankpointy, tankSize * 1.3, orientationAngle + 22.5, document.getElementById("scolo").value, 8)
    }
}

// Draws the part of the tank body that goes above the barrels
function drawTankBody(shape, tankSize, orientationAngle) {
    if (shape === "circle") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(tankpointx, tankpointy, tankSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(tankpointx - tankSize, tankpointy - tankSize, tankSize * 2, tankSize * 2);
        ctx.restore();
        drawTankBodyCircle(tankSize);
    }
    if (shape === "square") {
        ctx.globalAlpha = tankalpha;
        drawPoly(tankpointx, tankpointy, tankSize + 12, orientationAngle + 45, document.getElementById("color").value, 4)
    }
    if (shape === "triangle") {
        ctx.globalAlpha = tankalpha;
        drawPoly(tankpointx, tankpointy, tankSize + 9, orientationAngle - 30, document.getElementById("color").value, 3)
    }
    if (shape === "pentagon") {
        ctx.globalAlpha = tankalpha;
        drawPoly(tankpointx, tankpointy, tankSize + 10, orientationAngle + 18, document.getElementById("color").value, 5)
    }
    if (shape === "mothership") {
        ctx.globalAlpha = tankalpha;
        drawPoly(tankpointx, tankpointy, tankSize * 1.3, orientationAngle, document.getElementById("color").value, 16)
    }
    if (shape === "rect") {
        ctx.globalAlpha = tankalpha;
        drawRect(tankpointx, tankpointy, tankSize, orientationAngle, document.getElementById("color").value)
    }
    if (shape === "smasher") {
        ctx.save();
        ctx.globalAlpha = tankalpha;
        ctx.fillStyle = document.getElementById("scolo").value;
        drawPoly(tankpointx, tankpointy, tankSize * 1.3, orientationAngle, document.getElementById("scolo").value, 6)
        ctx.save();
        ctx.beginPath();
        ctx.arc(tankpointx, tankpointy, tankSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(tankpointx - tankSize, tankpointy - tankSize, tankSize * 2, tankSize * 2);
        ctx.restore();
        drawTankBodyCircle(tankSize);
    }
    if (shape === "spike") {
        ctx.save();
        ctx.globalAlpha = tankalpha;
        ctx.fillStyle = document.getElementById("scolo").value;
        drawConc(tankpointx, tankpointy, tankSize * 1.4, orientationAngle, document.getElementById("scolo").value, 12, (tankSize + 4) / 1.2)
        ctx.save();
        ctx.beginPath();
        ctx.arc(tankpointx, tankpointy, tankSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(tankpointx - tankSize, tankpointy - tankSize, tankSize * 2, tankSize * 2);
        ctx.restore();
        drawTankBodyCircle(tankSize);
    }
    if (shape === "landmine") {
        ctx.save();
        ctx.globalAlpha = tankalpha;
        ctx.fillStyle = document.getElementById("scolo").value;
        drawPoly(tankpointx, tankpointy, tankSize * 1.3, orientationAngle, document.getElementById("scolo").value, 6)
        ctx.save();
        ctx.beginPath();
        ctx.arc(tankpointx, tankpointy, tankSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(tankpointx - tankSize, tankpointy - tankSize, tankSize * 2, tankSize * 2);
        ctx.restore();
        drawTankBodyCircle(tankSize);
    }
    if (shape === "dominator") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(tankpointx, tankpointy, tankSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(tankpointx - tankSize, tankpointy - tankSize, tankSize * 2, tankSize * 2);
        ctx.restore();
        drawTankBodyCircle(tankSize);
    }
    if (shape === "base") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(tankpointx, tankpointy, tankSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(tankpointx - tankSize, tankpointy - tankSize, tankSize * 2, tankSize * 2);
        ctx.restore();
        drawTankBodyCircle(tankSize);
    }
    if (shape === "trap") {
        ctx.globalAlpha = tankalpha;
        drawConc(tankpointx, tankpointy, tankSize + 3, orientationAngle + 90, document.getElementById("color").value, 3, (tankSize + 3) / 2.5)
    }
    if (shape === "drive") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(tankpointx, tankpointy, tankSize, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(tankpointx - tankSize, tankpointy - tankSize, tankSize * 2, tankSize * 2);
        ctx.restore();
        drawTankBodyCircle(tankSize);
        ctx.globalAlpha = tankalpha;
        drawPoly(tankpointx, tankpointy, tankSize / 1.5, orientationAngle + 45, ColorLuminance(document.getElementById("color").value, document.getElementById("luminance").value), 4)
    }
    if (shape === "custom") {
        var customangle = parseFloat(validateField(document.getElementById("customangle").value, 0));
        var customsangle = parseFloat(validateField(document.getElementById("customsangle").value, 0));
        ctx.save();
        ctx.globalAlpha = tankalpha;
        ctx.fillStyle = document.getElementById("scolo").value;
        drawConc(tankpointx, tankpointy, document.getElementById("customssize").value, orientationAngle + customsangle, document.getElementById("scolo").value, document.getElementById("customssides").value, document.getElementById("customssize").value / document.getElementById("customsdist").value);
        drawConc(tankpointx, tankpointy, tankSize, orientationAngle + customangle, document.getElementById("color").value, document.getElementById("customsides").value, tankSize / document.getElementById("customdistance").value);
    }
}

function drawTankBodyCircle(tankSize) {
    drawCircle(tankpointx, tankpointy, tankSize, tankalpha, "#ffffff");
}

function drawCircle(x, y, size, transparency, color) {
    var bColor = "";
    if (color === "#ffffff") {
        bColor = document.getElementById("color").value;
    } else {
        bColor = color;
    }

    ctx.save();
    ctx.strokeStyle = getStrokeStyle(bColor);
    ctx.lineWidth = 5;
    ctx.fillStyle = bColor;
    ctx.globalAlpha = transparency;
    ctx.beginPath();
    ctx.arc(x, y, size + 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawTrap(x, y, size, angle, transparency, color) {
    var bColor = "";
    if (color === "#ffffff") {
        bColor = document.getElementById("color").value;
    } else {
        bColor = color;
    }

    ctx.save();
    ctx.strokeStyle = getStrokeStyle(bColor);
    ctx.lineWidth = 5;
    ctx.fillStyle = bColor;
    ctx.globalAlpha = transparency;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, size / 3);
    ctx.rotate(60 * (Math.PI / 180));
    ctx.lineTo(0, size);
    ctx.rotate(60 * (Math.PI / 180));
    ctx.lineTo(0, size / 3);
    ctx.rotate(60 * (Math.PI / 180));
    ctx.lineTo(0, size);
    ctx.rotate(60 * (Math.PI / 180));
    ctx.lineTo(0, size / 3);
    ctx.rotate(60 * (Math.PI / 180));
    ctx.lineTo(0, size);
    ctx.rotate(60 * (Math.PI / 180));
    ctx.lineTo(0, size / 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawDrone(x, y, size, angle, color) {
    var bColor = "";
    if (color === "#ffffff") {
        bColor = document.getElementById("color").value;
    } else {
        bColor = color;
    }

    ctx.save();
    ctx.strokeStyle = getStrokeStyle(bColor);
    ctx.lineWidth = 5;
    ctx.fillStyle = bColor;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.rotate(angle * (Math.PI / 180));
    ctx.moveTo(0, size);
    ctx.rotate(120 * (Math.PI / 180));
    ctx.lineTo(0, size);
    ctx.rotate(120 * (Math.PI / 180));
    ctx.lineTo(0, size);
    ctx.rotate(120 * (Math.PI / 180));
    ctx.lineTo(0, size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawNecro(x, y, size, angle, color) {
    var bColor = "";

    if (color === "#ffffff") {
        bColor = document.getElementById("color").value;
    } else {
        bColor = color;
    }

    ctx.save();
    ctx.fillStyle = bColor;
    ctx.strokeStyle = getStrokeStyle(bColor);
    ctx.lineWidth = 10;
    ctx.translate(x, y);
    ctx.rotate(angle * (Math.PI / 180));
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, r) {
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + width, y, x + width, y + height, r);
    this.arcTo(x + width, y + height, x, y + height, r);
    this.arcTo(x, y + height, x, y, r);
    this.arcTo(x, y, x + width, y, r);
    this.closePath();
    return this;
};

function drawPoly(x, y, size, angle, color, sides) {
    ctx.save();
    ctx.strokeStyle = getStrokeStyle(color);
    ctx.lineWidth = 5;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(angle * (Math.PI / 180));
    ctx.beginPath();
    for (i = 0; i < sides; i++) {
        ctx.rotate((360 / sides) * (Math.PI / 180));
        ctx.lineTo(0, size);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawConc(x, y, size, angle, color, sides, poly) {
    ctx.save();
    ctx.strokeStyle = getStrokeStyle(color);
    ctx.lineWidth = 5;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(angle * (Math.PI / 180));
    ctx.beginPath();
    for (i = 0; i < sides; i++) {
        ctx.rotate(360 / (sides * 2) * (Math.PI / 180));
        ctx.lineTo(0, poly);
        ctx.rotate(360 / (sides * 2) * (Math.PI / 180));
        ctx.lineTo(0, size);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawRect(x, y, size, angle, color) {
    ctx.save();
    ctx.strokeStyle = getStrokeStyle(color);
    ctx.lineWidth = 5;
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(angle * (Math.PI / 180));
    ctx.beginPath();
    ctx.rect(-size / 2, -size, size, size * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function getStrokeStyle(color) {
    return newGraph ? ColorLuminance(color, document.getElementById("luminance").value) : "#555555";
}