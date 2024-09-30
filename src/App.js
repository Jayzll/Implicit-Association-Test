import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS

const IATTest = () => {
  const [stimulus, setStimulus] = useState(null);
  const [trial, setTrial] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3); // Timer state for 3 seconds

  const stimuli = [
    { word: 'Anthropology', category: 'Liberal Arts' },
    { word: 'Astrophysics', category: 'Science' },
    { word: 'Dad', category: 'Male' },
    { word: 'Mom', category: 'Female' },
  ];

  useEffect(() => {
    if (trial < stimuli.length) {
      setStimulus(stimuli[trial]);
      setTimeLeft(3); // Reset timer for each trial
      setTimer(setTimeout(() => {
        handleNextTrial(); // Automatically move to the next trial
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
  }, [trial]);

  const handleNextTrial = () => {
    clearTimeout(timer);
    setTrial(trial + 1); // Move to the next trial
  };

  const handleResponse = (e) => {
    if (!stimulus || trial >= stimuli.length) return;

    const keyPressed = e.key.toLowerCase();
    const startTime = performance.now();
    const endTime = performance.now();
    const reactionTime = endTime - startTime;

    const expectedKey = stimulus.category === 'Liberal Arts' || stimulus.category === 'Male' ? 'e' : 'i';
    const correct = keyPressed === expectedKey;

    setReactionTimes([...reactionTimes, { reactionTime, correct }]);
    handleNextTrial(); // Move to the next trial
  };

  useEffect(() => {
    window.addEventListener('keydown', handleResponse);
    return () => {
      window.removeEventListener('keydown', handleResponse);
    };
  }, [trial, stimulus]);

  // Once all stimuli are completed, display results
  if (trial >= stimuli.length) {
    const correctResponses = reactionTimes.filter(rt => rt.correct).length;
    const avgReactionTime = (
      reactionTimes.reduce((acc, curr) => acc + curr.reactionTime, 0) / reactionTimes.length
    ).toFixed(2);

    return (
      <div className="IAT-container">
        <h2>Test Completed</h2>
        <p>Total Trials: {stimuli.length}</p>
        <p>Correct Responses: {correctResponses}</p>
        <p>Average Reaction Time: {avgReactionTime} ms</p>
      </div>
    );
  }

  // Show instructions if the state is true
  if (showInstructions) {
    return (
      <div className="IAT-container">
        <h2>How to Play</h2>
        <p>In this test, you will see words appear on the screen.</p>
        <p>Press "E" for words related to the left category and "I" for words related to the right category.</p>
        <p>Make sure to respond as quickly and accurately as possible!</p>
        <p>If you make a mistake, a red "X" will appear. Press the other key to continue.</p>
        <button onClick={() => setShowInstructions(false)}>Start Test</button>
      </div>
    );
  }

  return (
    <div className="IAT-container">
      {/* Timer Bar */}
      <div className="timer-bar">
        <div 
          className="timer-fill" 
          style={{ width: `${(timeLeft / 3) * 100}%` }} // Set width based on time left
        />
      </div>

      {/* Top instruction for key presses */}
      <div className="instructions-row">
        <span>Press "E" for</span>
        <span>Press "I" for</span>
      </div>

      {/* Category and stimulus section */}
      <div className="categories-stimulus-row">
        {/* Left categories */}
        <div className="category-left">
          <h2>Male</h2>
          <h3>Liberal Arts</h3>
        </div>

        {/* Central stimulus */}
        <div className="stimulus">
          {stimulus ? <h1>{stimulus.word}</h1> : <p>Loading stimulus...</p>}
        </div>

        {/* Right categories */}
        <div className="category-right">
          <h2>Female</h2>
          <h3>Science</h3>
        </div>
      </div>

      {/* Bottom instructions */}
      <div className="error-instructions">
        <p>If you make a mistake, a <span className="error-text">red X</span> will appear. Press the other key to continue.</p>
      </div>
    </div>
  );
};

export default IATTest;
