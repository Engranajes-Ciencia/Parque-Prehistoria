import type { ComponentType } from "react";
import type { ContenidoParada } from "../contenido/paradas";
import AExcavar from "./AExcavar";
import ReconstruyeStonehenge from "./ReconstruyeStonehenge";
import DeDondeViene from "./DeDondeViene";
import DescubreElMural from "./DescubreElMural";
import FabricaOxigeno from "./FabricaOxigeno";
import ManoEnLaCueva from "./ManoEnLaCueva";
import QuienComeQue from "./QuienComeQue";

/** El juego de cada parada. Se abre en #/parada/N/reto. */
export const RETOS: Record<number, ComponentType<{ parada: ContenidoParada }>> = {
  2: FabricaOxigeno,
  7: QuienComeQue,
  13: AExcavar,
  16: ManoEnLaCueva,
  18: DeDondeViene,
  19: DescubreElMural,
  21: ReconstruyeStonehenge,
};
