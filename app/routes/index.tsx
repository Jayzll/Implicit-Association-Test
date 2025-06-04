import { useEffect, useState } from "react";
import "./index.css";

type Category = "Male" | "Female" | "Science" | "Arts";
type Stimulus = { word: string; category: Category };

const genderWords: Stimulus[] = [
  { word: "Man", category: "Male" },
  { word: "Woman", category: "Female" },
  { word: "Boy", category: "Male" },
  { word: "Girl", category: "Female" },
];

const scienceWords: Stimulus[] = [
  { word: "Physics", category: "Science" },
  { word: "Chemistry", category: "Science" },
  { word: "Biology", category: "Science" },
  { word: "Math", category: "Science" },
];

const artsWords: Stimulus[] = [
  { word: "Literature", category: "Arts" },
  { word: "History", category: "Arts" },
  { word: "Music", category: "Arts" },
  { word: "Poetry", category: "Arts" },
];

const allWords: Stimulus[] = [...genderWords, ...scienceWords, ...artsWords];

const levels = [
  {
    label: "Practice Gender",
    keys: { Male: "e", Female: "i" },
  },
  {
    label: "Practice Science vs Arts",
    keys: { Science: "e", Arts: "i" },
  },
  {
    label: "Combined: Female + Science vs Male + Arts",
    keys: { Female: "e", Science: "e", Male: "i", Arts: "i" },
  },
  {
    label: "Combined: Male + Science vs Female + Arts",
    keys: { Male: "e", Science: "e", Female: "i", Arts: "i" },
  },
  {
    label: "Combined: Male + Arts vs Female + Science",
    keys: { Male: "e", Arts: "e", Female: "i", Science: "i" },
  },
  {
    label: "Combined: Female + Arts vs Male + Science",
    keys: { Female: "e", Arts: "e", Male: "i", Science: "i" },
  },
];

const practiceLevels = [0, 1];
const trials_per_level = 10;

<<<<<<< HEAD
export default function IATPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [trialCount, setTrialCount] = useState(0);
  const [showInstruction, setShowInstruction] = useState(true);
  const [level, setLevel] = useState(0);
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [reactionTimes, setReactionTimes] = useState<
    { category: Category; correct: boolean; reactionTime: number; level: number }[]
  >([]);
=======
const IATTest = () => {
	const [trial, setTrial] = React.useState(0);
	const [reactionTimes, setReactionTimes] = React.useState<ReactionTime[]>([]);
	const [level, setLevel] = React.useState(1); // Track the current level
	const [showInstructions, setShowInstructions] = React.useState(true); // Instructions for each level
	const [isPractice, setIsPractice] = React.useState(true); // Track if in practice round
	const [showReadyScreen, setShowReadyScreen] = React.useState(false); // Ready screen between levels
	const [timeLeft, setTimeLeft] = React.useState(3); // Timer state for 3 seconds
	const [startTime, setStartTime] = React.useState<number | null>(null); // New state for start time
	const [nextTrialTriggered, setNextTrialTriggered] = React.useState(false);

>>>>>>> aad16b4e093d57e59922a02b63eada1c36f74098

  // Store reaction times separately for the 4 groups
  const [rtGroups, setRtGroups] = useState<{
    femaleScience: number[];
    femaleArts: number[];
    maleScience: number[];
    maleArts: number[];
  }>({
    femaleScience: [],
    femaleArts: [],
    maleScience: [],
    maleArts: [],
  });

<<<<<<< HEAD
  const [startTime, setStartTime] = useState<number>(Date.now());
=======
	const handleNextTrial = React.useCallback(
		(userResponse = false) => {
			if (showReadyScreen) {
				return;
			}
			console.log(`Current level: ${level}`);
			console.log(`Current trial: ${trial}`);
			if (level > 6) {
				return;
			}
			
			if (!userResponse) {
				setReactionTimes([
					...reactionTimes,
					{ reactionTime: 0, correct: false, category: stimulus.category },
				]);
			}
	
			if (trial + 1 < currentStimuli.length) {
				setTrial(trial + 1); // Move to the next trial
				setStartTime(performance.now());
			} else {
				console.log("Next Level")
				if (isPractice) {
					// After practice, start level 1
					setIsPractice(false);
					setShowReadyScreen(true);
					setLevel(1); // Corrected this to 1
					setTrial(0); // Reset trials for the new level
				} else if (level < 6) {
					// Move to next level after current level ends
					setShowReadyScreen(true);
					setTrial(0); // Reset trial count for the new level
				} else {
					setLevel(level + 1); // Proceed to the result screen
					console.log("procede to final")
				}
			}
		},
		[currentStimuli, isPractice, level, trial, reactionTimes, showReadyScreen],
	);
	
	const stimulus = currentStimuli[trial];
>>>>>>> aad16b4e093d57e59922a02b63eada1c36f74098

  // Select words per level
  function getWordForLevel(level: number): Stimulus {
    switch (level) {
      case 0:
        return genderWords[Math.floor(Math.random() * genderWords.length)];
      case 1:
        return [...scienceWords, ...artsWords][
          Math.floor(Math.random() * (scienceWords.length + artsWords.length))
        ];
      default:
        return allWords[Math.floor(Math.random() * allWords.length)];
    }
  }

  // Advance trial or level, show stimulus, track reaction times
  useEffect(() => {
    if (showIntro) return;
    if (level < levels.length && !showInstruction) {
      if (trialCount === 0) {
        // New level start - pick first stimulus
        const word = getWordForLevel(level);
        setStimulus(word);
        setStartTime(Date.now());
      }
    }
  }, [level, showInstruction, trialCount]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showInstruction || !stimulus || level >= levels.length) return;

      const currentLevel = levels[level];
      const correctKey = currentLevel.keys[stimulus.category];
      const keyPressed = e.key.toLowerCase();
      const reactionTime = Date.now() - startTime;
      const correct = keyPressed === correctKey;

      // Store global reaction times
      setReactionTimes((prev) => [
        ...prev,
        { category: stimulus.category, correct, reactionTime, level },
      ]);

      // Update rtGroups if correct and not practice level
      if (correct && !practiceLevels.includes(level)) {
        // Determine group for this trial
        let groupKey: keyof typeof rtGroups | null = null;

<<<<<<< HEAD
        // Figure out which category the stimulus belongs to and key assignment,
        // then classify into one of four groups:
        // Female+Science, Female+Arts, Male+Science, Male+Arts
=======
			let expectedKey = "";
			if (isPractice) {
				// Practice: Liberal Arts ('e') vs Science ('i'), Male ('e') vs Female ('i')
				expectedKey =
					stimulus.category === "Liberal Arts" || stimulus.category === "Male"
						? "e"
						: "i";
			} else if (level === 1) {
				// Level 1: Liberal Arts ('e') vs Science ('i')
				expectedKey = stimulus.category === "Liberal Arts" ? "e" : "i";
			} else if (level === 2) {
				// Level 2: Male ('e') vs Female ('i')
				expectedKey = stimulus.category === "Male" ? "e" : "i";
			} else if (level === 3) {
				// Level 3: Combined task (e.g., Liberal Arts and Male vs Science and Female)
				expectedKey = 
					(stimulus.category === "Liberal Arts" || stimulus.category === "Male") ? "e" : "i";
			} else if (level === 4) {
				// Level 4: Female and Science vs Male Art 
				expectedKey =
					(stimulus.category === "Female" || stimulus.category === "Science") ? "e" : "i";
			} else if (level === 5) {
				// Level 5: Male and Science vs Female Art
				expectedKey =
					(stimulus.category === "Male" || stimulus.category === "Science") ? "e" : "i";
			} else if (level === 6) {
				// Level 6: Female and Art vs Male and Science 
				expectedKey = 
					(stimulus.category === "Female" || stimulus.category === "Liberal Arts") ? "e" : "i";
			}
>>>>>>> aad16b4e093d57e59922a02b63eada1c36f74098

        const leftKeyCats = Object.entries(currentLevel.keys)
          .filter(([, k]) => k === "e")
          .map(([cat]) => cat as Category);
        const rightKeyCats = Object.entries(currentLevel.keys)
          .filter(([, k]) => k === "i")
          .map(([cat]) => cat as Category);

<<<<<<< HEAD
        // Check which side the stimulus category belongs to
        const onLeft = leftKeyCats.includes(stimulus.category);
        const onRight = rightKeyCats.includes(stimulus.category);

        // Now classify into 4 groups:
        // We need to know the pairings for this level, so let's get all categories present
        // And map the stimulus to male/female and science/arts as needed.
=======
	const startNextLevel = () => {
		setLevel(level + 1);
		console.log("add level 3rd")
		setTrial(0); // Reset trials for the new level
		setTimeLeft(3);
		setShowReadyScreen(false); // Hide the ready screen
	};

	const avgReactionTimeForPair = (category1: string, category2: string) => {
		const times = reactionTimes
			.filter((rt, index) =>
				rt.correct &&
				(rt.category === category1 || rt.category === category2)&&// Match categories
				index >= currentStimuli.length * 2 
			)

			.map((rt) => rt.reactionTime);
	
		return times.length > 0
			? (times.reduce((acc, time) => acc + time, 0) / times.length).toFixed(2)
			: "0.00";
	};
	
>>>>>>> aad16b4e093d57e59922a02b63eada1c36f74098

        // Assign the "gender" and "domain" for the stimulus:
        const gender = stimulus.category === "Male" || stimulus.category === "Female" ? stimulus.category : null;
        const domain = stimulus.category === "Science" || stimulus.category === "Arts" ? stimulus.category : null;

<<<<<<< HEAD
        // But in combined levels, sometimes stimulus category is one of 4.
        // So to identify the pair, we must see which categories are on left and right keys.

        // Check if "Female" and "Science" are both on left or right
        // We'll check the key assignments for each category

        // We'll find the pairings for the sides to identify which group this trial belongs to:

        // The four groups:
        // femaleScience: Female and Science categories assigned to same key ("e" or "i")
        // femaleArts: Female and Arts assigned to same key
        // maleScience: Male and Science assigned to same key
        // maleArts: Male and Arts assigned to same key
=======
	// Final results after all levels
	if (level > 6) {
		const correctResponses = reactionTimes
			.filter((rt, index) => rt.correct && index >= currentStimuli.length * 2) // Count only Levels 3 to 6
			.length;
		const totalTrials = reactionTimes.filter((_, index) => index >= currentStimuli.length * 2).length;
		const avgReactionTime = totalTrials > 0
			? (
				reactionTimes
					.slice(currentStimuli.length * 2) // Use only Levels 3 to 6
					.reduce((acc, curr) => acc + curr.reactionTime, 0) / totalTrials
			  ).toFixed(2)
			: "0.00";
	
		const avgFemaleScience = avgReactionTimeForPair("Female", "Science");
		const avgMaleScience = avgReactionTimeForPair("Male", "Science");
		const avgFemaleArts = avgReactionTimeForPair("Female", "Liberal Arts");
		const avgMaleArts = avgReactionTimeForPair("Male", "Liberal Arts");
	
		return (
			<div className="IAT-container">
				<h2>Test Completed</h2>
				<p>Total Trials (Levels 3-6): {totalTrials}</p>
				<p>Correct Responses (Levels 3-6): {correctResponses}</p>
				<p>Average Reaction Time (Levels 3-6): {avgReactionTime} ms</p>
				<p>Average Reaction Time (Female-Science): {avgFemaleScience} ms</p>
				<p>Average Reaction Time (Male-Science): {avgMaleScience} ms</p>
				<p>Average Reaction Time (Female-Arts): {avgFemaleArts} ms</p>
				<p>Average Reaction Time (Male-Arts): {avgMaleArts} ms</p>
	
				<h3>Interpretation:</h3>
				<p>{avgFemaleScience < avgMaleScience ? "Participant shows a stronger association between females and science." : "Participant shows a stronger association between males and science."}</p>
				<p>{avgFemaleArts < avgMaleArts ? "Participant shows a stronger association between females and arts." : "Participant shows a stronger association between males and arts."}</p>
			</div>
		);
	}
	
>>>>>>> aad16b4e093d57e59922a02b63eada1c36f74098

        // Determine which key side is Female assigned to
        const femaleKey = currentLevel.keys["Female"];
        const maleKey = currentLevel.keys["Male"];
        const scienceKey = currentLevel.keys["Science"];
        const artsKey = currentLevel.keys["Arts"];

<<<<<<< HEAD
        // Now check combinations
        // Example: if femaleKey === scienceKey, then Female+Science is one group assigned to that key
        // and maleKey === artsKey forms Male+Arts group on the other key.
=======
	// Ready screen between levels
	if (showReadyScreen) {
		let nextTask = "";
		if (level === 0) nextTask = "Science vs Liberal Arts categories";
		if (level === 1) nextTask = "Male vs Female categories";
		if (level === 2) nextTask = "Male and Liberal Art vs Female and Science";
		if (level === 3) nextTask = "Female and Science vs Male and Liberal Arts";
		if (level === 4) nextTask = "Male and Science vs Female and Liberal Arts";
		if (level === 5) nextTask = "Female and Liberal Art vs Male and Science";
>>>>>>> aad16b4e093d57e59922a02b63eada1c36f74098

        if (
          femaleKey === scienceKey &&
          ((stimulus.category === "Female" || stimulus.category === "Science") && correctKey === femaleKey)
        ) {
          groupKey = "femaleScience";
        } else if (
          femaleKey === artsKey &&
          ((stimulus.category === "Female" || stimulus.category === "Arts") && correctKey === femaleKey)
        ) {
          groupKey = "femaleArts";
        } else if (
          maleKey === scienceKey &&
          ((stimulus.category === "Male" || stimulus.category === "Science") && correctKey === maleKey)
        ) {
          groupKey = "maleScience";
        } else if (
          maleKey === artsKey &&
          ((stimulus.category === "Male" || stimulus.category === "Arts") && correctKey === maleKey)
        ) {
          groupKey = "maleArts";
        }

        if (groupKey) {
          setRtGroups((prev) => ({
            ...prev,
            [groupKey]: [...prev[groupKey], reactionTime],
          }));
        }
      }

      // Proceed to next trial or level
      if (trialCount + 1 >= trials_per_level) {
        setLevel((prev) => prev + 1);
        setShowInstruction(true);
        setTrialCount(0);
      } else {
        setTrialCount((prev) => prev + 1);
        const word = getWordForLevel(level);
        setStimulus(word);
        setStartTime(Date.now());
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [stimulus, level, startTime, trialCount, showInstruction]);

  // Calculate averages helper
  const avg = (arr: number[]) => (arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length);

  // Calculate final results when finished
  const finished = level >= levels.length;

  // Average RTs per group
  const avgFemaleScienceRT = avg(rtGroups.femaleScience);
  const avgFemaleArtsRT = avg(rtGroups.femaleArts);
  const avgMaleScienceRT = avg(rtGroups.maleScience);
  const avgMaleArtsRT = avg(rtGroups.maleArts);

  // Overall average reaction time for correct responses (all levels except practice)
  const allRTs = reactionTimes.filter((rt) => rt.correct && !practiceLevels.includes(rt.level)).map((rt) => rt.reactionTime);
  const overallAvgRT = avg(allRTs);

  // Calculate pooled std deviation for D-score
  const pooledStdDev = Math.sqrt(
    allRTs.reduce((sum, rt) => sum + Math.pow(rt - overallAvgRT, 2), 0) / (allRTs.length || 1)
  );

  // D-score calculation for Female vs Male on Science (you can tweak which groups to compare)
  // Let's define: femaleAvg = average of Female+Science and Female+Arts, maleAvg = average of Male+Science and Male+Arts
  const femaleAvgRT = avg([...rtGroups.femaleScience, ...rtGroups.femaleArts]);
  const maleAvgRT = avg([...rtGroups.maleScience, ...rtGroups.maleArts]);
  const dScore = pooledStdDev ? ((maleAvgRT - femaleAvgRT) / pooledStdDev).toFixed(2) : "0";

  // Interpretation based on dScore
  let biasInterpretation = "No clear implicit preference.";
  const d = parseFloat(dScore);
  if (d > 0.65) {
    biasInterpretation = "Strong implicit association between males and science.";
  } else if (d > 0.35) {
    biasInterpretation = "Moderate implicit association between males and science.";
  } else if (d > 0.15) {
    biasInterpretation = "Slight implicit association between males and science.";
  } else if (d < -0.65) {
    biasInterpretation = "Strong implicit association between females and science.";
  } else if (d < -0.35) {
    biasInterpretation = "Moderate implicit association between females and science.";
  } else if (d < -0.15) {
    biasInterpretation = "Slight implicit association between females and science.";
  }

  // Find group with fastest average RT
  const groupsRTs = [
    { name: "Female + Science", avgRT: avgFemaleScienceRT },
    { name: "Female + Arts", avgRT: avgFemaleArtsRT },
    { name: "Male + Science", avgRT: avgMaleScienceRT },
    { name: "Male + Arts", avgRT: avgMaleArtsRT },
  ];
  groupsRTs.sort((a, b) => a.avgRT - b.avgRT);
  const fastestGroup = groupsRTs[0];

  if (showIntro) {
    return (
      <div className="IAT-container">
        <h2>HOW SEXIST ARE YOU</h2>
				<p>
					{" "}
					This is a Gender-Science Task. In this study you will
					complete an Implicit Association Test (IAT) in which you will be asked
					to <strong>sort words into groups as fast as you can. </strong> This
					study should take about 10 minutes to complete. At the end, you will
					receive your IAT result along with information about what it means.
				</p>
				<p>In this test, you will see words appear on the screen.</p>
				<p>First, there will be a practice round with no timer.</p>
				<p>In Level 1, you will sort Science and Liberal Arts categories</p>
				<p>In Level 2, you will sort Male and Female categories.</p>
				<p>In Level 3, you will sort combined categories.</p>
        <button onClick={() => setShowIntro(false)}>Start Test</button>
      </div>
    );
  }

  return (
    <div className="IAT-container">
      <h1>Gender & Science IAT</h1>

<<<<<<< HEAD
      {level < levels.length ? (
        showInstruction ? (
          <>
            <h2>Next: {levels[level].label}</h2>
            <p>
              You'll press <strong>E</strong> for:{" "}
              <strong>
                {Object.entries(levels[level].keys)
                  .filter(([, key]) => key === "e")
                  .map(([cat]) => cat)
                  .join(" / ")}
              </strong>
            </p>
            <p>
              You'll press <strong>I</strong> for:{" "}
              <strong>
                {Object.entries(levels[level].keys)
                  .filter(([, key]) => key === "i")
                  .map(([cat]) => cat)
                  .join(" / ")}
              </strong>
            </p>
            <button onClick={() => setShowInstruction(false)}>Start Level</button>
          </>
        ) : (
          <>
            <h2>
              Level {level + 1}: {levels[level].label}
            </h2>
            <div className="instructions-row">
              <p>
                Press "E" for:{" "}
                <strong>
                  {Object.entries(levels[level].keys)
                    .filter(([, key]) => key === "e")
                    .map(([cat]) => cat)
                    .join(" / ")}
                </strong>
              </p>
              <p>
                Press "I" for:{" "}
                <strong>
                  {Object.entries(levels[level].keys)
                    .filter(([, key]) => key === "i")
                    .map(([cat]) => cat)
                    .join(" / ")}
                </strong>
              </p>
            </div>
=======
			{/* Category and stimulus section */}
			<div className="categories-stimulus-row">
				{/* Left categories */}
				<div className="category-left">
					{isPractice || level === 1 ? <h2>Liberal Arts</h2> : //pratice subjects 
						level === 2 ? <h2>Male</h2> : // example male vs female
						level === 3 ? <h2> Male</h2> : // Male and Art 
						level === 4 ? <h2>Female </h2> : // Female Science 
						level === 5 ? <h2>Male</h2> : // Male and Science
						<h2>Female</h2> // Female and Arts 
					}
					{level === 3 && <h3>Liberal Arts</h3>}
					{level === 4 && <h3>Science</h3>}
					{level === 5 && <h3>Science</h3>}
					{level === 6 && <h3>Liberal Arts</h3>}
				</div>
>>>>>>> aad16b4e093d57e59922a02b63eada1c36f74098

            <div className="categories-stimulus-row">
              <div className="category-left">
                <h2>
                  {Object.entries(levels[level].keys)
                    .filter(([, key]) => key === "e")
                    .map(([cat]) => cat)
                    .join(" / ")}
                </h2>
              </div>

<<<<<<< HEAD
              <div className="stimulus">
                <h3 style={{ fontSize: "3rem", marginTop: "2rem" }}>{stimulus?.word}</h3>
              </div>
=======
				{/* Right categories */}
				<div className="category-right">
					{isPractice || level === 1 ? <h2>Science</h2> : //pratice subjects 
					level === 2 ? <h2>Female</h2> : // example male vs female
					level === 3 ? <h2>Female</h2> : // Female and Science
					level === 4 ? <h2>Male</h2> : // Male and Art
					level === 5 ? <h2>Female</h2> : // Female and Art
					<h2>Male</h2> // Male and Science 
					}
					{level === 3 && <h3>Science</h3>}
					{level === 4 && <h3>Liberal Art</h3>}
					{level === 5 && <h3>Liberal Art</h3>}
					{level === 6 && <h3>Science</h3>}
				</div>
			</div>
>>>>>>> aad16b4e093d57e59922a02b63eada1c36f74098

              <div className="category-right">
                <h2>
                  {Object.entries(levels[level].keys)
                    .filter(([, key]) => key === "i")
                    .map(([cat]) => cat)
                    .join(" / ")}
                </h2>
              </div>
            </div>
          </>
        )
      ) : (
        <>
          <h2>Test Completed</h2>
          <p>
            <strong>Average Reaction Time (Female + Science):</strong>{" "}
            {avgFemaleScienceRT.toFixed(2)} ms
          </p>
          <p>
            <strong>Average Reaction Time (Female + Arts):</strong>{" "}
            {avgFemaleArtsRT.toFixed(2)} ms
          </p>
          <p>
            <strong>Average Reaction Time (Male + Science):</strong>{" "}
            {avgMaleScienceRT.toFixed(2)} ms
          </p>
          <p>
            <strong>Average Reaction Time (Male + Arts):</strong>{" "}
            {avgMaleArtsRT.toFixed(2)} ms
          </p>
          <p>
            <strong>Overall Average Reaction Time:</strong> {overallAvgRT.toFixed(2)} ms
          </p>
          <p>
            <strong>IAT D-Score:</strong> {dScore}
          </p>
          <p style={{ color: d > 0.15 ? "blue" : d < -0.15 ? "green" : "gray" }}>
            <strong>Interpretation:</strong> {biasInterpretation}
          </p>
          <p>
            <strong>Fastest Average RT Group (Implicit Association):</strong> {fastestGroup.name} (
            {fastestGroup.avgRT.toFixed(2)} ms)
          </p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </>
      )}
    </div>
  );
}
