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

let lastScreenX = window.screenX;
let lastScreenY = window.screenY;

let curId = blockList.length + 1;

let minX = 0,
  minY = 0,
  canvasWidth = 296,
  canvasHeight = 476;
let radius = 20,
  width = 84,
  height = 44,
  wallThickness = 10,
  lastMouseDownTimeStamp = 0;

function NewApp() {
  console.log("Matter", Matter);

  useMount(() => {
    let circle = document.getElementById("circle1");
    const engine = Engine.create();
    engine.timing.timeScale = 0.5;
    engine.positionIterations = 10;
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

    window.addEventListener("mouseup", (event) => {
      const resultValue = (Date.now() - lastMouseDownTimeStamp);
      console.log('resultValue', resultValue, resultValue >= 1, circle)
      if (resultValue <= 300 && circle) {
        circle.innerHTML += "创建成功\n";
      }
    });

    window.addEventListener("mousedown", (event) => {
      lastMouseDownTimeStamp = Date.now();
    });

    window.addEventListener("resize", () => {
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
      <div
        id="circle1"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: `${radius}px`,
          backgroundColor: "transparent",
          zIndex: 9,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default NewApp;
