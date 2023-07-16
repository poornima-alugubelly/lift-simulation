export const createCustomElement = ({
  elementType,
  classes,
  id,
  textContent,
  eventListener,
  eventType = "click",
  eventParams,
}) => {
  const element = document.createElement(elementType);

  if (classes) {
    if (Array.isArray(classes)) {
      element.classList.add(...classes);
    } else {
      element.classList.add(classes);
    }
  }

  if (textContent) {
    element.textContent = textContent;
  }

  if (id) {
    element.id = id;
  }
  if (eventListener) {
    element.addEventListener(eventType, () => eventListener(...eventParams));
  }

  return element;
};

export const createFloor = () => {
  return createCustomElement({
    elementType: "div",
    classes: ["flex", "w-full", "floor"],
  });
};

// Function to create dynamic lifts
const createLifts = (liftIndex) => {
  const lifts = [];

  // for (let i = 1; i <= numLifts; i++) {
  const liftId = `lift-${liftIndex}`;

  const lift = createCustomElement({
    elementType: "div",
    classes: ["lift", "ml"],
    id: liftId,
  });

  const leftDoor = createCustomElement({
    elementType: "div",
    classes: ["door", "left-door"],
  });

  const rightDoor = createCustomElement({
    elementType: "div",
    classes: ["door", "right-door"],
  });

  lift.append(leftDoor, rightDoor);
  lifts.push(lift);
  // }

  return lift;
};

const liftSystemState = [];

const onFloorBtnClick = (floorNumber) => {
  let closestFloor = liftSystemState[0];
  let leastDistance = 10000;
  liftSystemState.forEach((elevator) => {
    const isElevatorMoving = elevator.isMoving;
    let distanceFromPressedFloor = Math.abs(floorNumber - elevator.position);
    if (isElevatorMoving) {
      return;
    }

    if (leastDistance > distanceFromPressedFloor) {
      closestFloor = elevator;
      leastDistance = distanceFromPressedFloor;
    }
  });

  const lift = document.getElementById(`lift-${closestFloor.id}`);

  if (lift) {
    const leftDoor = lift.querySelector(".left-door");
    const rightDoor = lift.querySelector(".right-door");
    const translateVal = -floorNumber * 100;
    const transitionDuration = leastDistance * 2;

    const liftFreeAfter = transitionDuration * 1000 + 5000;
    closestFloor.isMoving = true;
    const liftOpenDuration = transitionDuration * 1000;
    console.log(floorNumber);
    setTimeout(() => {
      if (leftDoor) leftDoor.style.transform = `translateX(-25px)`;
      if (rightDoor) rightDoor.style.transform = `translateX(25px)`;
    }, liftOpenDuration);

    setTimeout(() => {
      if (leftDoor) leftDoor.style.transform = `translateX(0px)`;
      if (rightDoor) rightDoor.style.transform = `translateX(-0px)`;
    }, liftOpenDuration + 2500);

    setTimeout(() => {
      closestFloor.isMoving = false;
    }, liftFreeAfter);
    lift.style.transform = `translateY(${translateVal}px)`;

    lift.style.transition = `all ${transitionDuration}s`;
  }
  closestFloor.target = floorNumber;
  closestFloor.position = floorNumber;
};

// Function to create dynamic floors
export const createFloors = (numFloors, numLifts) => {
  const floors = [];

  for (let i = 0; i < numFloors; i++) {
    const floor = createCustomElement({
      elementType: "div",
      classes: ["flex", "w-full", "floor"],
    });

    const floorBtn = createCustomElement({
      elementType: "div",
      classes: ["flex", "flex-col", "floor-btn"],
      eventListener: onFloorBtnClick,
      eventParams: [numFloors - i - 1],
    });

    const button = createCustomElement({
      elementType: "button",
      textContent: "Up",
    });

    const liftContainer = createCustomElement({
      elementType: "div",
      classes: ["w-full", "flex"],
    });

    floorBtn.appendChild(button);
    if (i === numFloors - 1) {
      const initState = {
        id: null,
        target: -1,
        position: 0,
        isMoving: false,
      };
      for (let j = 0; j < numLifts; j++) {
        const lift = createLifts(j);
        liftSystemState.push({ ...initState, id: j });
        liftContainer.appendChild(lift);
      }
    }

    floor.appendChild(floorBtn);
    floor.appendChild(liftContainer);
    floors.push(floor);
  }

  return floors;
};
