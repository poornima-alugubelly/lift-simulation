import { createFloors, reset } from './utils.js';
let windowWidth = window.innerWidth;
const elevatorForm = document.getElementById('elevator-form');
const liftSystemContainer = document.querySelector(
  '#lift-system-container'
);
const numOfLiftsInputElem = document.getElementById('num-of-lifts');
const submitBtn = document.getElementById('submit-btn');
const maxLiftsMsg = document.getElementById('max-lifts-msg');
const backBtn = document.getElementById('back-btn');

numOfLiftsInputElem.addEventListener('keyup', (e) => {
  if (e.target.value > maxLifts) {
    submitBtn.disabled = true;
  } else {
    if (submitBtn.disabled) {
      submitBtn.disabled = false;
    }
  }
});

const onResize = () => {
  windowWidth = window.innerWidth;
  const maxLifts = Math.floor(windowWidth / 90);
  maxLiftsMsg.innerText = `Max number of lifts allowed: ${maxLifts}`;
  numOfLiftsInputElem.setAttribute('max', maxLifts);
};

onResize();
window.addEventListener('resize', onResize);

let numOfLifts = 0;
let numOfFloors = 0;

elevatorForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(elevatorForm);

  for (let [name, value] of formData) {
    if (name === 'num-of-lifts') {
      numOfLifts = value;
    }
    if (name === 'num-of-floors') {
      numOfFloors = value;
    }
  }

  if (liftSystemContainer) {
    const floors = createFloors(numOfFloors, numOfLifts);
    floors.forEach((floor) => liftSystemContainer.appendChild(floor));
  }
  backBtn.style.display = 'block';
  elevatorForm.style.display = 'none';
});

backBtn.addEventListener('click', () => {
  elevatorForm.style.display = 'block';
  while (liftSystemContainer.firstChild) {
    liftSystemContainer.removeChild(liftSystemContainer.lastChild);
    reset();
  }
  backBtn.style.display = 'none';
});
