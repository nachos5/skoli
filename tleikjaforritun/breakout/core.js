// core stuff

// dom
"use strict";
/* jshint browser: true, devel: true, globalstrict: true */
let g_canvas = document.getElementById("myCanvas");
let g_ctx = g_canvas.getContext("2d");

// empty constructor + object, we use this object just to keep track of some core stuff
function Breakout() {};
let breakout = new Breakout();
// general hitbox offset which gives some "breathing room" for collisions
breakout.offset = 6;
