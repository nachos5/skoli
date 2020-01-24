// Construct a "sprite" from the given `url`
// also takes width + height parameters
function Sprite(url, width, height) {
  // basic properties
  const image = new Image();
  image.src = url;
  this.image = image;
  this.width = width;
  this.height = height;
}

Sprite.prototype.drawCentredAt = function (ctx, cx, cy) {
    ctx.save();

    // lets translate to this point and rotate the canvas
    ctx.translate(cx, cy);
    // draw the image and compensate for the image size
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2,
                  this.width, this.height);

    ctx.restore();
};
