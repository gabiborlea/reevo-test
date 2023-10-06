import Game from "./Game";

const root = document.getElementById("root");
const initControls = () => {
  const decreaseGravity = document.getElementById("decrease-gravity");
  const increaseGravity = document.getElementById("increase-gravity");
  const gravity = document.getElementById("gravity");
  decreaseGravity!.onclick = () => {
    Game.decreaseGravity();
    gravity!.innerText = Game.getGravity().toString();
  };
  increaseGravity!.onclick = () => {
    Game.increaseGravity();
    gravity!.innerText = Game.getGravity().toString();
  };
  gravity!.innerText = Game.getGravity().toString();

  const decreaseSps = document.getElementById("decrease-sps");
  const increaseSps = document.getElementById("increase-sps");
  const sps = document.getElementById("sps");
  decreaseSps!.onclick = () => {
    Game.decreaseShapesPerSecond();
    sps!.innerText = Game.getShapesPerSecond().toString();
  };
  increaseSps!.onclick = () => {
    Game.increaseShapesPerSecond();
    sps!.innerText = Game.getShapesPerSecond().toString();
  };
  sps!.innerText = Game.getShapesPerSecond().toString();
};

Game.setResizeTo(root!);
root?.appendChild(Game.getView());

Game.onTextUpdate = (shapesCount, area) => {
    const shapesDiv = document.getElementById("shapes");
    const areaDiv = document.getElementById("area");

    shapesDiv!.innerText = shapesCount.toString();
    areaDiv!.innerText = area.toString();
}

initControls();
Game.startShapeGeneration();
