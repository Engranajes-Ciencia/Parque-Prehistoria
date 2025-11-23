import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ROUTES } from './routerConfig';

import Layout from '../../Components/Layout/Layout';
import AdminStats from "../../Components/Pages/AdminStats";

import LoadingSpinner from "../../Components/Commons/LoadingSpinner";

// New Components
import StartScreen from "../../Components/Pages/StartScreen";
import VisitController from "../../Components/Pages/VisitController";

// Carga componentes lentos, grandes, finales o de poco uso cuando se visitan para ganar velocidad en la app
const Final = lazy(() => import("../../Components/Pages/Final"));

// Legacy components (kept for reference or admin, but hidden from main flow)
/*
import Actividad from "../../Components/Pages/Actividad";
import Vitrina from "../../Components/Pages/Vitrina";
import VitrinaVirtual from "../../Components/Pages/VitrinaVirtual";
import ModoJuego from "../../Components/Pages/ModoJuego";
import Portada from "../../Components/Pages/Portada";
import Form from "../../Components/Pages/Form";
import Mapa from "../../Components/Pages/Mapa";
import EscanerQR from '../../Components/Pages/EscanerQR';
import EntreActividades from "../../Components/Pages/EntreActividades";
import ModoSecreto from "../../Components/Pages/ModoSecreto";
*/

function AppRouter() {

    const RUTA_SECRETA_ADMIN = "/admin"; // Define tu ruta secreta aquí

    return (
        <Routes>
            {/* New Linear Flow */}
            <Route path="/" element={<StartScreen />} />
            <Route path="/visit" element={<VisitController />} />

            {/* Rutas con Lazy Loading (envueltas en Layout y Suspense) */}
            <Route path={ROUTES.FINAL} element={
                <Suspense fallback={<LoadingSpinner />}>
                    <Layout><Final /></Layout>
                </Suspense>
            } />

            {/* RUTA DE ADMIN - SIN LAYOUT para que no aparezca en la navegación normal */}
            <Route path={RUTA_SECRETA_ADMIN} element={<AdminStats />} />

            {/* Redirect any unknown route to start */}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
}

export default AppRouter;