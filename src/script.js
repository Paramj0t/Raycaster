import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// console.log(THREE.PerspectiveCamera);

//Texture
const textureLoader = new THREE.TextureLoader();

//Debugger
const gui = new dat.GUI();

//Cursor
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

//Scene
const scene = new THREE.Scene();

//Objects
const object1 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "red" })
);

const object2 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "red" })
);
const object3 = new THREE.Mesh(
	new THREE.SphereBufferGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "red" })
);

object1.position.x = -2;
object3.position.x = 2;

scene.add(object1, object2, object3);

//Raycaster
const raycaster = new THREE.Raycaster();

//sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	//Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	//Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	//Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

//Mouse
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
	mouse.x = (e.clientX / sizes.width) * 2 - 1;
	mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("mouse", (e) => {
	if (currentIntersect) {
		console.log("click on sphere");
	}
});

//Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.z = 7;
// camera.lookAt(mesh.position);
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	// canvas: canvas
	canvas,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// //Clock
const clock = new THREE.Clock();

let currentIntersect = null;

//Animation
const tick = () => {
	//clock sec
	const elapsedTime = clock.getElapsedTime();

	//Animate Objects
	object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
	object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
	object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

	raycaster.setFromCamera(mouse, camera);

	// const rayOrigin = new THREE.Vector3(-3, 0, 0);
	// const rayDirection = new THREE.Vector3(1, 0, 0);
	// rayDirection.normalize();

	// raycaster.set(rayOrigin, rayDirection);

	const objectsToTest = [object1, object2, object3];
	const intersects = raycaster.intersectObjects(objectsToTest);

	for (const object of objectsToTest) {
		object.material.color.set("#ff0000");
	}

	for (const intersect of intersects) {
		intersect.object.material.color.set("#0000ff");
	}

	if (intersects.length) {
		if (!currentIntersect) {
			console.log("mouse enter");
		}
		currentIntersect = intersects[0];
	} else {
		if (!currentIntersect) {
			console.log("mouse leave");
		}
		currentIntersect = null;
	}

	//Update controls
	controls.update();

	//Renderer
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
