// Constants for rendering
const ctx = game.getContext("2d");
const BG_COLOR = "#181818";
const FG_COLOR = "#e1e1e1";
const FPS = 60;
const DT = 1 / FPS;

// 3D Model: A Cube defined by Vertices (VS) and Faces (FS)
// Pre-generated Torus: 12 radial segments, 12 tubular segments
const VS = [
  {x:0.50,y:0.00,z:0.00},{x:0.35,y:0.35,z:0.00},{x:0.00,y:0.50,z:0.00},{x:-0.35,y:0.35,z:0.00},{x:-0.50,y:0.00,z:0.00},{x:-0.35,y:-0.35,z:0.00},{x:0.00,y:-0.50,z:0.00},{x:0.35,y:-0.35,z:0.00},{x:0.42,y:0.00,z:0.10},{x:0.30,y:0.30,z:0.10},{x:0.00,y:0.42,z:0.10},{x:-0.30,y:0.30,z:0.10},{x:-0.42,y:0.00,z:0.10},{x:-0.30,y:-0.30,z:0.10},{x:0.00,y:-0.42,z:0.10},{x:0.30,y:-0.30,z:0.10},{x:0.25,y:0.00,z:0.15},{x:0.18,y:0.18,z:0.15},{x:0.00,y:0.25,z:0.15},{x:-0.18,y:0.18,z:0.15},{x:-0.25,y:0.00,z:0.15},{x:-0.18,y:-0.18,z:0.15},{x:0.00,y:-0.25,z:0.15},{x:0.18,y:-0.18,z:0.15},{x:0.42,y:0.00,z:-0.10},{x:0.30,y:0.30,z:-0.10},{x:0.00,y:0.42,z:-0.10},{x:-0.30,y:0.30,z:-0.10},{x:-0.42,y:0.00,z:-0.10},{x:-0.30,y:-0.30,z:-0.10},{x:0.00,y:-0.42,z:-0.10},{x:0.30,y:-0.30,z:-0.10}
];

const FS = [
  // Rings connecting the tube segments
  [0,1,2,3,4,5,6,7,0],
  [8,9,10,11,12,13,14,15,8],
  [16,17,18,19,20,21,22,23,16],
  [24,25,26,27,28,29,30,31,24],
  // Vertical ribs connecting the rings
  [0,8,16,24,0],[1,9,17,25,1],[2,10,18,26,2],[3,11,19,27,3],
  [4,12,20,28,4],[5,13,21,29,5],[6,14,22,30,6],[7,15,23,31,7]
];

// Helper: Clear the screen
function clear() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, game.width, game.height);
}

// Helper: Draw a line between two 2D points
function line(p1, p2) {
    ctx.beginPath();
    ctx.strokeStyle = FG_COLOR;
    ctx.lineWidth = 3;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

// Step 1: Translate normalized coordinates (-1 to 1) to Screen coordinates (0 to Width)
function screen(p) {
    return {
        x: (p.x + 1) / 2 * game.width,
        y: (1 - (p.y + 1) / 2) * game.height // Flipped Y for canvas
    };
}

// Step 2: The Core Formula - Project 3D (x,y,z) to 2D (x/z, y/z)
function project(p) {
    return {
        x: p.x / p.z,
        y: p.y / p.z
    };
}

// Step 3: Rotate around the Y-axis (XZ plane)
function rotateY(p, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: p.x * cos - p.z * sin,
        y: p.y,
        z: p.x * sin + p.z * cos
    };
}

let angle = 0;

function frame() {
    clear();
    angle += Math.PI * 0.5 * DT; // Rotate half a circle per second

    // Render Faces
    for (let f of FS) {
        for (let i = 0; i < f.length; i++) {
            let i1 = f[i];
            let i2 = f[(i + 1) % f.length];

            // 1. Get 3D points
            let p1 = VS[i1];
            let p2 = VS[i2];

            // 2. Rotate them
            p1 = rotateY(p1, angle);
            p2 = rotateY(p2, angle);

            // 3. Move them back so they aren't in our eye (Z offset)
            p1.z += 1.0;
            p2.z += 1.0;

            // 4. Project to 2D and then to screen
            line(screen(project(p1)), screen(project(p2)));
        }
    }

    setTimeout(frame, 1000 / FPS);
}

frame();