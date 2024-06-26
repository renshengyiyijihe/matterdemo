import { useMount } from "ahooks";
import "./App.css";

import Matter from "matter-js";
const {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  World,
  Mouse,
  Body,
  MouseConstraint,
  Events,
} = Matter;

import Ao from "../ao.jpg";
import Search from "../search.png";
import Expend from "../expand.png";
import BrainStorm from "../brainStorm.png";
import Five from "../five.png";
import Qa from "../qa.png";
import Summary from "../summary.png";

let blockList = [
  {
    src: Search,
    width: 84,
    height: 44,
  },
  {
    src: Expend,
    width: 104,
    height: 44,
  },
  {
    src: BrainStorm,
    width: 106,
    height: 44,
  },
  {
    src: Five,
    width: 117,
    height: 44,
  },
  {
    src: Qa,
    width: 84,
    height: 44,
  },
  {
    src: Summary,
    width: 76,
    height: 44,
  },
  // {
  //   src: ,
  //   width: ,
  //   height: ,
  // },
  // {
  //   src: ,
  //   width: ,
  //   height: ,
  // },
];

let draggingBody = null;
let draggingElement = null;
let draggingBodyId = 0;
let lastScreenX = window.screenX;
let lastScreenY = window.screenY;

let curId = blockList.length + 1;

let minX = 0,
  minY = 0,
  canvasWidth = 296,
  canvasHeight = 476;
let maxX = minX + canvasWidth,
  maxY = minY + canvasHeight,
  bufferDistance = 0,
  radius = 20,
  width = 84,
  height = 44,
  wallThickness = 10;

function App() {
  console.log("Matter", Matter);

  useMount(() => {
    const engine = Engine.create();
    engine.timing.timeScale = 0.8; // 减小时间步长
    engine.positionIterations = 10; // 增加positionIterations的值
    engine.enableSleeping = true;

    const render = Render.create({
      element: document.getElementById("canvas-container")!,
      engine: engine,
      options: {
        width: canvasWidth,
        height: canvasHeight,
        wireframes: false,
        background: "rgba(255, 255, 255, 1)",
        pixelRatio: 2,
      },
    });
    const composite = Composite.create();

    // Define bodies
    const bodies = [];
    for (let i = 0; i < blockList.length; i++) {
      const { src, width, height } = blockList[i];
      let circleBody = Bodies.rectangle(
        canvasWidth / 2,
        canvasHeight / 2,
        width,
        height,
        {
          chamfer: {
            radius,
          },
          render: {
            sprite: {
              texture: src,
              xScale: 0.25,
              yScale: 0.25,
            },
          },
        }
      );
      // circleBody.id = i + 1;

      circleBody.userData = {
        id: i + 1,
        src,
        width,
        height,
        element: document.getElementById("circle1"), // 与id为'circle1'的元素关联
      };
      bodies.push(circleBody);
      Composite.add(composite, circleBody);
    }

    const topWall = Bodies.rectangle(
      minX + canvasWidth / 2,
      minY,
      canvasWidth,
      wallThickness,
      {
        isStatic: true,
      }
    );
    const bottomWall = Bodies.rectangle(
      minX + canvasWidth / 2,
      canvasHeight,
      canvasWidth,
      wallThickness,
      {
        isStatic: true,
      }
    );
    const leftWall = Bodies.rectangle(
      minX,
      canvasHeight / 2,
      wallThickness,
      canvasHeight,
      {
        isStatic: true,
      }
    );
    const rightWall = Bodies.rectangle(
      minX + canvasWidth,
      canvasHeight / 2,
      wallThickness,
      canvasHeight,
      {
        isStatic: true,
      }
    );

    World.add(engine.world, [
      // ...bodies,
      composite,
      topWall,
      bottomWall,
      leftWall,
      rightWall,
    ]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.06,
        render: { visible: false },
      },
    });
    World.add(engine.world, mouseConstraint);
    let circle = document.getElementById("canvas-container")!;
    console.log(
      "circle?.getBoundingClientRect()",
      circle.getBoundingClientRect()
    );
    let { x: abLeftWall, y: abTopWall = 0 } =
      circle.getBoundingClientRect() || {};
    let abRightWall = abLeftWall + canvasWidth,
      abBottomWall = abTopWall + canvasHeight;
    console.log(
      "abLeftWall, abRightWall, abTopWall, abBottomWall",
      abLeftWall,
      abRightWall,
      abTopWall,
      abBottomWall
    );

    Events.on(mouseConstraint, "startdrag", (event) => {
      console.log("drag startdrag", event);

      draggingBodyId = event.body.userData.id;
      draggingBody = event.body;
      draggingElement = draggingBody.userData.element;
    });

    Events.on(mouseConstraint, "enddrag", (event) => {
      console.log("drag enddrag", event);
    });

    // Events.on(engine, "beforeUpdate", (event) => {
    //   if (!draggingElement) return;
    //   const { isCreate } = event;
    //   if (!isCreate) return;

    //   console.log("drag mouseup", event);

    //   draggingElement = null;
    //   // const { id } = draggingBody;
    //   const { src, width, height } = draggingBody.userData;

    //   let circleBody = Bodies.rectangle(50, 30, width, height, {
    //     chamfer: {
    //       radius,
    //     },
    //     render: {
    //       sprite: {
    //         texture: src,
    //         xScale: 0.25,
    //         yScale: 0.25,
    //       },
    //     },
    //   });

    //   // circleBody.id = ++curId;

    //   circleBody.userData = {
    //     id: ++curId,
    //     src,
    //     width,
    //     height,
    //     info: 11,
    //     element: document.getElementById("circle1"), // 与id为'circle1'的元素关联
    //   };
    //   draggingBodyId = 0;

    //   // setTimeout(() => {
    //   Composite.add(composite, circleBody);
    //   // }, 300);

    //   // Composite.add(composite, circleBody);
    // });

    window.addEventListener("mousemove", (event) => {
      console.log("mousemove move circle", !draggingElement, event);
      if (!draggingElement) return;

      const { pageX, pageY } = event;
      const { scrollX, scrollY } = window;
      const x = pageX - scrollX,
        y = pageY - scrollY;
      // console.log(
      //   `mousemove x <= abLeftWall + bufferDistance ||
      // x >= abRightWall - bufferDistance ||
      // y <= abTopWall + bufferDistance ||
      // y >= abBottomWall - bufferDistance, x, y`,
      //   x <= abLeftWall - bufferDistance,
      //   x >= abRightWall + bufferDistance,
      //   y <= abTopWall - bufferDistance,
      //   y >= abBottomWall + bufferDistance,
      //   x,
      //   y
      // );
      if (x >= abRightWall + bufferDistance) {
        // console.log("mousemove out", x, y);
        draggingElement.style.visibility = "visible";

        draggingElement.style.left = x - radius + "px";
        draggingElement.style.top = y - radius + "px";
        if (draggingBodyId) {
          console.log("drag mousemove enddrag", draggingBody);
          let world = engine.world;
          let bodies = Composite.allBodies(engine.world);

          let curBody = bodies.find((v) => v?.userData?.id == draggingBodyId);
          console.log("curBody", curBody);
          if (!curBody) return;
          Composite.remove(composite, curBody);
          draggingBodyId = 0;

          const { src, width, height } = draggingBody.userData;
          // console.log('src', src)
          draggingElement.src = src;
          draggingElement.style.width = width + "px";
          draggingElement.style.height = height + "px";
          draggingElement.style.transform = `rotate(${Math.round(
            draggingBody.angle * (180 / Math.PI)
          )}deg)`;

          Events.trigger(mouseConstraint, "enddrag", event);
        }
      } else {
        // console.log("mousemove ininin");
        draggingElement.style.visibility = "hidden";
      }
    });

    window.addEventListener("mouseup", (event) => {
      if (!draggingElement) return;

      const { pageX } = event;
      const { scrollX } = window;
      const x = pageX - scrollX;
      if (x < abRightWall + bufferDistance) return;
      // Events.trigger(engine, "beforeUpdate", {...event, isCreate: true});
      draggingElement = null;
      // const { id } = draggingBody;
      const { src, width, height, id } = draggingBody.userData;

      let circleBody = Bodies.rectangle(50, 30, width, height, {
        chamfer: {
          radius,
        },
        render: {
          sprite: {
            texture: src,
            xScale: 0.25,
            yScale: 0.25,
          },
        },
      });

      // circleBody.id = ++curId;

      circleBody.userData = {
        id: curId,
        src,
        width,
        height,
        info: 11,
        element: document.getElementById("circle1"), // 与id为'circle1'的元素关联
      };

      // setTimeout(() => {
      //   Composite.add(composite, circleBody);
      // }, 300);

      Composite.add(composite, circleBody);
      Engine.update(engine, 1000 / 60, 1);
      draggingBodyId = 0;
    });

    window.addEventListener("mousedown", (event) => {
      const { pageX, pageY } = event;
      const { scrollX, scrollY } = window;
      const x = pageX - scrollX,
        y = pageY - scrollY;

      // if(x > abRightWall || x < abLeftWall || y > abBottomWall || y < abTopWall) return;
      // else {
      const canvas = document
        .getElementById("canvas-container")
        ?.querySelector("canvas")!;
      // canvas.tabIndex = -1;
      // canvas.click();
      // engine.enabled = true;
      // Events.trigger(mouseConstraint, "update", event);
      Engine.update(engine, 1000 / 60, 1);
      console.log("tabIndex", event.button);
      // }
    });

    window.addEventListener("resize", () => {
      let obj = circle.getBoundingClientRect() || {};
      abLeftWall = obj.x;
      abTopWall = obj.y;
      (abRightWall = abLeftWall + canvasWidth),
        (abBottomWall = abTopWall + canvasHeight);

      let allBodies = Composite.allBodies(engine.world);
      let forceMagnitude = 0.36;
      allBodies.forEach((body) => {
        if (body.isStatic) return;
        Body.applyForce(
          body,
          { x: body.position.x, y: body.position.y },
          {
            x: forceMagnitude * Math.random() - forceMagnitude / 2,
            y: forceMagnitude * Math.random() - forceMagnitude / 2,
          }
        );
      });
    });

    const handleChangeScreen = () => {
      const { screenX: curScreenX, screenY: curScreenY } = window;

      if (curScreenX !== lastScreenX || curScreenY !== lastScreenY) {
        let allBodies = Composite.allBodies(engine.world);

        lastScreenX = curScreenX;
        lastScreenY = curScreenY;
        let forceMagnitude = 0.16;
        allBodies.forEach((body) => {
          if (body.isStatic) return;
          Body.applyForce(
            body,
            { x: body.position.x, y: body.position.y },
            {
              x: forceMagnitude * Math.random() - forceMagnitude / 2,
              y: forceMagnitude * Math.random() - forceMagnitude / 2,
            }
          );
        });
      }
      window.requestAnimationFrame(handleChangeScreen);
    };
    window.requestAnimationFrame(handleChangeScreen);
    Runner.run(engine);
    Render.run(render);
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <div
        id="canvas-container"
        style={{ width: "fit-content", borderRadius: 12, zIndex: 1 }}></div>
      <img
        id="circle1"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "absolute",
          borderRadius: `${radius}px`,
          backgroundColor: "transparent",
          visibility: "hidden",
          zIndex: 9,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default App;
