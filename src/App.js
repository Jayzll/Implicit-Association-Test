import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS

const IATTest = () => {
  const [stimulus, setStimulus] = useState(null);
  const [trial, setTrial] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [level, setLevel] = useState(1); // Track the current level
  const [showInstructions, setShowInstructions] = useState(true); // Instructions for each level
  const [isPractice, setIsPractice] = useState(true); // Track if in practice round
  const [showReadyScreen, setShowReadyScreen] = useState(false); // Ready screen between levels
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3); // Timer state for 3 seconds

  // Practice Stimuli
  const practiceStimuli = [
    { word: 'Chemistry', category: 'Science' },
    { word: 'Literature', category: 'Liberal Arts' },
    { word: 'Nuclear Physics', category: 'Science' },
    { word: 'Photography', category: 'Liberal Arts' },
  ];

  // Level 1: Science vs Liberal Arts
  const level1Stimuli = [
    { word: 'Anthropology', category: 'Liberal Arts' },
    { word: 'Astrophysics', category: 'Science' },
    { word: 'Philosophy', category: 'Liberal Arts' },
    { word: 'Biology', category: 'Science' },
  ];

  // Level 2: Male vs Female
  const level2Stimuli = [
    { word: 'Dad', category: 'Male' },
    { word: 'Mom', category: 'Female' },
    { word: 'Brother', category: 'Male' },
    { word: 'Sister', category: 'Female' },
  ];

  // Level 3: Combined Male/Female + Science/Liberal Arts
  const level3Stimuli = [
    { word: 'Anthropology', category: 'Liberal Arts' },
    { word: 'Astrophysics', category: 'Science' },
    { word: 'Dad', category: 'Male' },
    { word: 'Mom', category: 'Female' },
  ];

  // Conditionally set stimuli based on the current level or practice mode
  let currentStimuli = [];
  if (isPractice) {
    currentStimuli = practiceStimuli;
  } else if (level === 1) {
    currentStimuli = level1Stimuli;
  } else if (level === 2) {
    currentStimuli = level2Stimuli;
  } else if (level === 3) {
    currentStimuli = level3Stimuli;
  }

  useEffect(() => {
    if (trial < currentStimuli.length) {
      setStimulus(currentStimuli[trial]);

      // Only set the timer if not in practice mode
      if (!isPractice) {
        setTimeLeft(3); // Reset timer for each trial
        setTimer(setTimeout(() => {
          handleNextTrial(false); // Automatically move to the next trial
        }, 3000));

        const countdown = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 0) {
              clearInterval(countdown);
              return 0; // Prevent negative value
            }
            return prev - 0.1; // Decrease time left by 0.1 seconds
          });
        }, 100); // Update every 100 ms

        return () => {
          clearTimeout(timer);
          clearInterval(countdown);
        };
      }
    }
  }, [trial, level, isPractice]);

  const handleNextTrial = (userResponse = false) => {
    clearTimeout(timer);
    if (!userResponse) {
      setReactionTimes([...reactionTimes, {reactionTimes: 0, correct: false }]);
    }
    if (trial + 1 < currentStimuli.length) {
      setTrial(trial + 1); // Move to the next trial
    } else {
      if (isPractice) {
        // After practice, start level 1
        setIsPractice(false);
        setShowReadyScreen(true);
        setLevel(0);
        setTrial(0); // Reset trials for the new level
      } else if (level < 3) {
        // Move to next level after current level ends
        setShowReadyScreen(true);
      } else {
        setLevel(level + 1); // Proceed to the result screen
      }
    }
  };

  const handleResponse = (e) => {
    if (!stimulus || trial >= currentStimuli.length) return;

    const keyPressed = e.key.toLowerCase();

    if (keyPressed !== 'e' && keyPressed !=='i') {
      return;
    }
    
    const startTime = performance.now();
    const endTime = performance.now();
    const reactionTime = endTime - startTime;

    let expectedKey;
    if (isPractice) {
      // Practice: Liberal Arts ('e') vs Science ('i'), Male ('e') vs Female ('i')
      expectedKey = stimulus.category === 'Liberal Arts' || stimulus.category === 'Male' ? 'e' : 'i';
    } else if (level === 1) {
      // Level 1: Liberal Arts ('e') vs Science ('i')
      expectedKey = stimulus.category === 'Liberal Arts' ? 'e' : 'i';
    } else if (level === 2) {
      // Level 2: Male ('e') vs Female ('i')
      expectedKey = stimulus.category === 'Male' ? 'e' : 'i';
    } else if (level === 3) {
      // Level 3: Combined task
      expectedKey = stimulus.category === 'Liberal Arts' || stimulus.category === 'Male' ? 'e' : 'i';
    }

    const correct = keyPressed === expectedKey;
    setReactionTimes([...reactionTimes, { reactionTime, correct }]);
    handleNextTrial(true); // Move to the next trial
  };

  useEffect(() => {
    window.addEventListener('keydown', handleResponse);
    return () => {
      window.removeEventListener('keydown', handleResponse);
    };
  }, [trial, stimulus, isPractice]);

  const startNextLevel = () => {
    setLevel(level + 1);
    setTrial(0); // Reset trials for the new level
    setShowReadyScreen(false); // Hide the ready screen
  };

  // Final results after all levels
  if (level > 3) {
    const correctResponses = reactionTimes.filter(rt => rt.correct).length;
    const avgReactionTime = (
      reactionTimes.reduce((acc, curr) => acc + curr.reactionTime, 0) / reactionTimes.length
    ).toFixed(2);

    return (
      <div className="IAT-container">
        <h2>Test Completed</h2>
        <p>Total Trials: {reactionTimes.length}</p>
        <p>Correct Responses: {correctResponses}</p>
        <p>Average Reaction Time: {avgReactionTime} ms</p>
      </div>
    );
  }

  // Ready screen between levels
  if (showReadyScreen) {
    let nextTask;
    if (level === 0) nextTask = 'Science vs Liberal Arts categories';
    if (level === 1) nextTask = 'Male vs Female categories';
    if (level === 2) nextTask = 'Combined Male/Female with Science/Liberal Arts';

    return (
      <div className="IAT-container">
        <h2>Get Ready for the Next Level</h2>
        <p>In the next level, you will sort <strong>{nextTask}</strong>.</p>
        <button onClick={startNextLevel}>Start Next Level</button>
      </div>
    );
  }

  // Initial instructions for the first level
  if (showInstructions) {
    return (
      <div className="IAT-container">
        <h2>How to Play</h2>
        <p> You have selected the Gender-Science Task. In this study you will complete an Implicit Association Test (IAT) in which you will be asked to <strong>sort words into groups as fast as you can. </strong> This study should take about 10 minutes to complete. At the end, you will receive your IAT result along with information about what it means.</p>
        <p>In this test, you will see words appear on the screen.</p>
        <p>First, there will be a practice round with no timer.</p>
        <p>In Level 1, you will sort Science and Liberal Arts categories</p>
        <p>In Level 2, you will sort Male and Female categories.</p>
        <p>In Level 3, you will sort combined categories.</p>
        <button onClick={() => setShowInstructions(false)}>Start Practice</button>
      </div>
    );
  }

  return (
    <div className="IAT-container">
      {/* Top instruction for key presses */}
      <div className="instructions-row">
        <span>Press "E" for</span>
        <span>Press "I" for</span>
      </div>

      {/* Category and stimulus section */}
      <div className="categories-stimulus-row">
        {/* Left categories */}
        <div className="category-left">
          {isPractice || level === 1 ? <h2>Liberal Arts</h2> : <h2>Male</h2>}
          {level === 3 && <h3>Liberal Arts</h3>}
        </div>

        {/* Central stimulus */}
        <div className="stimulus">
          {stimulus ? <h1>{stimulus.word}</h1> : <p>Loading stimulus...</p>}
        </div>

        {/* Right categories */}
        <div className="category-right">
          {isPractice || level === 1 ? <h2>Science</h2> : <h2>Female</h2>}
          {level === 3 && <h3>Science</h3>}
        </div>
      </div>

      {/* Bottom instructions */}
      <div className="error-instructions">
        <p>If you make a mistake, a <span className="error-text">red X</span> will appear. Press the other key to continue.</p>
      </div>

      {/* Timer Bar (hidden during practice) */}
      {!isPractice && (
        <div className="timer-bar">
          <div 
            className="timer-fill" 
            style={{ width: `${(timeLeft / 3) * 100}%` }} // Set width based on time left
          />
        </div>
      )}
    </div>
  );
};

export default IATTest;
