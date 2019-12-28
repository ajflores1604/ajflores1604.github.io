
function handleMotionEvent(event) {
    let pan = (event.accelerationIncludingGravity.x * -0.2);
    let cubex = event.accelerationIncludingGravity.x * 1.0;
    let x = Math.abs(event.accelerationIncludingGravity.x * 30);
    let y = Math.abs(event.accelerationIncludingGravity.y * .15);
    // let z = Math.abs(event.accelerationIncludingGravity.z *.09);
    // let z = event.accelerationIncludingGravity.z.toFixed(2);

    x = x.toFixed(0)
    // y = y.toFixed(0)
    // z = z.toFixed(0)
    TweenMax.to('#text', 1, { color: `hsl(${x},100%,50%)`});
    TweenMax.to('#hed', 1, { opacity : `${y}`});
    TweenMax.to(stereoPanner, 1, { pan : `${pan}`});
  TweenMax.to(cube.material, 1, { color: `hsl(${cubex},100%,50%)`});

}

function onClick() {
    // feature detect
    Pizzicato.context.resume();
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotionEvent, true);
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
        window.addEventListener('devicemotion', handleMotionEvent, true);
        console.log('cry to your fruit overlords');
    }
  }


var stereoPanner = new Pizzicato.Effects.StereoPanner({
    pan: 0.0
});
function playMusic(){
    Pizzicato.context.resume();
    var acousticGuitar = new Pizzicato.Sound('irene.mp3', function () {
    // Sound loaded!
    acousticGuitar.addEffect(stereoPanner);
    acousticGuitar.play();
});
}

document.getElementById("butt").addEventListener("click",onClick);
document.getElementById("butt").addEventListener("click",playMusic);
/////////////////////////////////////////////////////////////////////////////////////////


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var animate = function () {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();