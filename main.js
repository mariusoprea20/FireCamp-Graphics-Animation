//  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
// import {ObjectLoader} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/src/loaders/ObjectLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import  {ParticleSystem} from './fire.js';

var rainFlag = false;
var fireFlag = true;
var nightFlag=false;

var loader = new THREE.TextureLoader();

console.log("Create the scene");
var scene = new THREE.Scene();
//set background color
scene.background = new THREE.Color( 0xbfd1e5 );
//set fog
scene.fog = new THREE.Fog(0xffffff, 0.1, 1000);
console.log("Create a perspective projection camera");
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 );
camera.position.x = 0; // camera x
camera.position.y = 100; // camera y
camera.position.z = -120; // camera z

console.log("Create the renderer");
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); 
document.body.appendChild(renderer.domElement);

console.log("Create an orbit control");
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 1.0;
controls.enablePan=true;
controls.maxPolarAngle= Math.PI/2; // dropping the cam to the level of the ground max
controls.screenSpacePanning = true

/***************Define light and shadows************************************************************************************************************** */


    console.log("Add the ambient light");
    var ambientLight = new THREE.AmbientLight(0x222222, 5.0); 
    scene.add(ambientLight);

    console.log("Add a point light");
    var pointLight = new THREE.PointLight(0xffffff);
    pointLight.intensity = 0.4;
    scene.add(pointLight);

    console.log("Enable shadow mapping for the renderer");
    renderer.shadowMap.enabled = true; 
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    console.log("Configure shadow mapping for the light");
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 512;
    pointLight.shadow.mapSize.height = 512;
    pointLight.shadow.camera.near = 0.5;
    pointLight.shadow.camera.far = 500;
    pointLight.shadow.radius = 5.0;


/**
 * Create a fire light that surrounds the fire
*/
// console.log("Fire lighting");
// var pointLight3 = new THREE.PointLight(0xF94924);
// pointLight3.position.set(0 ,4,-15);
// pointLight3.lookAt(0 ,4,-15);
// pointLight3.intensity = 1;
// pointLight3.castShadow = true;
// pointLight3.shadow.mapSize.width = 5;
// pointLight3.shadow.mapSize.height = 5;
// pointLight3.shadow.camera.near = 0.5;
// pointLight3.shadow.camera.far = 50;
// pointLight3.shadow.radius = 1;
// scene.add(pointLight3);

//spot light used as a surrounding light
var spotLight3 = new THREE.SpotLight(0xF94924);
spotLight3.intensity = 0;
spotLight3.angle = Math.PI / 4;
spotLight3.distance = 100;
spotLight3.penumbra = 1;
spotLight3.decay = 2;
spotLight3.position.set(0, 40, -40);
spotLight3.target.position.set( 0 , 0, -100);
spotLight3.castShadow = true;
spotLight3.shadow.mapSize.width = 500;
spotLight3.shadow.mapSize.height = 500;
scene.add(spotLight3);


/********************************************************************************************* */

//create the ground  minecraft blocks given in the workshop
//use textures on all 4 sides and store it into an array
console.log("Create a ground");
var boxGeom = new THREE.BoxGeometry(5, 5, 5); 
// grass block
var material_top = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('textures/grasslight-big.jpg')
} );
var material_bottom = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('minecraft-block/grass_block_top.png')
} );
var material_left = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('minecraft-block/grass_block_side.png')
} );
var material_right = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('minecraft-block/grass_block_side.png')
} );
var material_front = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('minecraft-block/grass_block_side.png')
} );
var material_back = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('minecraft-block/grass_block_side.png')
} );

var allMaterials = [
    material_left,        // Left side
    material_right,        // Right side
    material_top,         // Top side
    material_bottom,      // Bottom side
    material_front,       // Front side
    material_back         // Back side
];
// 100x220 boxes to create the ground;
//store them into an array and add to the scene
// set the shadow receive = true;
var groundBoxes = [];
for (var i=0;i<100;i++) {
    for (var j=0;j<220;j++) {
        groundBoxes.push(new THREE.Mesh(boxGeom, allMaterials));
        groundBoxes[i*40+j].position.x = i*5-50;
        groundBoxes[i*40+j].position.z = j*5-50;
        scene.add(groundBoxes[i*20+j]);
        groundBoxes[i*20+j].receiveShadow = true;
        
    }    
}
/********************** Ground created **********************************************************************************/
//just for decoration - has no use
console.log("create wooden boxes");
var material_top = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('textures/woodBox.png')
} );
var material_bottom = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('textures/woodBox.png')
} );
var material_left = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('textures/woodBox.png')
} );
var material_right = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('textures/woodBox.png')
} );
var material_front = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('textures/woodBox.png')
} );
var material_back = new THREE.MeshPhongMaterial( {
    map: new THREE.TextureLoader().load('textures/woodBox.png')
} );

var allMaterials = [
    material_left,        // Left side
    material_right,        // Right side
    material_top,         // Top side
    material_bottom,      // Bottom side
    material_front,       // Front side
    material_back         // Back side
];

for (var i=0;i<1;i++) {
    for (var j=0;j<3-i;j++) {
        for (var k=0;k<3-i;k++) {
            var woodenBoxes = new THREE.Mesh(boxGeom, allMaterials);
            woodenBoxes.position.x = j*6-(5-i)*10;
            woodenBoxes.position.z = k*6-(5-i)*10;
            woodenBoxes.position.y = i*5+5;
            scene.add(woodenBoxes);
        }
    }    
}
/****************************Wooden Boxes Created**********************************************************************************/
//CREATE MOUNTAINS FOR DECORATION
console.log("Create a mountain");
var geoMount1= new THREE.ConeGeometry(40, 40, 7 );
var matMount1 = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./textures/map.jpg')});
var mountain1 = new THREE.Mesh(geoMount1, matMount1);
scene.add(mountain1);
mountain1.position.x=180;
mountain1.position.y =20;
mountain1.position.z=-10;
mountain1.castShadow=true;
mountain1.receiveShadow=true;

console.log("Create a mountain2");
var geoMount2= new THREE.ConeGeometry(40, 40, 7 );
var matMount2 = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./textures/map.jpg')});
var mountain2 = new THREE.Mesh(geoMount2, matMount2);
scene.add(mountain2);
mountain2.position.x= 180;
mountain2.position.y=20;
mountain2.position.z=50;
mountain2.castShadow=true;
mountain2.receiveShadow=true;

console.log("Create a mountain3");
var geoMount3= new THREE.ConeGeometry(50, 50, 5 );
var matMount3 = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./textures/map.jpg')});
var mountain3 = new THREE.Mesh(geoMount3, matMount3);
scene.add(mountain3);
mountain3.position.x= 170;
mountain3.position.y=25;
mountain3.position.z=15;
mountain3.castShadow=true;
mountain3.receiveShadow=true;
/********************************************************Mountains created ***************************************************/

console.log("Create small building");
function createSmallBuilding(scene) {
    var roof = new THREE.ConeGeometry(12, 8);
    var base = new THREE.CylinderGeometry(10, 10, 20);
    
    // create the mesh
    var roofMesh = new THREE.Mesh(roof, new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('./textures/roofSml.jpg')}));
    var baseMaterial= new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('./textures/wood-texture-free-300x300.jpg'),
        specular:0xffffff,
        shinines:30,
        bumpMap:new THREE.TextureLoader().load('./textures/wood-texture-free-300x300_normal.jpg'),
        side: THREE.DoubleSide
    
    });
    var baseMesh = new THREE.Mesh(base,baseMaterial);
    roofMesh.receiveShadow = true;
    baseMesh.receiveShadow = true;
    roofMesh.castShadow = true;
    baseMesh.castShadow = true;

    scene.add(baseMesh);
    baseMesh.add(roofMesh);

    roofMesh.position.set(0, 14, 0);
    baseMesh.position.set(-40, 10, 45);
    baseMesh.receiveShadow=true;
    baseMesh.castShadow=true;
}
createSmallBuilding(scene);
/****************************************House created **************/
/**
 * Mesh Deformation
 * 1.Create the mesh flag
 * 2.create a wave like deformation effect by modifying x,y,z coordinates
 */
console.log("create flag");
var plane = null;
var planeGeom = new THREE.PlaneBufferGeometry(20, 10, 30, 30); 
//create flag function
function createFlag(scene){
    const geomStick = new THREE.CylinderGeometry( 1, 1, 40, 60 );
    const materialStick = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('./textures/wood-texture-free-300x300.jpg')} );
    const stick = new THREE.Mesh( geomStick, materialStick );
    scene.add( stick );
    stick.position.y=20;
    stick.position.x=70;
    stick.position.z=50;

console.log("Create a waving plane");

// load a resource
loader.load(
    // resource URL
    './textures/NU_logo.png',
    // Function when resource is loaded
    function ( texture ) {
        // do something with the texture
        var m = new THREE.MeshPhongMaterial( {
           map: texture,
           side: THREE.DoubleSide
         } );

          plane = new THREE.Mesh(planeGeom, m);
          stick.add(plane);
          plane.position.x=0;
          plane.position.y=15;
          plane.position.z=-10;
          plane.rotation.y = -Math.PI*(3/6);
    },
    // Function called when download progresses
    function ( xhr ) {
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    // Function called when download errors
    function ( xhr ) {
        console.log( 'An error happened' );
    }
 );
}

function wave(geometry, cycle, height, frmOffset) {
    var positionAttribute = geometry.getAttribute( 'position' ); // get all vertices
    const vertex = new THREE.Vector3();
    const width = geometry.parameters.width;
  
    //iterate through each verteces of the geometry 
    for ( let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++ ) {
    //set the vertex position to the current index of the loop
      vertex.fromBufferAttribute( positionAttribute, vertexIndex );
      //multiplying vertex.x+offset to the cycle 
      //divide the result by the width of the geometry and multiply the result to 2 * PI.
      var xPos = (((vertex.x+frmOffset)*cycle) / width)*(2*Math.PI);
  
      // compute z-pos using sine function
      var zPos = Math.sin(xPos)*height;
  
      // update the z-pos using the new value
      geometry.attributes.position.setXYZ( vertexIndex, vertex.x, vertex.y, zPos );
    }
    //update position
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  } //wave
  createFlag(scene);
  /******Create Clouds*************************************************************************************** */
  console.log("Create clouds");
  //array for storing all particles
  let cloudParticles = [];

  loader.load("./textures/smoke.png", function(texture){
  var cloudGeo= new THREE.PlaneBufferGeometry(700,700);
  var cloudMaterial = new THREE.MeshLambertMaterial({
    map:texture,
    transparent: true,
    side: THREE.DoubleSide
  });
  //create clouds
  var skyCloud=new THREE.Mesh(cloudGeo,cloudMaterial);
  //create 500 cloud particles
  for(let p=0; p<500;p++){
    skyCloud.position.set(
      100,
      100,
      50
    );
    //rotate the clouds to appear horizontally
    skyCloud.rotation.x=-Math.PI*(3/6);
    skyCloud.material.opacity=0.55; // set the opacity
    //store them as a whole
    cloudParticles.push(skyCloud);
    scene.add(skyCloud);
  }
 });
 /********************Clouds Created*****************************************************************************************/

  /******Create Rain*************************************************************************************** */
  /**
   * .1 define the attributes;
   * .2 create the rain 
   * .3 update the velocity of the rain particles
   */
console.log("Create Rain");
var rain;
var rainAttributes = new function () {
  var size = 2;
  var transparent = true;
  var opacity = 0.3;
  var color = 0xffffff;
  var sizeAttenuation = true;
  //use redraw function remove the rain particles and redraw them again
  this.redraw = function () {
    //remove old rain particles
    scene.remove(scene.getObjectByName("rainParticle"));
    // call createRain function and pass all the attributes  o create new particles
    createRain(size, transparent, opacity, sizeAttenuation, color);
  };
};


function createRain(size, transparent, opacity, sizeAttenuation, color) {
// create the texture
  var rainTexture = new THREE.TextureLoader().load("./textures/raindrop.png");
  var rainGeom = new THREE.BufferGeometry(); //define a buffer geometry to store the vertex data
  //create the material of the particle and pass the parameters of CreateRain();
  var rainMaterial = new THREE.PointsMaterial({
    size: size,
    transparent: transparent,
    opacity: opacity,
    map: rainTexture,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: sizeAttenuation,
    color: color
  });
  var parNumber=20000; // total number of particles
  var rangeHeight= 90; // height range of the particles
  var rangeWidth=250; // width of raining on the scene
  var positions = []; // position array to store x,y,z
  var velocitiesY= new Float32Array( parNumber ); //define the velocityx of size particle.length
  var velocitiesX= new Float32Array( parNumber ); //define the velocityx of size particle.length
  
  for ( var i = 0; i < parNumber; i ++ ) {
    positions.push(Math.random() * rangeWidth - rangeWidth / 1);
    positions.push(Math.random() * rangeHeight *1.2);
    positions.push(1 + (i/100));
    velocitiesY[ i ]= 1 + Math.random()/5; 
    velocitiesX[ i ]= (Math.random() - 1)/3;
  }
  /***
   * Store the array position into a Float32Array to store geometry's position
   * 3 components per vertex;
   * Store the velocityX and velocityY of the geometry;
   * 
   * Use Float32BufferAttribute to store vertex position of the buffer 
   * to the data passesd  in the brackets  and allow update of each rain particle;
   */
  rainGeom.setAttribute( 'position', new THREE.Float32BufferAttribute( new Float32Array(positions), 3 ) );
  rainGeom.setAttribute( 'velocityY', new THREE.Float32BufferAttribute( velocitiesY, 1 ) );
  rainGeom.setAttribute( 'velocityX', new THREE.Float32BufferAttribute( velocitiesX, 1 ) );
  //create the mesh and set attributes and coordinages
  //add it to the scene
  rain = new THREE.Points( rainGeom, rainMaterial );
  rain.sortParticles = true;
  rain.name = "rainParticle"
  rain.position.x=200;
  rain.position.z=-55;
  scene.add( rain );
  
}

function updateRain(){
    //get position of each rain particle as an array
        var vertices= rain.geometry.attributes.position.array;
    //get the velocityX of each rain particle as an array
        var velocitiesX= rain.geometry.attributes.velocityX.array;
    //get the velocityY of each rain particle as an array
        var velocitiesY= rain.geometry.attributes.velocityY.array;
    /**
     * 1.define a for loop and iterate thorugh all vertices;
     * 2. calculate the current position of x,y vertices. Since the vertices array is one dimensional,
     *   the x,y coordinates can be access by multiplying i *3, as each vertex stores x,y,z.
     *   To access x= i*3+0 , y= i*3+1, z= i*3+2;
     * 3. update the position of the vertices.x and vertices.y by substracting the related velocities of each coordinate;
     * 4. Set the velocity X to limit -20 and 20 ,set the velocity Y to limit 0 and 90
     * 5.re-render the x,y coordinates and velocities of each vertex
     * 
    */
        for ( var i =0; i < vertices.length; i++ ) {
        var posX = i* 3; 
        var posY = i* 3 + 1;
        
        vertices[ posX ] = vertices[ posX ] - (velocitiesX[ i ]);
        vertices[ posY ] = vertices[ posY ] - (velocitiesY[ i ]);
        if (vertices[posY] <= 0) {vertices[ posY ] = 90;}
        //reverse the direction of the vertices and keep it in range
        //keep the rain droplets within the -20 20 range and to get the rain effect.
        if (vertices[posX] <= -20 || vertices[posX] >= 20) {velocitiesX[i] = velocitiesX[i ] *-1;}
    }
    //re-render the position and velocity
    rain.geometry.attributes.position.needsUpdate = true;
    rain.geometry.attributes.velocityX.needsUpdate = true;
    rain.geometry.attributes.velocityY.needsUpdate = true;
}
// rain created


/***CREATE FIRE CAMP*********************************************************************************************************************** */
/**
 * Create some firewoods to be incorporated with the fire flame
 */
const fireStickGeom1 = new THREE.CylinderGeometry( 0.5, 0.5, 5, 20 );
const fireStickMaterial1 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('./textures/firewood.jpg')} );
const fireCamp1 = new THREE.Mesh( fireStickGeom1, fireStickMaterial1 );
scene.add( fireCamp1 );
fireCamp1.position.x=1;
fireCamp1.position.y=4;
fireCamp1.position.z=-15;
fireCamp1.rotation.x= -Math.PI*(2/6);

const fireStickGeom2 = new THREE.CylinderGeometry( 0.5, 0.5, 5, 20 );
const fireStickMaterial2 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('./textures/firewood.jpg')} );
const fireCamp2 = new THREE.Mesh( fireStickGeom2, fireStickMaterial2 );
scene.add( fireCamp2 );
fireCamp2.position.x=0;
fireCamp2.position.y=4;
fireCamp2.position.z=-15;
fireCamp2.rotation.x= Math.PI*(2/6);

const fireStickGeom3 = new THREE.CylinderGeometry( 0.5, 0.5, 5, 20 );
const fireStickMaterial3 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('./textures/firewood.jpg')} );
const fireCamp3 = new THREE.Mesh( fireStickGeom3, fireStickMaterial3 );
scene.add( fireCamp3 );
fireCamp3.position.x=1;
fireCamp3.position.y=4;
fireCamp3.position.z=-15;
fireCamp3.rotation.z= -Math.PI*(2/3);

const fireStickGeom4 = new THREE.CylinderGeometry( 0.5, 0.5, 5, 20 );
const fireStickMaterial4 = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('./textures/firewood.jpg')} );
const fireCamp4 = new THREE.Mesh( fireStickGeom4, fireStickMaterial4 );
scene.add( fireCamp4 );
fireCamp4.position.x=0;
fireCamp4.position.y=4;
fireCamp4.position.z=-15;
fireCamp4.rotation.z= Math.PI*(2/3);

/**
 * Create a forest function create fir trees on the ground
 */
function createRandomFir(threeNumber, forestSizeX, forestSizeZ, posX, posZ){
// Create a group to hold the trees
var forest = new THREE.Group(); // store the trees as a group

// Define the size of the forest
var forestSizeX = forestSizeX;
var forestSizeZ = forestSizeZ;

// Define the number of trees
var numTrees = threeNumber;

// Create a geometry for the trees (in this case, a cylinder)
var treeGeometry = new THREE.ConeGeometry(8, 15, 12);
var trunk= new THREE.CylinderGeometry(2, 2, 10, 32);

// Create a material for the trees (in this case, a simple green color)
var treeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
var trunkMarerial= new THREE.MeshStandardMaterial({color: 0x8b4513 });

// Generate the positions of the trees randomly
for (var i = 0; i < numTrees; i++) {
  var x = Math.random() * forestSizeX - forestSizeX/2; // position x of each tree
  var y = 8; // position y of each tree
  var z = Math.random() * forestSizeZ - forestSizeZ/2;//position z of each tree
  var tree = new THREE.Mesh(treeGeometry, treeMaterial); //create the mesh
  tree.position.y=12; // position of each on from the trunk tree
  tree.receiveShadow=true;
  tree.castShadow=true;

  var treeTrunk = new THREE.Mesh(trunk, trunkMarerial);
  treeTrunk.receiveShadow=true;
  treeTrunk.castShadow=true;
  treeTrunk.position.set(x, y, z); //set position of each tree on the ground
  treeTrunk.rotation.y = Math.random() * Math.PI; 
  treeTrunk.add(tree); // add the tree geom to the trunk
  forest.add(treeTrunk); // add all trees in the group called forest
  
}

// Add the forest to the scene
//pass params x and z
scene.add(forest);
forest.position.x=posX;
forest.position.z=posZ;
}
//create the forest of forests on the map
createRandomFir(100, 100, 180, 70, 50);
createRandomFir(30, 80, 40, 170, 110);
createRandomFir(20, 60, 60, 0, 110);

/****************Create house**********************************************/
console.log("Create a rusted house");
    //set the wall geom to plane
    var houseGeom= new THREE.PlaneGeometry(30,25);
    //create the bump mapping of the house 
    var houseMesh= new THREE.MeshPhongMaterial({            
        map: new THREE.TextureLoader().load('./textures/rusty_iron.jpg'),
        specular: 0xffffff,
        shininess:50,
        bumpMap: new THREE.TextureLoader().load('./textures/rusty_iron_bump.jpg'), 
        side: THREE.DoubleSide });

//Create walls of the house and set the positions on the map
    var wall1 = new THREE.Mesh(houseGeom, houseMesh);
    var wall2 = new THREE.Mesh(houseGeom, houseMesh);
    var wall3 = new THREE.Mesh(houseGeom, houseMesh);
    var wall4 = new THREE.Mesh(houseGeom, houseMesh);

    wall1.position.x=-35;
    wall1.position.y=15;
    wall1.position.z=0;

    wall2.position.x=-35;
    wall2.position.y=15;
    wall2.position.z=30;

    wall3.position.x=-50;
    wall3.position.y=15;
    wall3.position.z=15;
    wall3.rotation.y=Math.PI/2;

    wall4.position.x=-20;
    wall4.position.y=15;
    wall4.position.z=15;
    wall4.rotation.y=Math.PI/2;

    scene.add(wall1);
    scene.add(wall2);
    scene.add(wall3);
    scene.add(wall4);

    wall1.castShadow = true;
    wall1.receiveShadow = true;
    wall2.castShadow = true;
    wall2.receiveShadow = true;
    wall3.castShadow = true;
    wall3.receiveShadow = true;
    wall4.castShadow = true;
    wall4.receiveShadow = true;


//create roof of the house
var roofGeom = new THREE.ConeGeometry( 30, 20, 4 );
var roofMat = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('./textures/roofX.jpg')} );
var roof = new THREE.Mesh( roofGeom, roofMat );
roof.position.x=-35
roof.position.y=35;
roof.position.z=15;
roof.rotation.y=Math.PI/4;
scene.add( roof );
roof.receiveShadow=true;
roof.castShadow=true;

//create door
var doorGeometry = new THREE.PlaneGeometry(10, 16);
var doorMaterial = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('./textures/door.jpg')} );
var door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.z = 0.2; // Position the door in the middle of the house's front face
door.position.y = -5; // Position the door on the base of the house


// Create the frame of the window (a rectangular prism)
var frameMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });

var frameGeometry1 = new THREE.BoxGeometry(5, 10, 0.5);
var frame1 = new THREE.Mesh(frameGeometry1, frameMaterial);

var frameGeometry2 = new THREE.BoxGeometry(5, 10, 0.5);
var frame2 = new THREE.Mesh(frameGeometry2, frameMaterial);

// Create the glass of the window (a plane)
var glassGeometry = new THREE.PlaneGeometry(4, 9);
var glassMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 1.5 });
var glass1 = new THREE.Mesh(glassGeometry, glassMaterial);
var glass2 = new THREE.Mesh(glassGeometry, glassMaterial);
glass1.position.z = 0.25;
glass2.position.z = 0.25;

// Add the glass to the frame
frame1.add(glass1);
frame2.add(glass2);
//add the frames to the front wall
wall4.add(frame1);
wall4.add(frame2);
frame1.position.x=10; //child retakes the coordinates of the parent Z->X
frame2.position.x=-10; //child retakes the coordinates of the parent Z->X

// Add the the door
wall4.add(door);
/************#House created**********************/


/***********Create the moon/sun ********************************************************************************************************/

// create the sphere's material
var mapImg= "./textures/sun.jpg";
var sphereMaterial = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load( mapImg )});

var globe = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), sphereMaterial);
function updateTexture() {
    loader.load(mapImg, function (texture) {
        globe.material.map = texture;
        globe.material.needsUpdate = true;
    });
}
// add the sphere to the scene
scene.add(globe);
// Create curve and define the 4 points
var curve = new THREE.CubicBezierCurve3( 
    //x,y,z of each point in the sky
        new THREE.Vector3(-10, 110, 40),
        new THREE.Vector3(120, 110, -500),
        new THREE.Vector3(450, 110, 500),
        new THREE.Vector3(-10, 110, 60)
    );
    
    // for visualization
    var points = curve.getPoints( 1000 );	// sample 1000 points from the curve
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var material = new THREE.LineBasicMaterial( {opacity: 0} );
    
    // Create the final object to add to the scene
    var splineObject = new THREE.Line( geometry, material );
    scene.add(splineObject);
    splineObject.visible= false;

/************************************************************************************/


/** import a 3D model object ***/
var objItem=null;
var deerSkin=null;
// instantiate a loader

const objloader = new THREE.OBJLoader();

// load a resource
objloader.load(
	// resource URL
	'./objItem/Deer.obj',
	// called when resource is loaded
	function ( object ) {
        objItem=object;
        objItem.position.x=15;
        objItem.position.y=3;
        objItem.position.z=10;
        objItem.rotation.y= Math.PI*(10/8);
        objItem.castShadow = true;
        objItem.receiveShadow = true;
        // Once the gun model is donwloaded, start loading texture now (inside this callback function)
        loader.load(
        // resource URL
            'objItem/deer_None_Diffuse.png',
            // Function when resource is loaded
            function ( texture ) {
                // do something with the texture
                deerSkin = new THREE.MeshPhongMaterial( {
                    map: texture,
                    normalMap: new THREE.TextureLoader().load('objItem/deer_None_Normal.png'),
                } );

                // add texture to the gun mesh
                objItem.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = deerSkin;
                    child.castShadow= true;
                 }
               });

               scene.add( objItem );
            },
            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );
	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);


/*******dat.GUI******************************************************************************************************************* */
  console.log("Create GUI DAT Control");
  var gui = new dat.GUI({
    width: 200,
  });

  console.log("Light the fire!");
  var fireFlame = new ParticleSystem({
    parent: scene,
    camera: camera,
});
//create the folder called special effects controls and add another 2 folders to it
  var specialEffects = gui.addFolder("Special Effects Controls");

  var fireRainEffect= specialEffects.addFolder("Rain / Fire");
  let spParams= {
    rainEffect: ()=>{
        fireFlag=false;//fire must to be false if rainy
        rainFlag=!rainFlag; // toggle button
        if(rainFlag==true && fireFlag==false){ //if caluse
            scene.remove( scene.getObjectByName("fireParticles"));  //remove the fire particles
            rainAttributes.redraw(); // draw the rain
            spotLight3.intensity = 0; // default the firelight
        }
        else{
            scene.remove(scene.getObjectByName("rainParticle")); // if rainflag is false, remove rain particles
        }
    },
    fireEffect: ()=>{
        rainFlag=false;
        fireFlag=!fireFlag; // toggle button
        if(fireFlag==true && rainFlag==false){ // if fire true and rain false
            scene.remove(scene.getObjectByName("rainParticle")); //remove rain particles
            scene.remove( scene.getObjectByName("fireParticles"));// remove old fireParticles
            fireFlame = new ParticleSystem({                     //re-define new particle system
                parent: scene,
                camera: camera,
            });
            if(nightFlag==true) {spotLight3.intensity = 5;} // firelight true if it's night and not rainy
        }else{
            scene.remove( scene.getObjectByName("fireParticles")); // remove fire particles
            spotLight3.intensity = 0; // no firelight if no fire

        }
    }
};
  fireRainEffect.add(spParams,"rainEffect").name("Enable/Disable Rain"); // add rain to the folder
  fireRainEffect.add(spParams,"fireEffect").name("Enable/Disable Fire"); // add fire to the folder

  //day night gui
  var dayNightEffect= specialEffects.addFolder("Day / Night");
  let dayNightParams= {
    dayTime: ()=>{
        nightFlag=false; // it's not night
        mapImg="./textures/sun.jpg"; // sun
        updateTexture();//update img sun
        ambientLight.intensity=5.0; // ambient light outside
        scene.background = new THREE.Color( 0xbfd1e5 ); // blue background color
        spotLight3.intensity = 0; // 0 firelight
    },
    nightTime: ()=>{
        nightFlag=true; // it's night
        mapImg="./textures/moon.jpg"; // moon
        updateTexture(); // update img moon
        ambientLight.intensity=0.0; // no ambient light
        scene.background = new THREE.Color( 0x000000 ); // black background colour
        if(fireFlag==true) {spotLight3.intensity = 5;} // firelight true if it's night and not rainy
    },
};
  dayNightEffect.add(dayNightParams, "dayTime").name("Set Day Time"); // add day to the folder
  dayNightEffect.add(dayNightParams, "nightTime").name("Set Night Time"); // add night to the folder


console.log("Define the animation function");
var iFrame = 0;
var ratio = 10;
var iRotate=0;
function animate() 
{
    requestAnimationFrame(animate);
    iFrame ++;


    /******Rotate z coordinate of each cloud particle on the sky */
    cloudParticles.forEach(p=>{
      p.rotation.z -=0.00001;//speed of rotation
  });
    //end cloud rotation

    //update the moon position and the pointlight position
    var steps = 500; //speed of the moon 
    var counter = iRotate/steps; // when 500/500=1;
    if (counter >= 1) {
       iRotate=0;//reset
    }
    iRotate++;
    var point = curve.getPoint(counter);	// curve function!
	globe.position.set(point.x, point.y, point.z);//set the position of the globe
    pointLight.position.set(point.x, point.y, point.z);//set the position of light

    //update rain position if rainFlag is true
    if(rainFlag){
        updateRain();
    }

    //light up the fire 
    fireFlame.FireOn();


     //wave the flag
    if (plane!=null) {
        wave(planeGeom, 2, 1, iFrame/ratio);
    }//end
    //update the orbit controls
    controls.update();
    //render the camera and scene
    renderer.render(scene, camera);
}
animate();