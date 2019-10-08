class App {
  constructor() {
    //Setup Camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    this.camera.position.z = 500;

    this.scene = new THREE.Scene();

    this.plane = new Plane();

    this.scene.add(this.plane);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.setAnimationLoop(this.render.bind(this));

    document.body.appendChild(this.renderer.domElement);

    // let controls = new THREE.OrbitControls(
    //   this.camera,
    //   document.querySelector("canvas")
    // );

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.plane.resize(this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    this.time = performance.now() / 10000;
    this.plane.update(this.time);
  }
}

class Plane extends THREE.Object3D {
  constructor() {
    super();
    this.tween = null;
    this.isFinish = false;
    let loader = new THREE.TextureLoader();

    this.urlImage = "hero.jpg";
    // this.urlImage = "https://scontent-dfw5-1.cdninstagram.com/vp/cafa9b52b59ecad49d41b58f61d1614f/5E2CDCFA/t51.2885-15/e35/p1080x1080/65615182_2484181515136734_6154710623708466499_n.jpg?_nc_ht=scontent-dfw5-1.cdninstagram.com&_nc_cat=106";

    loader.load(
      this.urlImage,
      texture => {
        this.texture = texture;
        this.material = new THREE.ShaderMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          uniforms: {
            time: {
              type: "f",
              value: 10.0
            },
            smooth: {
              type: "f",
              value: 2.0
            },
            u_resolution: {
              type: "f",
              value: texture.image.width / texture.image.height
            },
            u_texture: {
              value: texture
            }
          },
          vertexShader: document.getElementById("vertexShader").textContent,
          fragmentShader: document.getElementById("fragmentShader").textContent
        });

        this.geometry = new THREE.PlaneBufferGeometry(
          texture.image.width / 5,
          texture.image.height / 5,
          1024,
          1024
        );

        this.plane = new THREE.Mesh(this.geometry, this.material);

        this.addGui();

        this.add(this.plane);

        setTimeout(() => {
          this.tween = TweenMax.to(this.material.uniforms.time, 10, {
            duration: 20,
            value: 0,
            onComplete: () => {
              this.isFinish = true;
            }
          });
        }, 2000);
      },

      undefined,

      err => {
        console.error("An error happened.");
      }
    );
  }
  addGui() {
    this.gui = new dat.GUI();
    this.gui.add(this, "restart").name("restart");
    this.gui
      .add(this.material.uniforms.time, "value", 10, 0, 0.01)
      .listen()
      .name("time");
    this.gui
      .add(this.material.uniforms.smooth, "value", 1, 50, 1)
      .name("amplitude");
  }
  restart() {
    if (this.isFinish) {
      this.isFinish = false;
      this.material.uniforms.time.value = 1;
      TweenMax.to(this.material.uniforms.time, 95, {
        value: 0,
        ease: Power3.easeIn,
        // ease: Sine.easeInOut,
        onComplete: () => {
          this.isFinish = true;
        }
      });
    }
  }
  update(t) {}
  resize(renderer) {}
}

const app = new App();