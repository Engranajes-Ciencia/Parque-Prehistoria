import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import actividades from "../../config/data/actividades.json";

import StopScreen from "./StopScreen";
import IntermediateMap from "./IntermediateMap";
import ChallengePrompt from "./ChallengePrompt";
import ChallengeView from "./ChallengeView";
import FinalScreen from "../FinalScreen";

const VIEW_STATE = {
  STOP: "STOP",
  CHALLENGE_PROMPT: "CHALLENGE_PROMPT",
  CHALLENGE: "CHALLENGE",
  MAP: "MAP",
};

const VisitController = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL or defaults
  const initialStopIndex = parseInt(searchParams.get("stop")) - 1 || 0;
  const initialViewState = searchParams.get("view") || VIEW_STATE.STOP;

  const [currentStopIndex, setCurrentStopIndex] = useState(initialStopIndex);
  const [viewState, setViewState] = useState(initialViewState);

  // Sync state to URL
  useEffect(() => {
    setSearchParams({
      stop: currentStopIndex + 1,
      view: viewState,
    });
  }, [currentStopIndex, viewState, setSearchParams]);

  // Ensure we have data
  if (!actividades || actividades.length === 0) {
    return <div>Error: No activities found.</div>;
  }

  const currentStop = actividades[currentStopIndex];
  const nextStop = actividades[currentStopIndex + 1];

  const handleNext = () => {
    if (viewState === VIEW_STATE.STOP) {
      const hasChallenge =
        currentStop.geniallyURL && currentStop.geniallyURL !== "#";

      if (hasChallenge) {
        setViewState(VIEW_STATE.CHALLENGE_PROMPT);
      } else {
        // Siempre vamos a MAP; el render decide si es mapa o final
        setViewState(VIEW_STATE.MAP);
      }
    } else if (viewState === VIEW_STATE.MAP) {
      if (nextStop) {
        setCurrentStopIndex((prev) => prev + 1);
        setViewState(VIEW_STATE.STOP);
      }
    }
  };

  const handlePrev = () => {
    if (viewState === VIEW_STATE.STOP) {
      if (currentStopIndex > 0) {
        setCurrentStopIndex((prev) => prev - 1);
        setViewState(VIEW_STATE.STOP);
      } else {
        navigate("/");
      }
    } else if (
      viewState === VIEW_STATE.MAP ||
      viewState === VIEW_STATE.CHALLENGE_PROMPT
    ) {
      setViewState(VIEW_STATE.STOP);
    } else if (viewState === VIEW_STATE.CHALLENGE) {
      setViewState(VIEW_STATE.CHALLENGE_PROMPT);
    }
  };

  const onChallengeDecision = (play) => {
    setViewState(play ? VIEW_STATE.CHALLENGE : VIEW_STATE.MAP);
  };

  const onChallengeFinish = () => {
    setViewState(VIEW_STATE.MAP);
  };

  // Render flags
  const isStopActive = viewState === VIEW_STATE.STOP;
  const isChallengePrompt = viewState === VIEW_STATE.CHALLENGE_PROMPT;
  const isChallengeActive = viewState === VIEW_STATE.CHALLENGE;
  const isMapActive = viewState === VIEW_STATE.MAP;

  return (
    <>
      {/* Challenge iframe (persistente) */}
      <div
        style={{
          display: isChallengeActive ? "block" : "none",
          height: "100%",
          width: "100%",
        }}
      >
        {currentStop.geniallyURL && currentStop.geniallyURL !== "#" && (
          <ChallengeView
            url={currentStop.geniallyURL}
            onFinish={onChallengeFinish}
          />
        )}
      </div>

      {isStopActive && (
        <StopScreen
          stop={currentStop}
          onNext={handleNext}
          onPrev={handlePrev}
          stopIndex={currentStopIndex}
          totalStops={actividades.length}
        />
      )}

      {isChallengePrompt && (
        <ChallengePrompt
          onYes={() => onChallengeDecision(true)}
          onNo={() => onChallengeDecision(false)}
          onBack={handlePrev}
        />
      )}

      {/* MAPA O PANTALLA FINAL */}
      {isMapActive && !nextStop && (
        <FinalScreen
          onBack={handlePrev}
          onFinish={() => navigate("/")}
        />
      )}

      {isMapActive && nextStop && (
        <IntermediateMap
          nextStop={nextStop}
          nextStopIndex={currentStopIndex + 2}
          onContinue={handleNext}
          onBack={handlePrev}
        />
      )}
    </>
  );
};

export default VisitController;

