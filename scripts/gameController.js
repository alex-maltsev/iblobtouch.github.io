function drawMovement() {

    offset.totalx += accel.x;
    offset.totaly += accel.y;

    offset.x += accel.x;
    offset.y += accel.y;

    offset.x %= 26;
    offset.y %= 26;

    drawStuff();

    if ((input.left === true) && (accel.x > -accel.max)) {
        accel.x -= accel.amount;
        if (accel.x > 0) {
            accel.x -= accel.amount;
        }
    } else if ((input.right === true) && (accel.x < accel.max)) {
        accel.x += accel.amount;
        if (accel.x < 0) {
            accel.x += accel.amount;
        }
    } else {
        if (accel.x > 0) {
            accel.x -= accel.amount;
        }
        if (accel.x < 0) {
            accel.x += accel.amount;
        }
    }

    if ((input.down === true) && (accel.y > -accel.max)) {
        accel.y -= accel.amount;
        if (accel.y > 0) {
            accel.y -= accel.amount;
        }
    } else if ((input.up === true) && (accel.y < accel.max)) {
        accel.y += accel.amount;
        if (accel.y < 0) {
            accel.y += accel.amount;
        }
    } else {
        if (accel.y > 0) {
            accel.y -= accel.amount;
        }
        if (accel.y < 0) {
            accel.y += accel.amount;
        }
    }
    if (accel.x > accel.max) {
        accel.x -= accel.amount * 4;
    }
    if (accel.y > accel.max) {
        accel.y -= accel.amount * 4;
    }
    if (accel.x < -accel.max) {
        accel.x += accel.amount * 4;
    }
    if (accel.y < -accel.max) {
        accel.y += accel.amount * 4;
    }
    if (editmode === false) {
        if (((accel.x > -0.1) && (accel.x < 0.1)) && ((accel.y > -0.1) && (accel.y < 0.1))) {
            if ((tankalpha > 0.2) && (document.getElementById("invis").checked === true)) {
                tankalpha -= 0.002;
            }
        } else if (tankalpha < 1) {
            tankalpha += 0.002;
        }
    }

    tankpointx = c.width / 2 - accel.x * 20;
    tankpointy = c.height / 2 - accel.y * 20;
}

function drawTank() {
    var tankpointx = c.width / 2 - accel.x * 20;
    var tankpointy = c.height / 2 - accel.y * 20;

    var tankSize = parseFloat(validateField(document.getElementById("body").value, 32));
    var shape = document.getElementById("shape").value;
    var mouseAngle = angle(tankpointx, tankpointy, mouse.x, mouse.y);
    var orientationAngle = editmode ? 0 : mouseAngle;

    drawTankBase(shape, tankSize, orientationAngle);

    if (editmode === false) {
        if (document.getElementById("spawn").checked === true) {
            if (shapetimer > document.getElementById("shaperate").value) {
                shapetimer = document.getElementById("shaperate").value;
            } else if (shapetimer > 1) {
                shapetimer -= 1;
            } else {
                shapetimer = document.getElementById("shaperate").value;
                shapetimer = 120;
                shapes[shapes.length] = createRandomShape();
            }
        }
        for (var n = 0; n < shapes.length; n += 1) {
            let shape = shapes[n];

            if (Math.sqrt(Math.pow(shape.x - tankpointx, 2) + Math.pow(shape.y - tankpointy, 2)) < tankSize + shape.size / 2) {
                if (shape.health > parseFloat(validateField(document.getElementById("bodydamage").value, 50))) {
                    shape.health -= parseFloat(validateField(document.getElementById("bodydamage").value, 50));
                    shape.accelx += Math.cos(angle(tankpointx, tankpointy, shape.x, shape.y) * (Math.PI / 180));
                    shape.accely += Math.sin(angle(tankpointx, tankpointy, shape.x, shape.y) * (Math.PI / 180));
                    accel.x += Math.cos(angle(tankpointx, tankpointy, shape.x, shape.y) * (Math.PI / 180)) / 5;
                    accel.y += Math.sin(angle(tankpointx, tankpointy, shape.x, shape.y) * (Math.PI / 180)) / 5;
                } else {
                    shapes.splice(n, 1);
                    nShape = 0;
                }
            }

            if (Math.sqrt(Math.pow(shape.x - tankpointx, 2) + Math.pow(shape.y - tankpointy, 2)) < (Math.sqrt(Math.pow(shapes[nShape].x - tankpointx, 2) + Math.pow(shapes[nShape].y - tankpointy, 2)))) {
                nShape = n;
            }

            drawShape(shape);

            shape.x -= shape.initx - offset.totalx - shape.accelx;
            shape.y -= shape.inity - offset.totaly - shape.accely;

            shape.initx = offset.totalx;
            shape.inity = offset.totaly;

            shape.angle += shape.rotatespeed;

            if ((shape.accelx > 0.1) || (shape.accelx < -0.1)) {
                shape.accelx -= shape.accelx * 0.1;
            } else {
                shape.accelx = 0;
            }

            if ((shape.accely > 0.1) || (shape.accely < -0.1)) {
                shape.accely -= shape.accely * 0.1;
            } else {
                shape.accely = 0;
            }

            for (var i = 0; i < bullets.length; i += 1) {
                if ((shape.x + shape.size + shape.accelx + (offset.totalx - bullets[i].initoffx) >= bullets[i].x + (offset.totalx - bullets[i].initoffx)) && (shape.x - shape.size + (offset.totalx - bullets[i].initoffx) <= bullets[i].x + bullets[i].size + (offset.totalx - bullets[i].initoffx) + shape.accelx)) {
                    if ((shape.y + shape.size + shape.accely + (offset.totaly - bullets[i].initoffy) >= bullets[i].y + (offset.totaly - bullets[i].initoffy)) && (shape.y - shape.size + (offset.totaly - bullets[i].initoffy) <= bullets[i].y + bullets[i].size + (offset.totaly - bullets[i].initoffy) + shape.accely)) {
                        console.log("Collision!");
                        if (shape.health > bullets[i].damage) {
                            shape.health -= bullets[i].damage;
                            shape.accelx += Math.cos(angle(bullets[i].x, bullets[i].y, shape.x, shape.y) * (Math.PI / 180)) * (bullets[i].size / 10);
                            shape.accely += Math.sin(angle(bullets[i].x, bullets[i].y, shape.x, shape.y) * (Math.PI / 180)) * (bullets[i].size / 10);
                        } else {
                            if ((bullets[i].type === 3) && (necrolimit < 20)) {
                                bullets[bullets.length] = bullets[i];
                                bullets[bullets.length - 1].x = shape.x;
                                bullets[bullets.length - 1].y = shape.y;
                            }
                            shapes.splice(n, 1);
                            nShape = 0;
                        }
                        if (bullets[i].type === 2) {
                            dronelimit -= 1;
                        }
                        if (bullets[i].type === 3) {
                            necrolimit -= 1;
                        }
                        bullets.splice(i, 1);
                    }
                }
            }
        }
    }

    for (var n = 0; n < barrels.length; n += 1) {
        let barrel = barrels[n];
        if (((mouse.held === true) || (autofire === true) || ((barrel.type === 4) && (shapes.length > 0))) && (editmode === false)) {
            var canfire = true;
            if (barrel.hasOwnProperty("disabled") === true) {
                if (barrel.disabled === false) {
                    canfire = false;
                }
            }

            var damage = 10;
            if (barrel.hasOwnProperty("damage") === true) {
                damage = barrel.damage;
            }

            //Starts delay timer & disables it being run a second time
            if ((barrel.delay <= 0) && (barrel.basedelay > 0) && (barrel.delayed === true)) {
                barrel.delay = barrel.basedelay;
                barrel.delayed = false;
            }

            if ((barrel.delay === 0) && (barrel.reload === 0) && (canfire === true) && (barrel.type < 2 || barrel.type === 4 || (((barrel.type === 2) && (dronelimit < parseFloat(validateField(document.getElementById("drones").value, 8, false)))) || ((barrel.type === 3) && (necrolimit < parseFloat(validateField(document.getElementById("necrodrones").value, 20, false))))))) {
                if (barrel.hasOwnProperty("knockback") === false) {
                    barrel.knockback = 0;
                }

                var ydif = xdistancefrom(c.width / 2, c.height / 2, mouse.x + ((mouse.x - tankpointx) * barrel.length) - accel.x, mouse.y + ((mouse.y - tankpointy) * barrel.length) - accel.y, barrel.yoffset, barrel.angle);
                var xdif = ydistancefrom(c.width / 2, c.height / 2, mouse.x + ((mouse.x - tankpointx) * barrel.length) - accel.x, mouse.y + ((mouse.y - tankpointy) * barrel.length) - accel.y, barrel.yoffset, barrel.angle);

                if (barrel.hasOwnProperty("b") === true) {
                    if ((barrel.type < 4) || (shapes.length === 0)) {
                        bullets[bullets.length] = new Bullet(barrel, barrel.b[0], barrel.b[1], barrel.b[2],
                            xdistancefrom(tankpointx, tankpointy, mouse.x, mouse.y, barrel.length + barrel.xoffset, barrel.angle) + tankpointx + xdif,
                            ydistancefrom(tankpointx, tankpointy, mouse.x, mouse.y, barrel.length + barrel.xoffset, barrel.angle) + tankpointy - ydif,
                            mouse.x + ((mouse.x - tankpointx) * barrel.length + barrel.xoffset) - accel.x,
                            mouse.y + ((mouse.y - tankpointy) * barrel.length + barrel.xoffset) - accel.y, barrel.spread, barrel.bulletColor);
                    } else {
                        bullets[bullets.length] = new Bullet(barrel, barrel.b[0], barrel.b[1], barrel.b[2],
                            xdistancefrom(tankpointx, tankpointy, mouse.x, mouse.y, tankSize, barrel.angle) + tankpointx + xdif,
                            ydistancefrom(tankpointx, tankpointy, mouse.x, mouse.y, tankSize, barrel.angle) + tankpointy - ydif,
                            shapes[nShape].x + ((shapes[nShape].x - tankpointx) * barrel.length + barrel.xoffset) - accel.x,
                            shapes[nShape].y + ((shapes[nShape].y - tankpointy) * barrel.length + barrel.xoffset) - accel.y, barrel.spread, barrel.bulletColor);
                    }
                } else {
                    bullets[bullets.length] = new Bullet(barrel, barrel.width / 2, 5, 360,
                        xdistancefrom(tankpointx, tankpointy, mouse.x, mouse.y, barrel.length + barrel.xoffset, barrel.angle) + tankpointx + xdif,
                        ydistancefrom(tankpointx, tankpointy, mouse.x, mouse.y, barrel.length + barrel.xoffset, barrel.angle) + tankpointy - ydif,
                        mouse.x + ((mouse.x - tankpointx) * barrel.length + barrel.xoffset) - accel.x,
                        mouse.y + ((mouse.y - tankpointy) * barrel.length + barrel.xoffset) - accel.y, 0, barrel.bulletColor);
                }
                barrel.reload = barrel.basereload;

                tankalpha = 1.0;

                if (barrel.hasKnockBack == true) {
                    accel.x += Math.cos((angle(c.width / 2, c.height / 2, mouse.x, mouse.y) + barrel.angle) * (Math.PI / 180)) * (bullets[bullets.length - 1].knockback);
                    accel.y += Math.sin((angle(c.width / 2, c.height / 2, mouse.x, mouse.y) + barrel.angle) * (Math.PI / 180)) * (bullets[bullets.length - 1].knockback);
                }
                if (barrel.type === 1) {
                    bullets[bullets.length - 1].time *= 5;
                }
                if (barrel.type === 2) {
                    dronelimit += 1;
                } else {
                    necrolimit += 1;
                }
            }
        } else {
            if ((barrel.delay <= 0) && ((barrel.delay < barrel.basedelay) || (barrel.basedelay <= 0))) {
                barrel.delayed = true;
            }
        }

        //Reenables delay timer
    }

    //Delay timer
    for (let barrel in barrels) {
        if (barrel.hasOwnProperty("delay") === false) {
            barrel.delay = 0
        } else if (barrel.delay > 0) {
            barrel.delay -= 1;
        }
    }

    if ((autospin === true)) {
        autoangle += 0.5;
        console.log(autoangle + 180);
    }

    if (editmode === false) {
        moveBullets();
    }

    //Loop through each barrel.
    for (var n = 0; n < barrels.length; n += 1) {
        let barrel = barrels[n];
        if (barrel.reload > (barrel.basereload / 8) * 7) {
            barrel.length -= (barrel.length / barrel.basereload);
            //If reload is > 3/4ths of its max value, reduce the length of the barrel.
        } else if (barrel.reload > (barrel.basereload / 8) * 6) {
            barrel.length += (barrel.length / barrel.basereload);
            //otherwise if reload is > 2/4ths of its max value, increase the length of the barrel.
        } else {
            barrel.length = barrel.baselength;
            //For the rest of the reload cycle, set it back to its inital length.
        }
        if (barrel.reload > 0) {
            barrel.reload -= 1;
        }
        var anglePlace = mouseAngle;
        if (anglePlace < 0) {
            anglePlace = 360 + anglePlace;
        }
        if ((anglePlace >= barrel.angle - 1) && (anglePlace <= barrel.angle + 1) && (editmode === true)) {
            drawBarrel(barrel.angle, barrel.xoffset, barrel.yoffset, barrel.width, barrel.length, 0.5, false, barrel.type, barrel.image, barrel.color);
            if (input.f === true) {
                barrels.splice(n, 1);
            }
        } else if ((barrel.type < 4) || ((barrel.xoffset >= 0) || barrel.xoffset < -1 * tankSize)) {
            drawBarrel(barrel.angle, barrel.xoffset, barrel.yoffset, barrel.width, barrel.length, tankalpha, false, barrel.type, barrel.image, barrel.color);
        }
    }

    var btype = parseInt(document.getElementById("barrel_type").value);

    if (editmode === true) {
        if (btype !== BARREL_AUTO_TURRET || ((parseFloat(validateField(document.getElementById("offsetx").value, 0, true)) >= 0) || (parseFloat(validateField(document.getElementById("offsetx").value, 0, true)) < -1 * tankSize))) {
            for (var n = 1; n <= mirrorBarrels; n += 1) {
                drawBarrel((mouseAngle + 360 + ((360 / mirrorBarrels) * n)) % 360, parseFloat(validateField(document.getElementById("offsetx").value, 0, true)), parseFloat(validateField(document.getElementById("offset").value, 0, true)), parseFloat(validateField(document.getElementById("width").value, 1)), parseFloat(validateField(document.getElementById("length").value, 1)), 0.5, true, btype, document.getElementById("barrellImage").value, document.getElementById("barrellcolor").value);
                //Draw a ghosted barrel while in edit mode above the normal barrels.
            }
        }
    } else if (autospin === true) {
        mouse.x = (Math.cos((autoangle + 180) * (Math.PI / 180)) * 200) + tankpointx;
        mouse.y = (Math.sin((autoangle + 180) * (Math.PI / 180)) * 200) + tankpointy;
    }

    drawTankBody(shape, tankSize, orientationAngle);

    //Loop through each barrel.
    for (var n = 0; n < barrels.length; n += 1) {
        let barrel = barrels[n];
        if (editmode === true && (mouseAngle >= barrel.angle - 1) && (mouseAngle <= barrel.angle + 1)) {
            drawBarrel(barrel.angle, barrel.xoffset, barrel.yoffset, barrel.width, barrel.length, 0.5, false, barrel.type, barrel.image, barrel.color);
            if (input.f === true) {
                barrels.splice(n, 1);
            }
        } else if ((barrel.type === 4) && ((barrel.xoffset < 0) && (barrel.xoffset > -2 * tankSize))) {
            drawBarrel(barrel.angle, barrel.xoffset, barrel.yoffset, barrel.width, barrel.length, tankalpha, false, barrel.type, barrel.image, barrel.color);
        }
    }

    if (editmode === true) {
        if (btype === BARREL_AUTO_TURRET && ((parseFloat(validateField(document.getElementById("offsetx").value, 0, true)) < 0) && (parseFloat(validateField(document.getElementById("offsetx").value, 0, true)) > -2 * tankSize))) {
            for (var n = 1; n <= mirrorBarrels; n += 1) {
                drawBarrel((mouseAngle + 360 + ((360 / mirrorBarrels) * n)) % 360, parseFloat(validateField(document.getElementById("offsetx").value, 0, true)), parseFloat(validateField(document.getElementById("offset").value, 0, true)), parseFloat(validateField(document.getElementById("width").value, 1)), parseFloat(validateField(document.getElementById("length").value, 1)), 0.5, true, btype, document.getElementById("barrellImage").value, document.getElementById("barrellcolor").value);
                //Draw a ghosted barrel while in edit mode above the normal barrels.
            }
        }
    }
}

function moveBullets() {
    for (var n = 0; n < bullets.length; n += 1) {
        let bullet = bullets[n];

        if (bullet.type > 1) {
            for (var i = 0; i < bullets.length; i += 1) {
                if ((bullets[i].type > 1) && (i != n) && (bullet.x >= bullets[i].x - bullets[i].size) && (bullet.x <= bullets[i].x + bullets[i].size) && (bullet.y >= bullets[i].y - bullets[i].size) && (bullet.y <= bullets[i].y + bullets[i].size)) {
                    bullet.x += (bullet.x - bullets[i].x) * 0.05;
                    bullet.y += (bullet.y - bullets[i].y) * 0.05;
                }
            }
        }

        if ((bullet.type === 1) && (bullet.speed > 0)) {
            bullet.speed -= bullet.speed * 0.005;
            //If it's a trap, decrease speed each tick.
        }

        if (((bullet.type === 2) || (bullet.type === 3)) && (mouse.rightdown === false)) {
            bullet.targetx = mouse.x;
            bullet.targety = mouse.y;

            bullet.x += xdistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed / 2, 0) + (offset.totalx - bullet.initoffx);

            bullet.y += ydistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed / 2, 0) + (offset.totaly - bullet.initoffy);

            bullet.initoffx = offset.totalx;
            bullet.initoffy = offset.totaly;
        } else if (((bullet.type === 2) || (bullet.type === 3)) && (mouse.rightdown === true)) {
            bullet.targetx = mouse.x;
            bullet.targety = mouse.y;

            bullet.x -= xdistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed / 2, 0) + (offset.totalx - bullet.initoffx);

            bullet.y -= ydistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed / 2, 0) + (offset.totaly - bullet.initoffy);

            bullet.initoffx = offset.totalx;
            bullet.initoffy = offset.totaly;
        } else if ((bullet.type === 1) || (bullet.type === 4)) {

            bullet.targetx += xdistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed, bullet.bangle);
            bullet.targety += ydistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed, bullet.bangle);

            bullet.x += xdistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed, bullet.bangle) + (offset.totalx - bullet.initoffx);

            bullet.y += ydistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed, bullet.bangle) + (offset.totaly - bullet.initoffy);

            bullet.initoffx = offset.totalx;
            bullet.initoffy = offset.totaly;

            //Get the bullets current x and y based on distance, offset and angle.
        } else {

            bullet.targetx += xdistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed, bullet.bangle);
            bullet.targety += ydistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed, bullet.bangle);

            bullet.x += xdistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed, bullet.bangle) + (offset.totalx - bullet.initoffx);

            bullet.y += ydistancefrom(bullet.x, bullet.y, bullet.targetx, bullet.targety, bullet.speed, bullet.bangle) + (offset.totaly - bullet.initoffy);

            bullet.initoffx = offset.totalx;
            bullet.initoffy = offset.totaly;
        }

        drawBullet(bullet);

        if (bullet.time <= 20) {
            bullet.transparency = bullet.time / 20;
        }
        if (bullet.time <= 1) {
            bullets.splice(n, 1);
            //When a bullet times out, delete it.
        } else if ((bullet.type < 2) || (bullet.type == 4)) {
            bullet.time -= 1;
            //If it's a bullet, decrease it's time left to live by 1 each frame.
        }
    }
}

function drawUI() {
    ctx.save();
    ctx.font = "16px ubuntu";

    if (autofire === true) {
        ctx.fillStyle = "rgba(120, 120, 209, 0.5)";
        ctx.fillRect(c.width / 2 - 78, 10, 156, 30);
        ctx.fillStyle = "white";
        ctx.font = "bold 20px ubuntu";
        ctx.fillText("Auto Fire: ON", c.width / 2 - 60, 32);
    } else {
        ctx.fillStyle = "rgba(120, 120, 209, 0.5)";
        ctx.fillRect(c.width / 2 - 78, 10, 156, 30);
        ctx.fillStyle = "white";
        ctx.font = "bold 20px ubuntu";
        ctx.fillText("Auto Fire: OFF", c.width / 2 - 64, 32);
    }

    if (autospin === true) {
        ctx.fillStyle = "rgba(120, 120, 209, 0.5)";
        ctx.fillRect(c.width / 2 - 78, 50, 156, 30);
        ctx.fillStyle = "white";
        ctx.font = "bold 20px ubuntu";
        ctx.fillText("Auto Spin: ON", c.width / 2 - 60, 72);
    } else {
        ctx.fillStyle = "rgba(120, 120, 209, 0.5)";
        ctx.fillRect(c.width / 2 - 78, 50, 156, 30);
        ctx.fillStyle = "white";
        ctx.font = "bold 20px ubuntu";
        ctx.fillText("Auto Spin: OFF", c.width / 2 - 64, 72);
    }

    ctx.restore();
}

function drawManager() {
    drawMovement();

    drawTank();

    drawUI();
}

function placeBarrel() {
    var rangle = angle(tankpointx, tankpointy, mouse.x, mouse.y) + 360;

    // User is holding Shift to set angle in increments
    if (shiftheld === true) {
        rangle -= rangle % (document.getElementById("increment").value);
    }

    var btype = parseInt(document.getElementById("barrel_type").value);
    for (var n = 1; n <= mirrorBarrels; n += 1) {
        barrels[barrels.length] = new Barrel((rangle + 360 + ((360 / mirrorBarrels) * n)) % 360, btype, parseFloat(validateField(document.getElementById("size").value - 10, 5, false)), parseFloat(validateField(document.getElementById("speed").value, 1, false)) / 10, parseFloat(validateField(document.getElementById("time").value * 60, 180, false)));
    }
}

function keyDownHandler(e) {
    "use strict";
    if ((e.keyCode === 65) || (e.keyCode === 37)) {
        input.right = true;
    }
    if ((e.keyCode === 68) || (e.keyCode === 39)) {
        input.left = true;
    }
    if ((e.keyCode === 87) || (e.keyCode === 38)) {
        input.up = true;
    }
    if ((e.keyCode === 83) || (e.keyCode === 40)) {
        input.down = true;
    }
    if (e.keyCode === 69) {
        if ((autofire === false) && (editmode === false)) {
            autofire = true;
        } else {
            autofire = false;
        }
    }
    if (e.keyCode === 67) {
        if ((autospin === false) && (editmode === false)) {
            autoangle = angle(tankpointx, tankpointy, mouse.x, mouse.y) + 180;
            autospin = true;
        } else {
            autospin = false;
        }
    }
    if (e.keyCode === 16) {
        shiftheld = true;
    }
    if (e.keyCode === 81) {
        if (editmode === true) {
            placeBarrel();
        }
    }
    if (e.keyCode === 70) {
        input.f = true;
    }
    if (editmode === true) {
        if (e.keyCode === 90) {
            undo();
        }
        if (e.keyCode === 88) {
            redo();
        }
        if (e.keyCode === 79) {
            mirrorBarrels += 1;
        }
        if ((e.keyCode === 80) && (mirrorBarrels > 1)) {
            mirrorBarrels -= 1;
        }
    }
}

function keyUpHandler(e) {
    "use strict";
    if ((e.keyCode === 65) || (e.keyCode === 37)) {
        input.right = false;
    }
    if ((e.keyCode === 68) || (e.keyCode === 39)) {
        input.left = false;
    }
    if ((e.keyCode === 87) || (e.keyCode === 38)) {
        input.up = false;
    }
    if ((e.keyCode === 83) || (e.keyCode === 40)) {
        input.down = false;
    }
    if (e.keyCode === 16) {
        shiftheld = false;
    }
    if (e.keyCode === 70) {
        input.f = false;
    }
}

function mousemove(e) {
    if (autospin === false) {
        mouse.x = e.pageX - c.offsetLeft;
        mouse.y = e.pageY - c.offsetTop;
    }
}

function mousedown(e) {
    if (e.button === 0) {
        mouse.held = true;
    } else {
        mouse.rightdown = true;
    }
}

function mouseup(e) {
    if (e.button === 0) {
        mouse.held = false;
    } else {
        mouse.rightdown = false;
    }
}

function undo() {
    if (barrels.length > 0) {
        undos[undos.length] = barrels[barrels.length - 1];
        barrels.splice(barrels.length - 1, 1);
    }
}

function redo() {
    if (undos.length > 0) {
        barrels[barrels.length] = undos[undos.length - 1];
        undos.splice(undos.length - 1, 1);
    }
}

//Set colour functions. Used in presets
function setColor(color) {
    document.getElementById("color").value = color;
}

//Set colour functions. Used in presets
function setBarrellColor(color) {
    document.getElementById("barrellcolor").value = color;
}

//Set colour functions. Used in presets
function setBulletColor(color) {
    document.getElementById("bulletColor").value = color;
}

function setSColor(scolo) {
    document.getElementById("scolo").value = scolo;
}

document.addEventListener("mousemove", mousemove, false);
document.addEventListener("mousedown", mousedown, false);
document.addEventListener("mouseup", mouseup, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
window.oncontextmenu = function () {
    return false;
};

function onload() {
    var drawtimer = setInterval(drawManager, 100 / 30);
}
