 import {Spline} from  "./Spline.js";
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
//https://en.wikipedia.org/wiki/Spline_(mathematics)
//https://www.youtube.com/watch?v=OFqENgtqRAY&t=278s
//https://www.youtube.com/watch?v=bC4xJzbKNd0

//GLSL - OpenGL Shading Language / vertex shader 
/**
 * Define vertex shader attributes
 * 
 * pointMultiplier calculated in the uniforms arr - allows pass of JS data into vertex shader data;
 * 
 * use vec4 to store RGBA color values;
 * use vec2angle to store 2D vector x,y coordinates;
 * 
 * use varying of type vec4 and vec2 to be passed to the fragment shader;
 * 
 * declare void main() - called for each vertex of geom / entry point of this shader;
 * 
 * Set diff sizes of particles by multypling size * pointMultiplayer passed from _UpdateFireGeometry
 *  divided by use gl_Position.w (calculate the position of each vertex in the screen space wit the built-in modelViewMatrix 4x4);
 * 
 * calculate the VAngle from sin&cos of float angles and pass it down to the fragment shader
 */
const _VSAttr = `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;
/**
 * Define a fragment shader to sample the texture
 */
/**
 * diffuseTexture calculated in the uniforms arr - allows pass of JS data into fragment shader data / represents texture in 2D;
 * set vec4 and vec2 colour and angle
 * declare void main() - will be called for each vertex of geom / entry point of fragment shader
 * set the coords and color of texture
 */
const _FSAttr = `

uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;

//define a ParticleSystem class
export class ParticleSystem {

  //pass parameters to the class
  constructor(params) {
    const uniforms = {
        diffuseTexture: {
            value: new THREE.TextureLoader().load('./textures/fire.png')
        },
        pointMultiplier: {
            value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
        }
    };

    //define the material of each fire particle
    this._material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _VSAttr,
        fragmentShader: _FSAttr,
        //enable blending mode to get the texture transparency
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
    });
    //get the params.camera & scene
    this._camera = params.camera;
    this._scene= params.parent;
    //creatge an array particle
    this._particlesList = [];
    //create a BufferGeometrt to store the vertex data
    this._fireGeom = new THREE.BufferGeometry();
    //set default attributes BufferGeometry
    /**
     * Use Float32BufferAttribute to store vertex position of the buffer 
     * to the data passesd  in the brackets  and allow update of each fire particle;
     */
    this._fireGeom.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._fireGeom.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    this._fireGeom.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    this._fireGeom.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));
    //create a list to store all the points that will be rendered
    this._firePoints = new THREE.Points(this._fireGeom, this._material);
    //name the geom
    this._firePoints.name="fireParticles";
    //add them to the scene
    this._scene.add(this._firePoints);
    //set position
    this._firePoints.position.set(0.50,0,-15);

    /**
     * Define a Spline to determin alpha transparency of each particle
     * to fade away at particular points and start all over again/ min 0.0 - max 1.0
     * Anonymous function is being passed when the Spline is invoked to the lerp function in Spline:
     * 'a' is the start point;
     * 'b' is the end point
     * 't' represents the time for the interpolation which determins how muhc of the interpolation should come from each ;
     */
    this._alphaParticleSpline = new Spline((t, a, b) => {
      return a + t * (b - a);
    });
    this._alphaParticleSpline.AddPoint(0.0, 0.0);
    this._alphaParticleSpline.AddPoint(0.1, 1.0);
    this._alphaParticleSpline.AddPoint(0.6, 1.0);
    this._alphaParticleSpline.AddPoint(1.0, 0.0);

    /**
     * Define a Spline to change the colour of each particle at particular points in particle's life
     * and reset  once the max point is reached 0.0 - 1.0;
     * Anonymous function is being passed when the Spline is invoked to the lerp function in Spline:
     * 'a' is being cloned to be used as a startin point for the interpolation;
     * 'b' is the end point
     * 't' represents the time for the interpolation which determins how muhc of the interpolation should come from each ;
     */
    this._colourParticleSpline = new Spline((t, a, b) => {
      const c = a.clone();
      return c.lerp(b, t);
    });

    this._colourParticleSpline.AddPoint(0.0, new THREE.Color(0xFFFF80));
    this._colourParticleSpline.AddPoint(1.0, new THREE.Color(0xFF8080));

    /**
     * Define a Spline to change the size of each particle at particular points in particle's life 
     * and reset once the max point is reached 0.0 - 5.0 
     * Anonymous function is being passed when the Spline is invoked to the lerp function in Spline:
     * 'a' is being cloned to be used as a startin point for the interpolation;
     * 'b' is the end point
     * 't' represents the time for the interpolation which determins how muhc of the interpolation should come from each ;
     */
    this._sizeParticleSpline = new Spline((t, a, b) => {
      return a + t * (b - a);
    });
    this._sizeParticleSpline.AddPoint(0.0, 1.0);
    this._sizeParticleSpline.AddPoint(0.5, 5.0);
    this._sizeParticleSpline.AddPoint(1.0, 1.0);

  
    //update the geometry after Splines are declared
    this._UpdateFireGeometry();
  }

//define a function to create  particles
  _CreateParticles() {
    this.gdfsghk = 1 * 0.1;
    const n = Math.floor(this.gdfsghk * 75.0);

    for (let i = 0; i < n; i++) {
      //get random particle life
      const life = (Math.random()* 0.75 + 0.25)* 10.0;
      this._particlesList.push({
          position: new THREE.Vector3(
              (Math.random()* 2 - 1)* 1.0,
              (Math.random()* 2 - 1)* 1.0,
              (Math.random()* 2 - 1)* 1.0),
          //get random particle sizes
          size: (Math.random()* 0.5 + 0.5)* 2.0,
          colour: new THREE.Color(),
          alpha: 1.0,
          life: life,
          maxLife: life,
          //random particle rotation
          rotation: Math.random() * 2.0 * Math.PI,
          velocity: new THREE.Vector3(0, 2, 0),
      });
    }
  }
/**
 * Iterate  over the list of particles to update the BufferGeometry 3D obj
 * with properties from the particles in order to animate parameter every frame;
 */
  _UpdateFireGeometry() {
    //define array attributes to store all attributes for every single particle
    const pPositions = [];
    const pSizes = [];
    const pColours = [];
    const pAngles = [];
//loop over the particles and update position, colour,  size, angles
    for (let p of this._particlesList) {
      pPositions.push(p.position.x, p.position.y, p.position.z);
      pSizes.push(p.currentSize);
      pColours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha);
      pAngles.push(p.rotation);
    }
    //pass the arrays attr to BufferGeometry so that the values get passed into the shaders
    this._fireGeom.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
    this._fireGeom.setAttribute('size', new THREE.Float32BufferAttribute(pSizes, 1));
    this._fireGeom.setAttribute('colour', new THREE.Float32BufferAttribute(pColours, 4));
    this._fireGeom.setAttribute('angle', new THREE.Float32BufferAttribute(pAngles, 1));
    
    //set attributes to receive update
    this._fireGeom.attributes.position.needsUpdate = true;
    this._fireGeom.attributes.size.needsUpdate = true;
    this._fireGeom.attributes.colour.needsUpdate = true;
    this._fireGeom.attributes.angle.needsUpdate = true;
  }  // end of the update

  _UpdateFireParticles() {
    //define the time elapsed for the velocity of each fire particle
    var timeElapsed=1*0.1;

    //decrease the particles life by the timeElapsed  to update the geometry state (position/colour/texture/size)
    // and indicate the end
    for (let p of this._particlesList) {
      p.life -= timeElapsed;
    }
    //filter particles that have a life bigger than 0.0 and remove the particles that ended
    this._particlesList = this._particlesList.filter(p => {
      return p.life > 0.0;
    });

    for (let p of this._particlesList) {
      //get the lifetime of each particle
      const plife = 1.0 - p.life / p.maxLife
      //rotate the particle
      p.rotation += timeElapsed * 0.25;

      /**
       * Following properties are set to the result of calling the function GET() on the Spline class
       * which provides a value to that particular particle 'p' life(plife)
       */
      //set alpha to the transparancy assigned by the Spline
      p.alpha = this._alphaParticleSpline.Get(plife);
      //set the curent size to the the one at the time set by the Spline
      p.currentSize = p.size * this._sizeParticleSpline.Get(plife);
      //set colour assigned by the Spline at that particular point plife
      p.colour.copy(this._colourParticleSpline.Get(plife));
      //set the position of each particle by muliplying the velocity of each particle to the variable timeElapsed since last frame
      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));

      //set variable to the velocity of each particle
      const dragParticle = p.velocity.clone();

      //drag Particle is multiplied by the result in the brackets
      dragParticle.multiplyScalar(timeElapsed * 0.1);
      //set dragParticle coordinates to apply the drag fore
      dragParticle.x = Math.sign(p.velocity.x) * Math.min(Math.abs(dragParticle.x), Math.abs(p.velocity.x));
      dragParticle.y = Math.sign(p.velocity.y) * Math.min(Math.abs(dragParticle.y), Math.abs(p.velocity.y));
      dragParticle.z = Math.sign(p.velocity.z) * Math.min(Math.abs(dragParticle.z), Math.abs(p.velocity.z));

      //p substracts the drag force to slow down particle's velocity
      p.velocity.sub(dragParticle);
    }

    /**
     * Sort the distance of particles from furthest to nearest, as first order particles( further view) are drawn 
     * in front of the last order (closer view) particles;  
     */
    //use the pre-defined function sort array 
    this._particlesList.sort((a, b) => {
      //calculate the position of the cam to the 'a' particle in the array
      const d1 = this._camera.position.distanceTo(a.position);
      //calculate the position of the cam to the 'b' particle in the array
      const d2 = this._camera.position.distanceTo(b.position);

      // if distance from particle 'a' is greater than the one of 'b' particle, return -1
      if (d1 > d2) {
        return -1;
      }
      // if distance from particle 'b' is greater than the one of 'a' particle, return 1
      if (d1 < d2) {
        return 1;
      }
      //return 0 if both 'a & b' are qual
      return 0;
    });
  }

  //fire on called in the main.js animate()
  FireOn() {
    this._CreateParticles();
    this._UpdateFireParticles();
    this._UpdateFireGeometry();
  
  }

}