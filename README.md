# Parking Trailer Game 🚚🅿️

An interactive web-based game where players maneuver a truck and its trailers into designated parking spots. The game tests your ability to control a vehicle and its trailers under realistic constraints, such as steering angles and movement physics.

## 🎮 Gameplay
- **Objective:** Park the blue trailers in the highlighted parking areas as quickly as possible.
- **Controls:** 
  - Use the arrow keys on your keyboard to steer the vehicle and move forwards or backwards.
  - Detach trailers by clicking on them.
- **Challenge:** The trailers behave like real-world objects — they swing and turn oppositely to the truck's direction, adding to the difficulty.

---

## 🛠️ Technical Features
### Languages and Libraries
- **JavaScript (p5.js):** Primary language and framework for creating the interactive canvas and physics-based game mechanics.

### Game Mechanics
- **Steering Dynamics:** Implements realistic steering constraints with adjustable angles and rates.
- **Physics Simulation:**
  - Trailers and vehicle dynamics are calculated based on relative positions and angles.
  - Includes linkage mechanics between truck and trailers for realistic motion.
- **Collision Detection:**
  - Trailers and parking areas are checked for overlap to determine success or warnings.
  - Trailers can achieve "full" or "partial" parking status.
- **Timer and Scoring System:** Tracks elapsed time and calculates scores based on parking precision.

### Visual Features
- **Interactive Graphics:** Real-time rendering of vehicle, trailers, and parking zones.
- **Dynamic Feedback:** Changes in parking area colors to indicate parking status:
  - Green: Fully parked
  - Yellow: Partially parked
  - Red: Warning (trailer not in any parking zone)
- **Custom Controls:** Responsive click and drag mechanics to detach trailers.

---

## 📂 File Overview
- **`sketch.js`:** Main script containing the game logic, physics simulation, and rendering.
- **Key Classes:**
  - `Vehicle`: Represents the truck and handles movement and steering.
  - `Trailer`: Models the trailers with linkage mechanics.
  - `ParkingArea`: Handles collision detection and parking status evaluation.

---

## 🚀 Getting Started
1. Clone this repository:
   https://editor.p5js.org/
   
