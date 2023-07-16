import { createFloors } from "./utils.js";

const elevatorForm = document.getElementById(
    "elevator-form"
  );

  let numOfLifts = 0;
  let numOfFloors = 0

  elevatorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(elevatorForm);

    for (let [name, value] of formData) {
      if(name==="num-of-lifts"){
        numOfLifts = value
      }
      if(name==="num-of-floors"){
        numOfFloors=value;
      }

    }

const floorsContainer = document.querySelector('#lift-system-container');

if (floorsContainer) {
  const floors = createFloors(numOfLifts, numOfFloors);
  console.log(floors,"floors")
  floors.forEach((floor) => floorsContainer.appendChild(floor));
}


  });