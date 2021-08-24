import {
  AStartDataResult,
  ICellElement,
  ICellPathFinderData,
  PathFinder,
} from "../pathfinder";
import { CellType, ICell, IRenderable, ISize, IWall } from "./interfaces";

import { Drawer } from "./Drawer";
import p5 from "p5";
import { setNeighbors } from "./Cell";

export const Agent = (  
  start: ICellPathFinderData,
  end: ICellPathFinderData
) => {
  const result = PathFinder({
    start: start!,
    end: end!,
  });

  return {
    ...result,
    start,
    end,
  };
};

const createAgent = (  
  start: ICellPathFinderData,
  end: ICellPathFinderData,
  showSets: boolean = false
) => {
  const result = Agent(start, end);
  if (showSets) {
    for (const cell of result.openSet) {
      cell.element!.types = CellType.OpenSet;
    }

    for (const cell of result.closeSet) {
      cell.element!.types = CellType.CloseSet;
    }
  }

  result.end!.element!.types = CellType.Target;
  return result;
};

type AgentPath = {
  result: AStartDataResult;
  current: number;
};

export const Grid = (
  p5: p5,
  cols: number,
  rows: number,
  wallPercentage: number,
  canvasSize: () => ISize
): IRenderable => {
  const cells: ICell[] = [];
  const walls: ICellElement[] = [];
  const datas: ICellPathFinderData[][] = Array(cols);
  let cellWidth = 0;
  let cellHeight = 0;
  const drawer = Drawer();
  const paths: {
    target?: AgentPath;
    attacker?: AgentPath;
    defense?: AgentPath;
  } = {};

  return {
    setup: () => {
      const canvasS = canvasSize();
      cellWidth = canvasS.width / cols;
      cellHeight = canvasS.height / rows;

      for (let col = 0; col < cols; col++) {
        datas[col] = Array(rows);
        for (let row = 0; row < rows; row++) {
          const isWall = Math.random() < wallPercentage;
          if (isWall) {
            const wall: IWall = {
              col,
              row,
            };
            walls.push(wall);
            continue;
          }

          const cell: ICell = {
            col,
            row,
            data: undefined,
            types: 0,
            // highlight: false,
          };
          const data: ICellPathFinderData = {
            f: 0,
            g: 0,
            h: 0,
            neighbors: [],
            previous: undefined,
            element: cell,
          };
          cell.data = data;
          datas[col]![row] = data;
          cells.push(cell);
        }
      }
      setNeighbors(cols, rows, datas);
      const validDatas = [...datas].flatMap((d) => d).filter((d) => d);

      const targetStart =
        validDatas[Math.trunc(p5.random(0, validDatas.length - 1))];
      const targetEnd =
        validDatas[Math.trunc(p5.random(0, validDatas.length - 1))];
      paths.target = {
        result: createAgent(targetStart!, targetEnd!),
        current: 0,
      };
    },
    draw: () => {      
      p5.background(255);
      drawer.drawCells(p5, cells, cellWidth, cellHeight);

      const agents = [];
      if (paths.target) {
        agents.push(paths.target);
      }
      if (paths.attacker) {
        agents.push(paths.attacker);
      }
      if (paths.defense) {
        agents.push(paths.defense);
      }
      let finishCount = 0;
      for (const agent of agents) {
        const path = agent.result.path;
        if (agent.current <= path.length - 1) {
          const p: ICellElement[] = path
            .slice(0, agent.current)
            .map((p) => p.element);
          agent.current = agent.current + 1;          
          drawer.drawPath(p5, p, cellWidth, cellHeight);          
        } else {
          finishCount++;          
          drawer.drawPath(
            p5,
            agent.result.path.map((p) => p.element),
            cellWidth,
            cellHeight
          );          
        }
      }
      if (finishCount === agents.length) p5.noLoop();

      drawer.drawWalls(p5, walls, cellWidth, cellHeight);
    },
  };
};
