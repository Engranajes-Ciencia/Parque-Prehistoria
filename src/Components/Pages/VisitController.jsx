import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import actividades from '../../config/data/actividades.json';
import StopScreen from './StopScreen';
import IntermediateMap from './IntermediateMap';
import ChallengePrompt from './ChallengePrompt';
import ChallengeView from './ChallengeView';

const VIEW_STATE = {
  STOP: 'STOP',
  CHALLENGE_PROMPT: 'CHALLENGE_PROMPT',
  CHALLENGE: 'CHALLENGE',
  MAP: 'MAP'
};

const VisitController = () => {
  const navigate = useNavigate();
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [viewState, setViewState] = useState(VIEW_STATE.STOP);

  // Ensure we have data
  if (!actividades || actividades.length === 0) {
    return <div>Error: No activities found.</div>;
  }

  const currentStop = actividades[currentStopIndex];
  const nextStop = actividades[currentStopIndex + 1];

  const handleNext = () => {
    // Logic to move from STOP -> (CHALLENGE?) -> MAP -> NEXT STOP

    if (viewState === VIEW_STATE.STOP) {
      // Check if current stop has a challenge
      const hasChallenge = currentStop.geniallyURL && currentStop.geniallyURL !== "#";

      if (hasChallenge) {
        setViewState(VIEW_STATE.CHALLENGE_PROMPT);
      } else {
        // No challenge, go to map (if there is a next stop)
        if (nextStop) {
          setViewState(VIEW_STATE.MAP);
        } else {
          // End of tour
          navigate('/final'); // Or some end screen
        }
      }
    } else if (viewState === VIEW_STATE.CHALLENGE_PROMPT) {
      // This state is handled by the prompt buttons (Yes/No)
    } else if (viewState === VIEW_STATE.MAP) {
      // Move to next stop
      if (nextStop) {
        setCurrentStopIndex(prev => prev + 1);
        setViewState(VIEW_STATE.STOP);
      }
    }
  };

  const handlePrev = () => {
    // Logic to go back
    if (viewState === VIEW_STATE.STOP) {
      if (currentStopIndex > 0) {
        setCurrentStopIndex(prev => prev - 1);
        setViewState(VIEW_STATE.STOP);
      } else {
        navigate('/'); // Back to start
      }
    } else if (viewState === VIEW_STATE.MAP) {
      setViewState(VIEW_STATE.STOP); // Back to the stop we just finished
    } else if (viewState === VIEW_STATE.CHALLENGE_PROMPT) {
      setViewState(VIEW_STATE.STOP); // Back to the stop
    } else if (viewState === VIEW_STATE.CHALLENGE) {
      setViewState(VIEW_STATE.CHALLENGE_PROMPT); // Back to prompt
    }
  };

  const onChallengeDecision = (play) => {
    if (play) {
      setViewState(VIEW_STATE.CHALLENGE);
    } else {
      setViewState(VIEW_STATE.MAP);
    }
  };

  const onChallengeFinish = () => {
    setViewState(VIEW_STATE.MAP);
  };

  // Render logic
  const isChallengeActive = viewState === VIEW_STATE.CHALLENGE;
  const isChallengePrompt = viewState === VIEW_STATE.CHALLENGE_PROMPT;
  const isMapActive = viewState === VIEW_STATE.MAP;
  const isStopActive = viewState === VIEW_STATE.STOP;

  return (
    <>
      {/* ALWAYS render ChallengeView if there is a URL, but hide it if not active. 
          This preserves the iframe state (progress) when user navigates away temporarily. */}
      <div style={{ display: isChallengeActive ? 'block' : 'none', height: '100%', width: '100%' }}>
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

      {isMapActive && (
        <IntermediateMap
          nextStop={nextStop}
          onContinue={handleNext}
          onBack={handlePrev}
        />
      )}
    </>
  );
};

export default VisitController;
