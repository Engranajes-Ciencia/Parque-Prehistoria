import type { ComponentType } from "react";
import type { ContenidoParada } from "../contenido/paradas";
import ElRelojDelTiempo from "./ElRelojDelTiempo";
import CadaPicoSuComida from "./CadaPicoSuComida";
import DetectivesDeLaetoli from "./DetectivesDeLaetoli";
import VerdadOMito from "./VerdadOMito";
import EncuentraLasDiferencias from "./EncuentraLasDiferencias";
import NosMudamos from "./NosMudamos";
import ConstruyeLaCasa from "./ConstruyeLaCasa";

import AExcavar from "./AExcavar";
import ArmaPangea from "./ArmaPangea";
import ComoSeHaceUnFosil from "./ComoSeHaceUnFosil";
import ConstruyeElArbol from "./ConstruyeElArbol";
import DeQuienEsLaHuella from "./DeQuienEsLaHuella";
import PolinizaLasFlores from "./PolinizaLasFlores";
import QuienSobrevivio from "./QuienSobrevivio";
import QuienVivioAntes from "./QuienVivioAntes";
import ReconstruyeStonehenge from "./ReconstruyeStonehenge";
import DeDondeViene from "./DeDondeViene";
import DescubreElMural from "./DescubreElMural";
import FabricaOxigeno from "./FabricaOxigeno";
import ManoEnLaCueva from "./ManoEnLaCueva";
import QuienComeQue from "./QuienComeQue";

/** El juego de cada parada. Se abre en #/parada/N/reto. */
export const RETOS: Record<number, ComponentType<{ parada: ContenidoParada }>> = {
  1: ElRelojDelTiempo,
  11: CadaPicoSuComida,
  12: DetectivesDeLaetoli,
  14: VerdadOMito,
  15: EncuentraLasDiferencias,
  17: NosMudamos,
  20: ConstruyeLaCasa,
  2: FabricaOxigeno,
  3: ComoSeHaceUnFosil,
  4: QuienVivioAntes,
  5: ConstruyeElArbol,
  6: PolinizaLasFlores,
  7: QuienComeQue,
  8: ArmaPangea,
  9: DeQuienEsLaHuella,
  10: QuienSobrevivio,
  13: AExcavar,
  16: ManoEnLaCueva,
  18: DeDondeViene,
  19: DescubreElMural,
  21: ReconstruyeStonehenge,
};
