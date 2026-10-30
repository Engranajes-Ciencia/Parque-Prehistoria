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
import DescubreElMural from "./DescubreElMural";
import FabricaOxigeno from "./FabricaOxigeno";
import ManoEnLaCueva from "./ManoEnLaCueva";
import QuienComeQue from "./QuienComeQue";
import DelLoboAlPerro from "./DelLoboAlPerro";
import ParejasDeLaGranja from "./ParejasDeLaGranja";
import ElTallerDeDarwin from "./ElTallerDeDarwin";
import CosasQueNoEncajan from "./CosasQueNoEncajan";
import QuienNoPudoEstar from "./QuienNoPudoEstar";
import RompecabezasCatalhoyuk from "./RompecabezasCatalhoyuk";
import RompecabezasMarAntiguo from "./RompecabezasMarAntiguo";

/** El juego de peques (4-6 años) de cada parada. Se abre en #/parada/N/reto. */
export const RETOS: Record<number, ComponentType<{ parada: ContenidoParada }>> = {
  1: ElRelojDelTiempo,
  11: CadaPicoSuComida,
  12: DetectivesDeLaetoli,
  14: CosasQueNoEncajan,
  15: EncuentraLasDiferencias,
  17: NosMudamos,
  20: RompecabezasCatalhoyuk,
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
  18: ParejasDeLaGranja,
  19: DescubreElMural,
  21: ReconstruyeStonehenge,
};

/**
 * El juego para mayores (7 años o más). Se abre en #/parada/N/reto-mayores y recibe la parada
 * de paraMayores() (paradas.ts), con las frases de «## Reto para mayores».
 */
export const RETOS_MAYORES: Record<number, ComponentType<{ parada: ContenidoParada }>> = {
  3: RompecabezasMarAntiguo,
  20: ConstruyeLaCasa,
  7: QuienNoPudoEstar,
  14: VerdadOMito,
  11: ElTallerDeDarwin,
  18: DelLoboAlPerro,
};
