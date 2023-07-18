// <---- DOM related utils start ----->
export const createCustomElement = ({
  elementType,
  classes,
  id,
  textContent,
  eventListener,
  eventType = 'click',
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
    element.addEventListener(eventType, () =>
      eventListener(...eventParams)
    );
  }

  return element;
};

// Function to create dynamic lifts
const createLifts = (liftIndex) => {
  const lifts = [];
  const liftId = `lift-${liftIndex}`;

  const lift = createCustomElement({
    elementType: 'div',
    classes: ['lift', 'ml'],
    id: liftId,
  });

  const leftDoor = createCustomElement({
    elementType: 'div',
    classes: ['door', 'left-door'],
  });

  const rightDoor = createCustomElement({
    elementType: 'div',
    classes: ['door', 'right-door'],
  });

  lift.append(leftDoor, rightDoor);
  lifts.push(lift);

  return lift;
};

// Function to create dynamic floors
export const createFloors = (numFloors, numLifts) => {
  const floors = [];

  for (let i = 0; i < numFloors; i++) {
    const floor = createCustomElement({
      elementType: 'div',
      classes: ['flex', 'w-full', 'floor'],
    });

    const floorBtn = createCustomElement({
      elementType: 'div',
      classes: ['flex', 'flex-col', 'floor-btn'],
      eventListener: onFloorBtnClick,
      eventParams: [numFloors - i - 1],
    });

    const floorIndicator = createCustomElement({
      elementType: 'span',
      classes: ['floor-indicator'],
      textContent: `Floor: ${numFloors - i}`,
    });

    const buttonImg = document.createElement('img');
    buttonImg.src = './assets/elevator-btn.png';
    buttonImg.style.width = '32px';
    buttonImg.style.height = '32px';

    const liftContainer = createCustomElement({
      elementType: 'div',
      classes: ['w-full', 'flex'],
    });

    floorBtn.appendChild(buttonImg);
    if (i === numFloors - 1) {
      const initState = {
        id: null,
        target: -1,
        position: 0,
        isMoving: false,
        stopped: false,
      };
      for (let j = 0; j < numLifts; j++) {
        const lift = createLifts(j);
        liftSystemState.push({ ...initState, id: j });
        liftContainer.appendChild(lift);
      }
    }

    floor.appendChild(floorBtn);
    floor.appendChild(liftContainer);
    floor.appendChild(floorIndicator);
    floors.push(floor);
  }

  return floors;
};

// <---- DOM related utils ends ----->

// <---- Lift system logic starts ---->

let liftSystemState = [];
let delayedLifts = [];

const isAnyLiftFree = () => {
  return !liftSystemState.every((lift) => lift.isMoving);
};

const findClosestLift = (floorNumber) => {
  let closestLift = null;
  let leastDistance = 10000;

  liftSystemState.forEach((elevator) => {
    const isElevatorMoving = elevator.isMoving;
    let distanceFromPressedFloor = Math.abs(
      floorNumber - elevator.position
    );

    if (isElevatorMoving) {
    } else {
      if (leastDistance > distanceFromPressedFloor) {
        closestLift = elevator;
        leastDistance = distanceFromPressedFloor;
      }
    }
  });
  return {
    closestLift,
    leastDistance,
  };
};

const moveLift = (floorNumber) => {
  let { closestLift, leastDistance } = findClosestLift(floorNumber);
  const lift = document.getElementById(`lift-${closestLift.id}`);

  if (lift) {
    const leftDoor = lift.querySelector('.left-door');
    const rightDoor = lift.querySelector('.right-door');
    const translateVal = -floorNumber * 120;
    const transitionDuration = leastDistance * 2;

    const liftFreeAfter = transitionDuration * 1000 + 5000;
    closestLift.isMoving = true;
    // liftSystemState[closestLift.id] = closestLift
    const liftOpenDuration = transitionDuration * 1000;

    setTimeout(() => {
      closestLift.isMoving = false;
    }, liftFreeAfter);

    setTimeout(() => {
      if (leftDoor) leftDoor.style.transform = `translateX(-25px)`;
      if (rightDoor) rightDoor.style.transform = `translateX(25px)`;
    }, liftOpenDuration);

    setTimeout(() => {
      if (leftDoor) leftDoor.style.transform = `translateX(0px)`;
      if (rightDoor) rightDoor.style.transform = `translateX(-0px)`;
    }, liftOpenDuration + 2500);

    setTimeout(() => {
      if (delayedLifts.length > 0) moveLift(delayedLifts[0]);
      delayedLifts.shift();
    }, liftOpenDuration + 5000);

    lift.style.transform = `translateY(${translateVal}px)`;

    lift.style.transition = `transform linear ${transitionDuration}s`;
  }
  closestLift.target = floorNumber;
  closestLift.position = floorNumber;
};

export const onFloorBtnClick = (floorNumber) => {
  const isLiftFree = isAnyLiftFree();
  if (isLiftFree) {
    moveLift(floorNumber);
  } else {
    delayedLifts.push(floorNumber);
  }
};

// <---- Lift system logic ends ---->

export const reset = () => {
  liftSystemState = [];
  delayedLifts = [];
};
