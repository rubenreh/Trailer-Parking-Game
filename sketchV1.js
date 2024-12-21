let buttonClicked = false; 
let trailer1, trailer2;
let rodLength;

// Constants for steering
const MAX_STEERING_ANGLE = Math.PI / 6; // ±30 degrees steering
const STEERING_INCREMENT = 0.02;
const WHEELBASE = 50; // Decreased from 70 to 50 for tighter turning

// Keep track of the second trailer's front hitch for continuity
let lastTrailer2FrontHitch = null;

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  if (buttonClicked) {
    slide2();
  } else {
    slide1();
  }
}

function slide1() {
  background(173, 216, 230); 
  rectMode(CENTER);

  // Draw the purple button
  fill(81, 85, 204); 
  rect(200, 360, 300, 30, 10); 

  // Text in the button
  push(); // Begin text settings
  fill(255); 
  textSize(12);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL); // Ensure button text is not bold
  text("Play", 200, 360); 
  pop(); // End text settings

  // Title (Bold)
  push(); // Begin text settings
  fill(0); 
  textSize(14);
  textStyle(BOLD); 
  textAlign(CENTER, CENTER);
  text("Linkage Parking", 200, 50);
  pop(); // End text settings

  // Description
  push(); // Begin text settings
  fill(0); 
  textSize(14);
  textStyle(NORMAL); // Ensure description text is not bold
  textAlign(CENTER, CENTER);
  text(
    "Press Play.\n\n" +
    "Left/Right: Turn front wheels of the first trailer.\n" +
    "Up/Down: Move forward/backward (starts facing up, so UP moves up).\n" +
    "Steering while moving causes the trailers to rotate from\n" +
    "the midpoint of the black rod in between them.\n" +
    "No overlap occurs; the rod maintains fixed distance.\n\n" +
    "Click on a trailer to detach it.",
    200,
    220
  );
  pop(); // End text settings
}

function mousePressed() {
  if (!buttonClicked) {
    // Check if mouse click is within the Play button's bounds
    if (mouseX > 50 && mouseX < 350 && mouseY > 345 && mouseY < 375) {
      buttonClicked = true; 
      trailer1 = new Trailer(width / 2, height / 2, -HALF_PI); 
      trailer2 = new Trailer(width / 2, height / 2 + 170, -HALF_PI); // Modified Position

      let backOfFirst = trailer1.backConnectionPoint();
      let frontOfSecond = trailer2.frontConnectionPoint();
      rodLength = dist(backOfFirst.x, backOfFirst.y, frontOfSecond.x, frontOfSecond.y);

      lastTrailer2FrontHitch = { x: frontOfSecond.x, y: frontOfSecond.y };
    }
  } else {
    // Check if trailer1 is clicked and attached
    if (trailer1.attached && trailer1.isMouseInside(mouseX, mouseY)) {
      trailer1.detach();
    }
    // Check if trailer2 is clicked and attached
    if (trailer2.attached && trailer2.isMouseInside(mouseX, mouseY)) {
      trailer2.detach();
    }
  }
}

function slide2() {
  background(240, 240, 240);

  // Draw optional parking spaces (for decoration)
  fill(70, 130, 180);
  stroke(0);
  strokeWeight(1);
  rect(330, 206, 150, 8);
  rect(330, 300, 150, 8);
  rect(330, 394, 150, 8);

  // Parking Text
  push(); // Begin text settings
  fill(0);
  textSize(14);
  textStyle(NORMAL); // Ensure parking text is not bold
  textAlign(CENTER, CENTER);
  text("Parking", 325, 250);
  text("Parking", 325, 350);
  pop(); // End text settings

  updateTrailersWithSteering();

  // Draw the trailers
  trailer1.display();
  trailer2.display();
}

function updateTrailersWithSteering() {
  // Adjust wheel angle only if trailer1 is attached
  if (trailer1.attached) {
    if (keyIsDown(LEFT_ARROW)) {
      trailer1.wheelAngle -= STEERING_INCREMENT;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      trailer1.wheelAngle += STEERING_INCREMENT;
    }
    trailer1.wheelAngle = constrain(trailer1.wheelAngle, -MAX_STEERING_ANGLE, MAX_STEERING_ANGLE);

    // Move forward/backward
    let moveAmount = 0;
    if (keyIsDown(UP_ARROW)) {
      moveAmount = trailer1.speed; 
    } else if (keyIsDown(DOWN_ARROW)) {
      moveAmount = -trailer1.speed; 
    }

    // Update first trailer position and heading if moving
    if (moveAmount !== 0) {
      let headingChange = (moveAmount / WHEELBASE) * Math.tan(trailer1.wheelAngle);
      trailer1.angle += headingChange;
      trailer1.x += cos(trailer1.angle) * moveAmount;
      trailer1.y += sin(trailer1.angle) * moveAmount;
    }
  }

  // Update trailer2 only if it's attached
  if (trailer2.attached) {
    if (trailer1.attached) {
      let backOfFirst = trailer1.backConnectionPoint();
      let desiredDir = createVector(lastTrailer2FrontHitch.x - backOfFirst.x, lastTrailer2FrontHitch.y - backOfFirst.y);

      if (desiredDir.mag() === 0) {
        desiredDir.set(0, 1);
      }
      desiredDir.normalize();

      let newFrontHitch = {
        x: backOfFirst.x + desiredDir.x * rodLength,
        y: backOfFirst.y + desiredDir.y * rodLength
      };

      // Compute midpoint of the rod
      let midX = (backOfFirst.x + newFrontHitch.x) / 2;
      let midY = (backOfFirst.y + newFrontHitch.y) / 2;

      // Determine angle from midpoint to front hitch
      let angle_of_trailer2 = atan2(newFrontHitch.y - midY, newFrontHitch.x - midX);
      let forwardVec = createVector(cos(angle_of_trailer2), sin(angle_of_trailer2));

      // The front hitch is rodLength/2 away from midpoint
      let frontHitchX = midX + forwardVec.x * (rodLength / 2);
      let frontHitchY = midY + forwardVec.y * (rodLength / 2);

      // Place trailer2 so that its center is behind the front hitch by rotatedHalfHeight
      trailer2.x = frontHitchX - forwardVec.x * trailer2.rotatedHalfHeight;
      trailer2.y = frontHitchY - forwardVec.y * trailer2.rotatedHalfHeight;
      trailer2.angle = angle_of_trailer2;

      lastTrailer2FrontHitch = newFrontHitch;
    }
    // If trailer1 is detached, trailer2 does not update its position
  }
}

class Trailer {
  constructor(x, y, initialAngle) {
    this.x = x;
    this.y = y;
    this.width = 70;  // Length of the trailer
    this.height = 35; // Width of the trailer
    this.speed = 2;
    this.wheelWidth = 18;
    this.wheelHeight = 8;
    this.wheelOffset = 23;
    this.angle = initialAngle;
    this.wheelAngle = 0;
    this.attached = true; // Property to track attachment

    let halfWidth = this.width / 2;
    let halfHeight = this.height / 2;
    this.rotatedHalfHeight = halfWidth; 
    this.rotatedHalfWidth = halfHeight;
  }

  frontConnectionPoint() {
    let forwardVec = createVector(cos(this.angle), sin(this.angle));
    return {
      x: this.x + forwardVec.x * this.rotatedHalfHeight,
      y: this.y + forwardVec.y * this.rotatedHalfHeight
    };
  }

  backConnectionPoint() {
    let forwardVec = createVector(cos(this.angle), sin(this.angle));
    return {
      x: this.x - forwardVec.x * this.rotatedHalfHeight,
      y: this.y - forwardVec.y * this.rotatedHalfHeight
    };
  }

  display() {
    rectMode(CENTER);
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Draw the trailer body
    fill(70, 130, 180); // Original color
    rect(0, 0, this.width, this.height);

    // Draw wheels
    fill(105, 105, 105);
    rect(-this.height / 2, this.wheelOffset, this.wheelWidth, this.wheelHeight, 5);
    rect(-this.height / 2, -this.wheelOffset, this.wheelWidth, this.wheelHeight, 5);

    // Draw rotating wheels
    push();
    translate(this.height / 2, this.wheelOffset);
    rotate(this.wheelAngle);
    rect(0, 0, this.wheelWidth, this.wheelHeight, 5);
    pop();

    push();
    translate(this.height / 2, -this.wheelOffset);
    rotate(this.wheelAngle);
    rect(0, 0, this.wheelWidth, this.wheelHeight, 5);
    pop();

    // Draw the cosmetic black lines forming triangles on both sides
    push(); // Begin style settings for the lines
    stroke(0); // Black color
    strokeWeight(1); // Thin lines

    // Calculate Y-offsets for left and right lines
    let offset = this.height / 3; // Increased from this.height / 4 to spread lines apart

    // Forward Triangle (Pointing Forward)
    // Left Forward Line (angled outward upward)
    line(this.width / 2, -offset, this.width / 2 + 15, -offset + 12); // Same length and angle
    // Right Forward Line (angled outward downward)
    line(this.width / 2, offset, this.width / 2 + 15, offset - 12); // Same length and angle

    // Backward Triangle (Pointing Backward)
    // Left Backward Line (angled outward upward)
    line(-this.width / 2, -offset, -this.width / 2 - 15, -offset + 12); // Same length and angle
    // Right Backward Line (angled outward downward)
    line(-this.width / 2, offset, -this.width / 2 - 15, offset - 12); // Same length and angle

    pop(); // End style settings for the lines

    // Display instruction text
    push(); // Begin text settings
    fill(0);
    noStroke(); // Ensure text has no stroke
    textSize(10);
    textStyle(NORMAL); // Ensure "Click to detach" is not bold
    textAlign(CENTER, CENTER);
    if (this.attached) {
      text("Click to\ndetach", 0, 0);
    }
    pop(); // End text settings

    pop();
  }

  // Method to detach the trailer
  detach() {
    this.attached = false;
  }

  // Method to check if the mouse is inside the trailer
  isMouseInside(mx, my) {
    // Translate mouse position to trailer's local coordinates
    let dx = mx - this.x;
    let dy = my - this.y;
    let angle = -this.angle;
    let localX = dx * cos(angle) - dy * sin(angle);
    let localY = dx * sin(angle) + dy * cos(angle);

    return (
      localX > -this.width / 2 &&
      localX < this.width / 2 &&
      localY > -this.height / 2 &&
      localY < this.height / 2
    );
  }
}
