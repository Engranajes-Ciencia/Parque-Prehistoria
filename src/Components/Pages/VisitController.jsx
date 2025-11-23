import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import actividades from '../../config/data/actividades.json';
import StopScreen from './StopScreen';
import IntermediateMap from './IntermediateMap';
import ChallengePrompt from './ChallengePrompt';

const VIEW_STATE = {
  STOP: 'STOP',
  CHALLENGE_PROMPT: 'CHALLENGE_PROMPT',
  CHALLENGE: 'CHALLENGE', // Optional, if we embed Genially
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
        // Go back to map of previous transition? 
        // Or just go back to previous stop? 
        // Let's go back to previous stop for simplicity, or Map of previous?
        // User said "arrow to left to go back". 
        // Let's go: Current Stop -> Prev Stop (skip map/challenge for backward nav for smoother UX? Or strict reverse?)
        // Strict reverse might be annoying. Let's go to previous Stop directly.
        setCurrentStopIndex(prev => prev - 1);
        setViewState(VIEW_STATE.STOP);
      } else {
        navigate('/'); // Back to start
      }
    } else if (viewState === VIEW_STATE.MAP) {
      setViewState(VIEW_STATE.STOP); // Back to the stop we just finished
    } else if (viewState === VIEW_STATE.CHALLENGE_PROMPT) {
      setViewState(VIEW_STATE.STOP); // Back to the stop
    }
  };

  const onChallengeDecision = (play) => {
    if (play) {
        // Open Genially
        // For now, let's assume we open it in a new tab or iframe. 
        // If iframe, we need a CHALLENGE state.
        // User said "pass to Genially and when finished pass to map".
        // If external link, we can't easily know when finished.
        // If iframe, we can have a "Done" button.
        window.open(currentStop.geniallyURL, '_blank');
        // After opening, we probably should show the map or a "Did you finish?" screen.
        // Let's go to Map immediately or stay?
        // Let's assume they come back and click "Continue" on the prompt or we auto-advance?
        // Better: Show a "Continue" button after they click Yes?
        // Or just go to Map.
        setViewState(VIEW_STATE.MAP);
    } else {
        setViewState(VIEW_STATE.MAP);
    }
  };

  // Render based on state
  if (viewState === VIEW_STATE.STOP) {
    return (
      <StopScreen 
        stop={currentStop} 
        onNext={handleNext} 
        onPrev={handlePrev} 
        stopIndex={currentStopIndex}
        totalStops={actividades.length}
      />
    );
  }

  if (viewState === VIEW_STATE.CHALLENGE_PROMPT) {
    return (
      <ChallengePrompt 
        onYes={() => onChallengeDecision(true)}
        onNo={() => onChallengeDecision(false)}
        onBack={handlePrev}
      />
    );
  }

  if (viewState === VIEW_STATE.MAP) {
    return (
      <IntermediateMap 
        nextStop={nextStop} 
        onContinue={handleNext}
        onBack={handlePrev}
      />
    );
  }

  return null;
};

export default VisitController;
