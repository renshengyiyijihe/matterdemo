import { useMount } from "ahooks";
import p2 from "p2";
import { useEffect, useRef } from "react";

let width = 360,
  height = 360,
  wallWidth = 360,
  wallHeight = 360;

const wallThickness = 1; // 墙体厚度
const wallFriction = 0.5; // 墙体摩擦系数
let cancelReq = 0;

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // if (!canvasRef || !canvasRef.current) return;

    const world = new p2.World({
      gravity: [0, 0],
    });

    const topWall = new p2.Body({
      type: p2.Body.STATIC, // 设置为静态刚体
      position: [0, 0], // 墙体顶部位置
      //   angle: , // 旋转180度，使墙体朝下
    });
    const topWallShape = new p2.Box({
      width: width,
      height: wallThickness,
    });
    topWall.addShape(topWallShape);
    // topWallShape.material.friction = wallFriction; // 设置墙体摩擦系数
    world.addBody(topWall);

    // 底部墙体
    const bottomWall = new p2.Body({
      type: p2.Body.STATIC,
      position: [0, wallHeight],
      //   angle: 0,
    });
    const bottomWallShape = new p2.Box({
      width: width,
      height: wallThickness,
    });
    bottomWall.addShape(bottomWallShape);
    // bottomWallShape.material.friction = wallFriction;
    world.addBody(bottomWall);

    // 左侧墙体
    const leftWall = new p2.Body({
      type: p2.Body.STATIC,
      position: [0, 0],
      //   angle: -Math.PI / 2, // 旋转90度，使墙体朝右
    });
    const leftWallShape = new p2.Box({
      width: wallThickness,
      height: wallHeight,
    });
    leftWall.addShape(leftWallShape);
    // leftWallShape.material.friction = wallFriction;
    world.addBody(leftWall);

    // 右侧墙体
    const rightWall = new p2.Body({
      type: p2.Body.STATIC,
      position: [width, 0],
      //   angle: Math.PI / 2, // 旋转-90度，使墙体朝左
    });
    const rightWallShape = new p2.Box({
      width: wallThickness,
      height: wallHeight,
    });
    rightWall.addShape(rightWallShape);
    // rightWallShape.material.friction = wallFriction;
    world.addBody(rightWall);

    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    console.log("canvas", canvas, canvasRef.current);
    if (!canvas) return;
    const context = canvas.getContext("2d");

    function renderLoop() {
      world.step(1 / 60); // 更新世界状态，参数为时间步长（这里设为每秒60帧）

      if (!context) return;
      console.log("context", context, world.bodies);
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < world.bodies.length; i++) {
        const body = world.bodies[i];
        const shape = body.shapes[0];

        // 在canvas上绘制圆球
        if (shape instanceof p2.Circle) {
          const x = body.position[0];
          const y = canvas.height - body.position[1]; // y轴取反以适应canvas坐标系
          const radius = shape.radius;

          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.closePath();
          context.fillStyle = "red";
          context.fill();
        }

        // 在canvas上绘制矩形
        if (shape instanceof p2.Box) {
          const x = body.position[0];
          const y = canvas.height - body.position[1]; // y轴取反以适应canvas坐标系
          const width = shape.width;
          const height = shape.height;
          const angle = body.angle;

          context.save();
          context.translate(x, y);
          context.rotate(angle);
          context.fillStyle = "green";
          context.fillRect(-width / 2, -height / 2, width, height);
          context.restore();
        }
      }

      //   cancelReq = requestAnimationFrame(renderLoop);
    }

    renderLoop();

    return () => {
      cancelAnimationFrame(cancelReq);
    };
  }, [canvasRef]);

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
      <canvas
        id="canvas-container"
        ref={canvasRef}
        width={width}
        height={height}
        data-pixel-ratio="2"
        style={{ width: "fit-content", borderRadius: 12, zIndex: 1 }}></canvas>
      {/* <img
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
      /> */}
    </div>
  );
}

export default App;
