// Trailer Parking Game
// Dec 19, 2025


// Global Variables
let buttonClicked = false; // Tracks if the game has started
let vehicle; // The main vehicle (yellow truck)
let trailer1; // First trailer attached to the truck
let trailer2; // Second trailer attached to the first trailer

// Game Timer Variables
let timer = 0; // Timer starts at 0 to track elapsed time
let lastTime = 0; // Stores the last recorded time for smooth updates

// Constants for Steering
const MAX_STEERING_ANGLE = Math.PI / 6; // Maximum steering angle (±30 degrees)
const STEERING_INCREMENT = 0.02; // How much the steering changes with key press
const WHEELBASE = 70; // Distance between the vehicle's front and rear axles

// Arm Properties - First Trailer
let elbowX, elbowY; // Position of the arm's joint (elbow) for the first trailer
let upperArmLength = 30; // Length of the upper arm segment
let lowerArmLength = 30; // Length of the lower arm segment
let elbowAngle = 0; // Angle of the elbow joint for the first trailer

// Arm Properties - Second Trailer
let elbowX2, elbowY2; // Position of the arm's joint (elbow) for the second trailer
let elbowAngle2 = 0; // Angle of the elbow joint for the second trailer
let jointGap = 5; // Visual gap between the arm rectangles
const MAX_ARM_ROTATION = Math.PI / 2; // Maximum arm rotation (±90 degrees)

// Detaching Timer
let bothTrailersDetachedTime = null; // Keeps track of when both trailers are detached



function setup() {
  createCanvas(400, 400);
}


// Modify the draw function to include slide3 with delay
function draw() {
  if (!buttonClicked) {
    slide1();    // Show the introduction screen
  } else {
    // If both trailers are detached, wait for 2 seconds before showing the end screen
    if (trailer1 && trailer2 && !trailer1.attached && !trailer2.attached) {
      // If this is the first frame both are detached, record the time
      if (bothTrailersDetachedTime === null) {
        bothTrailersDetachedTime = millis();  // Record the time when both trailers are detached
      }
      
      // Check if 2 seconds have passed since both trailers were detached
      if (millis() - bothTrailersDetachedTime >= 2000) {
        slide3();      // Show the game conclusion screen
      } else {
        slide2();      // Continue showing the main game screen during the delay
      }
    } else {
      // Reset the timer if a trailer is reattached
      bothTrailersDetachedTime = null;
      slide2();
    }
  }
}


// Modify mousePressed function to handle trailer clicks
function mousePressed() {
  if (!buttonClicked) {
    // Original button click logic
    if (mouseX > 50 && mouseX < 350 && mouseY > 345 && mouseY < 375) {
      buttonClicked = true;
      vehicle = new Vehicle(width / 2, height / 2, -HALF_PI);
      elbowX = width / 2;
      elbowY = height / 2;
      trailer1 = new Trailer(elbowX, elbowY, 35, 70);
      trailer2 = new Trailer(elbowX, elbowY, 35, 70);
      elbowAngle = 0;
      elbowAngle2 = 0;
      timer = 0;
      lastTime = millis();
    }
  } else {
    // Check for clicks on trailers
    if (trailer1.containsPoint(mouseX, mouseY)) {
      trailer1.attached = false;
    }
    if (trailer2.containsPoint(mouseX, mouseY)) {
      trailer2.attached = false;
    }
  }
}


// Game Introduction
function slide1() {
  background(173, 216, 230);
  rectMode(CENTER);

  // Draw the purple button
  fill(81, 85, 204);
  rect(200, 360, 300, 30, 10);
  
  // Car Decoration
  push(); // Save current transformation state

  // Move to where you want the center of rotation to be
  translate(77.5, 115); // Center point of the car (x + width/2, y + height/2)

  rotate(radians(25)); // Rotate 10 degrees (Processing uses radians)

  // Draw the car body relative to center (0,0)
  fill(225,225,0);
  strokeWeight(1);
  rect(-27.5,-45,55,90,5); // Adjust coordinates relative to center

  // Draw the wheels relative to center
  fill(105, 105, 105);
  rect(-57.5,-65,12, 22, 6);
  rect(-57.5,-15,12, 22, 6);
  rect(2.5,-65,12, 22, 6);
  rect(2.5,-15,12, 22, 6);

  pop();


  // Text in the button
  push();
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  text("Play", 200, 360);
  pop();

  // Title (Bold)
  push();
  fill(0);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Linkage Parking", 200, 50);
  pop();

  // Description
  push();
  fill(0);
  textSize(16);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text("Park the blue trailers in the parking spaces\nas fast as you can! Turn the wheels of the\nyellow truck and drive forwards and\nbackwards with arrow keys on the screen\nor your keyboard!", 200, 200);
  text("(Caution: If the truck is turning one way\nthe trailer will likely turn the other way)", 200, 280);
  pop();
}


// Game
function slide2() {
  background(240, 240, 240);

  // Update timer
  let currentTime = millis();
  timer += (currentTime - lastTime) / 1000; // Increment timer in seconds
  lastTime = currentTime; // Update last recorded time

  // Display the blue rectangle for the timer
  fill(173, 216, 230); // Light blue color
  stroke(0);
  strokeWeight(2);
  rect(360, 50, 50, 30, 8); // Position adjusted for alignment

  // Add "TIMER" label above the rectangle
  strokeWeight(0);
  push();
  fill(0); // Black color for text
  textSize(12); // Smaller, standard text size
  textStyle(NORMAL); // Ensure text is unbolded
  textAlign(CENTER, BOTTOM); // Align text at the center of the rectangle
  text("TIMER", 360, 30); // Positioned slightly above the rectangle
  pop();

  // Display the timer value inside the rectangle
  push();
  fill(0); // Black color for text
  textSize(12); // Standard text size for timer value
  textStyle(NORMAL); // Ensure text is unbolded
  textAlign(CENTER, CENTER); // Center align the text inside the rectangle
  text(`${timer.toFixed(2)}`, 360, 52); // Positioned at the center of the rectangle
  pop();

  // Draw Parking Spaces
  fill(70, 130, 180);
  stroke(0);
  strokeWeight(1);
  rect(330, 206, 150, 8);
  rect(330, 300, 150, 8);
  rect(330, 394, 150, 8);
  
  // Parking Text
  push();
  fill(0);
  textSize(14);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text("Parking", 325, 250);
  text("Parking", 325, 350);
  pop();

  updateVehicleWithSteering();

  // Draw the vehicle
  vehicle.display();

  // Draw the arms and trailers
  drawFirstArm();
  drawSecondArm();
}


// Function to compute the score based on the parking areas
function getScoreFromParkingAreas() {
  let score = 0;

  // Iterate over each parking area and check its color state via `occupied`
  for (let area of parkingAreas) {
    if (area.occupied === 'full') {
      // Green parking - add 4 points
      score += 4;
    } else if (area.occupied === 'partial') {
      // Yellow parking - add 2 points
      score += 2;
    }
    // 'warning' or false (red/none) adds 0 points
  }

  return score;
}


// Game Conclusion
function slide3() {
  background(255, 255, 150);

  // Draw optional parking spaces (for decoration)
  fill(255, 255, 255);
  strokeWeight(0);
  rect(200, 200, 300, 300, 8);

  // Title (Bold)
  push();
  fill(0);
  textSize(15);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Nice!", 200, 75);
  pop();

  // Compute score before printing
  let totalScore = getScoreFromParkingAreas();

  // Print the score
  push();
  fill(0);
  textSize(15);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("You Successfully Parked the\nTrailers, Scoring " + totalScore + " points!", 200, 105);
  text("What did we learn?", 200, 230);
  
  textStyle(NORMAL);
  text("Linkage is when connected\nparts work together to change\n direction", 200, 268);
  textSize(80);
  text("🎉", 200, 180);
  pop();

  // Draw a "Restart" button at the bottom, similar to the "Play" button
  rectMode(CENTER);
  fill(81, 85, 204);
  rect(200, 320, 250, 30, 10);

  // Text on the "Restart" button
  push();
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  text("Restart", 200, 320);
  pop();
  
  
  if (mouseX > 200 - 250 / 2 && mouseX < 200 + 250 / 2 && mouseY > 320 - 30 / 2 && mouseY < 320 + 30 / 2) {
    // Perform some action if the rectangle is clicked
    location.reload();
  }
}


// Updates the Vehicles Location
function updateVehicleWithSteering() {
  // Adjust wheel angle only if vehicle is attached
  if (vehicle.attached) {
    if (keyIsDown(LEFT_ARROW)) {
      vehicle.wheelAngle -= STEERING_INCREMENT;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      vehicle.wheelAngle += STEERING_INCREMENT;
    }
    vehicle.wheelAngle = constrain(vehicle.wheelAngle, -MAX_STEERING_ANGLE, MAX_STEERING_ANGLE);

    // Move forward/backward
    let moveAmount = 0;
    if (keyIsDown(UP_ARROW)) {
      moveAmount = vehicle.speed;
    } else if (keyIsDown(DOWN_ARROW)) {
      moveAmount = -vehicle.speed;
    }

    // Update vehicle position and heading if moving
    if (moveAmount !== 0) {
      let headingChange = (moveAmount / WHEELBASE) * Math.tan(vehicle.wheelAngle);
      vehicle.angle += headingChange;
      vehicle.x += cos(vehicle.angle) * moveAmount;
      vehicle.y += sin(vehicle.angle) * moveAmount;

      // More realistic arm rotation
      let turnIntensity = Math.abs(vehicle.wheelAngle);
      let movementIntensity = Math.abs(moveAmount);

      if (moveAmount > 0 && turnIntensity < 0.1) {
        // If moving forward straight, straighten the arms gradually
        if (elbowAngle > 0.01) {
          elbowAngle -= 0.02;
        } else if (elbowAngle < -0.01) {
          elbowAngle += 0.02;
        } else {
          elbowAngle = 0;
        }

        if (elbowAngle2 > 0.01) {
          elbowAngle2 -= 0.02;
        } else if (elbowAngle2 < -0.01) {
          elbowAngle2 += 0.02;
        } else {
          elbowAngle2 = 0;
        }
      } else if (turnIntensity > STEERING_INCREMENT && movementIntensity > 0) {
        // Arms rotate during turning
        let rotationDirection = (moveAmount > 0 ? (vehicle.wheelAngle > 0 ? -1 : 1) : (vehicle.wheelAngle > 0 ? 1 : -1)
        );
      
        // Faster arm rotation when moving backward
        let armRotationRate = moveAmount < 0 ? 0.04 * turnIntensity : 0.02 * turnIntensity;

        // First arm rotation
        elbowAngle = constrain(
          elbowAngle + (rotationDirection * armRotationRate),
          -MAX_ARM_ROTATION,
          MAX_ARM_ROTATION
        );

        // Second arm rotation depends on direction of travel:
        // - Moving backward: opposite direction (snake-like)
        // - Moving forward: same direction (follows trailer 1 more naturally)
        if (moveAmount < 0) {
          // Reversing
          elbowAngle2 = constrain(
            elbowAngle2 - (rotationDirection * armRotationRate),
            -MAX_ARM_ROTATION,
            MAX_ARM_ROTATION
          );
        } else {
          // Moving forward
          elbowAngle2 = constrain(
            elbowAngle2 + (rotationDirection * armRotationRate),
            -MAX_ARM_ROTATION,
            MAX_ARM_ROTATION
          );
        }
      } else {
        // Gradually return arms to neutral when not moving straight or not turning strongly
        if (elbowAngle > 0.01) {
          elbowAngle -= 0.01;
        } else if (elbowAngle < -0.01) {
          elbowAngle += 0.01;
        } else {
          elbowAngle = 0;
        }

        if (elbowAngle2 > 0.01) {
          elbowAngle2 -= 0.01;
        } else if (elbowAngle2 < -0.01) {
          elbowAngle2 += 0.01;
        } else {
          elbowAngle2 = 0;
        }
      }
    }
  }
}


// Modify drawFirstArm to respect attachment status
function drawFirstArm() {
  if (!trailer1.attached) {
    // If detached, just draw the trailer in its last position
    trailer1.display();
    return;
  }

  // Rest of the original drawFirstArm code
  let shoulderX = vehicle.x - cos(vehicle.angle) * (vehicle.width / 2);
  let shoulderY = vehicle.y - sin(vehicle.angle) * (vehicle.width / 2);
  
  elbowAngle = constrain(elbowAngle, -MAX_ARM_ROTATION, MAX_ARM_ROTATION);
  
  elbowX = shoulderX - cos(vehicle.angle) * lowerArmLength;
  elbowY = shoulderY - sin(vehicle.angle) * lowerArmLength;
  
  let handX = elbowX - cos(vehicle.angle + elbowAngle) * upperArmLength;
  let handY = elbowY - sin(vehicle.angle + elbowAngle) * upperArmLength;

  stroke(0);
  line(shoulderX, shoulderY, elbowX, elbowY);
  line(elbowX, elbowY, handX, handY);

  fill(0);
  rectMode(CENTER);
  push();
  translate((shoulderX + elbowX) / 2, (shoulderY + elbowY) / 2);
  rotate(vehicle.angle);
  rect(0, 0, lowerArmLength, jointGap);
  pop();

  fill(0);
  push();
  translate((elbowX + handX) / 2, (elbowY + handY) / 2);
  rotate(vehicle.angle + elbowAngle);
  rect(0, 0, upperArmLength, jointGap);
  pop();

  fill(255, 0, 0);
  ellipse(elbowX, elbowY, 15);

  trailer1.x = handX;
  trailer1.y = handY;
  trailer1.angle = vehicle.angle + elbowAngle + HALF_PI;
  
  trailer1.display();
}

function drawSecondArm() {
  if (!trailer2.attached) {
    // If detached, just draw the trailer in its last position
    trailer2.display();
    return;
  }

  // Only draw the arm and update trailer if first trailer is still attached
  if (!trailer1.attached) {
    return;
  }

  // Position the shoulder at the bottom of trailer1
  let shoulderX = trailer1.x + cos(trailer1.angle + HALF_PI) * trailer1.height;
  let shoulderY = trailer1.y + sin(trailer1.angle + HALF_PI) * trailer1.height;

  elbowAngle2 = constrain(elbowAngle2, -MAX_ARM_ROTATION, MAX_ARM_ROTATION);

  // Base angle: aligning similarly to the first arm’s logic
  // trailer1.angle = (vehicle.angle + elbowAngle + HALF_PI)
  // Subtract HALF_PI to get back to the 'arm direction' reference frame
  let baseAngle = trailer1.angle - HALF_PI;

  // Extend lower arm segment (use '-' to match first arm direction)
  elbowX2 = shoulderX - cos(baseAngle) * lowerArmLength;
  elbowY2 = shoulderY - sin(baseAngle) * lowerArmLength;

  // Extend upper arm segment
  let handX = elbowX2 - cos(baseAngle + elbowAngle2) * upperArmLength;
  let handY = elbowY2 - sin(baseAngle + elbowAngle2) * upperArmLength;

  // Draw the arm lines
  stroke(0);
  line(shoulderX, shoulderY, elbowX2, elbowY2);
  line(elbowX2, elbowY2, handX, handY);

  // Draw the lower arm rectangle
  fill(0);
  rectMode(CENTER);
  push();
  translate((shoulderX + elbowX2) / 2, (shoulderY + elbowY2) / 2);
  rotate(baseAngle);
  rect(0, 0, lowerArmLength, jointGap);
  pop();

  // Draw the upper arm rectangle
  fill(0);
  push();
  translate((elbowX2 + handX) / 2, (elbowY2 + handY) / 2);
  rotate(baseAngle + elbowAngle2);
  rect(0, 0, upperArmLength, jointGap);
  pop();

  // Draw the elbow joint
  fill(255, 0, 0);
  ellipse(elbowX2, elbowY2, 15);

  // Update trailer2 angle
  // The first trailer's angle was (vehicle.angle + elbowAngle + HALF_PI)
  // For the second trailer, following the same pattern:
  trailer2.angle = (baseAngle + elbowAngle2) + HALF_PI;
  
  // Update trailer2 position
  trailer2.x = handX;
  trailer2.y = handY;

  trailer2.display();
}


class Vehicle {
  constructor(x, y, initialAngle) {
    this.x = x;
    this.y = y;
    this.width = 70; // Length of the vehicle
    this.height = 35; // Width of the vehicle
    this.speed = 2;
    this.wheelWidth = 18;
    this.wheelHeight = 8;
    this.wheelOffset = 23;
    this.angle = initialAngle;
    this.wheelAngle = 0;
    this.attached = true; // Property to track attachment
  }

  display() {
    rectMode(CENTER);
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Draw the vehicle body
    fill(255, 255, 0); // Yellow color for the vehicle
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

    pop();
  }
}


// Add attached property to Trailer class
 class Trailer {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;   // e.g., 35
    this.height = height; // e.g., 70
    this.angle = 0; 
    this.attached = true;
  }

  containsPoint(px, py) {
    let dx = px - this.x;
    let dy = py - this.y;
    let rotatedX = dx * cos(-this.angle) - dy * sin(-this.angle);
    let rotatedY = dx * sin(-this.angle) + dy * cos(-this.angle);
    rotatedY -= this.height / 2;
    return abs(rotatedX) <= this.width / 2 && abs(rotatedY) <= this.height / 2;
  }

  display() {
    rectMode(CENTER);
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    translate(0, this.height / 2);

    // Wheel dimensions and gap
    let wheelWidth = 9;
    let wheelHeight = 19;
    let gap = 2; // small gap between wheels and body

    // Calculate wheel positions based on trailer width and chosen gap
    let halfTrailerW = this.width / 2;   
    let halfWheelW = wheelWidth / 2;     
    // Positions for left and right wheels
    let leftX = - (halfTrailerW + halfWheelW + gap);
    let rightX = (halfTrailerW + halfWheelW + gap);

    // Vertical positions for the wheels
    let topY = -this.height / 4;
    let bottomY = this.height / 4;

    // Draw the black connecting lines underneath (first)
    stroke(0);
    strokeWeight(2);
    // Line connecting top two wheels
    line(leftX, topY, rightX, topY);
    // Line connecting bottom two wheels
    line(leftX, bottomY, rightX, bottomY);

    // Draw the trailer body on top of the line
    fill(173, 216, 230);
    noStroke();
    rect(0, 0, this.width, this.height);

    // Draw the wheels on top of the body and line
    fill(105, 105, 105);
    noStroke();
    // Top-left wheel
    rect(leftX, topY, wheelWidth, wheelHeight, 5);
    // Top-right wheel
    rect(rightX, topY, wheelWidth, wheelHeight, 5);
    // Bottom-left wheel
    rect(leftX, bottomY, wheelWidth, wheelHeight, 5);
    // Bottom-right wheel
    rect(rightX, bottomY, wheelWidth, wheelHeight, 5);

    pop();
  }
}


// First, let's create a ParkingArea class to handle the larger rectangles
class ParkingArea {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.occupied = false;
  }

  // Check if a trailer is completely within this area
  containsTrailer(trailer) {
    if (!trailer || trailer.attached) return false;
    
    // First check if trailer is touching parking lines
    if (this.isTrailerOnParkingLines(trailer)) {
      return 'partial';
    }
    
    // Calculate trailer corners in world space
    let corners = this.getTrailerCorners(trailer);
    
    // Check if all corners are within parking area bounds
    let allInside = true;
    for (let corner of corners) {
      if (!this.containsPoint(corner.x, corner.y)) {
        allInside = false;
        break;
      }
    }
    
    if (allInside) {
      return 'full';
    } else if (this.isTrailerPartiallyInside(trailer)) {
      return 'partial';
    }
    
    return false;
  }

  getTrailerCorners(trailer) {
    let corners = [];
    let w = trailer.width / 2;
    let h = trailer.height;
    
    // Calculate corner positions relative to trailer center
    let relativeCorners = [
      {x: -w, y: 0},
      {x: w, y: 0},
      {x: -w, y: h},
      {x: w, y: h}
    ];
    
    // Transform corners to world space
    for (let corner of relativeCorners) {
      let rotatedX = corner.x * cos(trailer.angle) - corner.y * sin(trailer.angle);
      let rotatedY = corner.x * sin(trailer.angle) + corner.y * cos(trailer.angle);
      corners.push({
        x: trailer.x + rotatedX,
        y: trailer.y + rotatedY
      });
    }
    
    return corners;
  }

  containsPoint(px, py) {
    return px >= (this.x - this.width/2) &&
           px <= (this.x + this.width/2) &&
           py >= (this.y - this.height/2) &&
           py <= (this.y + this.height/2);
  }

  // Check if a trailer is partially within this area
  isTrailerPartiallyInside(trailer) {
    if (!trailer || trailer.attached) return false;
    
    let corners = this.getTrailerCorners(trailer);
    let someInside = false;
    let someOutside = false;
    
    for (let corner of corners) {
      if (this.containsPoint(corner.x, corner.y)) {
        someInside = true;
      } else {
        someOutside = true;
      }
      if (someInside && someOutside) return true;
    }
    return false;
  }

  // Check if trailer is touching parking lines
  isTrailerOnParkingLines(trailer) {
    if (!trailer || trailer.attached) return false;
    
    // Define parking line y-positions with a small buffer
    const lineY1 = 206;
    const lineY2 = 300;
    const lineY3 = 394;
    const buffer = 5;  // Buffer zone around parking lines
    
    let corners = this.getTrailerCorners(trailer);
    
    for (let corner of corners) {
      if (Math.abs(corner.y - lineY1) < buffer || 
          Math.abs(corner.y - lineY2) < buffer || 
          Math.abs(corner.y - lineY3) < buffer) {
        return true;
      }
    }
    return false;
  }

  display() {
    push();
    rectMode(CENTER);
    strokeWeight(0);  // Remove stroke
    
    if (this.occupied === 'full') {
      fill(0, 255, 0);  // Green for perfect parking
    } else if (this.occupied === 'partial') {
      fill(255, 255, 0);  // Yellow for partial parking
    } else if (this.occupied === 'warning') {
      fill(255, 0, 0);   // Red for warning (detached trailer not in any spot)
    } else {
      noFill();  // Transparent if not occupied
    }
    
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

// Add parking areas array and initialize them
let parkingAreas = [];

function setup() {
  createCanvas(400, 400);
  // Initialize parking areas with the specified dimensions
  parkingAreas = [
    new ParkingArea(330, 253, 150, 83),
    new ParkingArea(330, 347, 150, 83)
  ];
}

// Modify mousePressed to check parking areas when trailers are detached
function mousePressed() {
  if (!buttonClicked) {
    if (mouseX > 50 && mouseX < 350 && mouseY > 345 && mouseY < 375) {
      buttonClicked = true;
      vehicle = new Vehicle(width / 2, height / 2, -HALF_PI);
      elbowX = width / 2;
      elbowY = height / 2;
      trailer1 = new Trailer(elbowX, elbowY, 35, 70);
      trailer2 = new Trailer(elbowX, elbowY, 35, 70);
      elbowAngle = 0;
      elbowAngle2 = 0;
      timer = 0;
      lastTime = millis();
    }
  } else {
    // Check for clicks on trailers
    if (trailer1.containsPoint(mouseX, mouseY)) {
      trailer1.attached = false;
      checkParkingAreas(); // Check parking areas after detachment
    }
    if (trailer2.containsPoint(mouseX, mouseY)) {
      trailer2.attached = false;
      checkParkingAreas(); // Check parking areas after detachment
    }
  }
}

// Function to check if detached trailers are in parking areas
function checkParkingAreas() {
  // Reset all parking areas first
  for (let area of parkingAreas) {
    area.occupied = false;
  }
  
  // Process each detached trailer
  function processTrailer(trailer) {
    if (!trailer || trailer.attached) return null;
    
    let bestArea = null;
    let bestOverlap = 0;
    let isFullyParked = false;
    
    // Check each parking area for this trailer
    for (let area of parkingAreas) {
      const status = area.containsTrailer(trailer);
      
      if (status === 'full') {
        // If fully parked, this is definitely the best area
        bestArea = area;
        isFullyParked = true;
        break;
      } else if (status === 'partial') {
        // Calculate overlap with this area
        const overlap = calculateOverlap(trailer, area);
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestArea = area;
        }
      }
    }
    
    // Return result object
    return {
      area: bestArea,
      isFull: isFullyParked
    };
  }
  
  // Calculate approximate overlap between trailer and parking area
  function calculateOverlap(trailer, area) {
    // Get trailer corners
    const corners = area.getTrailerCorners(trailer);
    
    // Count how many corners are inside this area
    let cornerCount = 0;
    for (let corner of corners) {
      if (area.containsPoint(corner.x, corner.y)) {
        cornerCount++;
      }
    }
    
    return cornerCount;
  }
  
  // Process both trailers
  const trailer1Result = processTrailer(trailer1);
  const trailer2Result = processTrailer(trailer2);
  
  // Apply results to parking areas
  if (trailer1Result && trailer1Result.area) {
    trailer1Result.area.occupied = trailer1Result.isFull ? 'full' : 'partial';
  }
  
  if (trailer2Result && trailer2Result.area) {
    trailer2Result.area.occupied = trailer2Result.isFull ? 'full' : 'partial';
  }
  
  // Check for detached trailers not in any spot
  if ((trailer1 && !trailer1.attached && !trailer1Result?.area) || 
      (trailer2 && !trailer2.attached && !trailer2Result?.area)) {
    // Only turn empty spots red
    for (let area of parkingAreas) {
      if (!area.occupied) {
        area.occupied = 'warning';
      }
    }
  }
}

// Modify slide2() to use parking areas
function slide2() {
  background(240, 240, 240);

  // Update timer
  let currentTime = millis();
  timer += (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Display timer
  fill(173, 216, 230);
  stroke(0);
  strokeWeight(2);
  rect(360, 50, 50, 30, 8);

  strokeWeight(0);
  push();
  fill(0);
  textSize(12);
  textStyle(NORMAL);
  textAlign(CENTER, BOTTOM);
  text("TIMER", 360, 30);
  pop();

  push();
  fill(0);
  textSize(12);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text(`${timer.toFixed(2)}`, 360, 52);
  pop();

  // Draw parking spaces (blue lines)
  fill(70, 130, 180);
  stroke(0);
  strokeWeight(1);
  rectMode(CENTER);
  rect(330, 206, 150, 8);
  rect(330, 300, 150, 8);
  rect(330, 394, 150, 8);

  // Update and display parking areas
  checkParkingAreas(); // Continuously check parking areas
  for (let area of parkingAreas) {
    area.display();
  }

  // Parking Text
  push();
  fill(0);
  textSize(14);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text("Parking", 325, 250);
  text("Parking", 325, 350);
  pop();

  updateVehicleWithSteering();
  vehicle.display();
  drawFirstArm();
  drawSecondArm();
}
