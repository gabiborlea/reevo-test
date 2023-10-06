
import { Triangle } from "./Shape";

import Game from "./Game";

const root = document.getElementById("root");
root?.appendChild(Game.view);

Game.startShapeGeneration();
