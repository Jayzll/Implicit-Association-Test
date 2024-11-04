import * as React from "react";
import type { MetaFunction } from "react-router";

import "./index.css";
import { useInterval } from "~/utils";

export const meta: MetaFunction = () => {
	return [
		{ title: "IAT App" },
		{ name: "description", content: "Welcome to IAT" },
	];
};

const Index = () => {
	return <IATTest />;
};

export default Index;

type Stimulus = {
	word: string;
	category: string;
};

type ReactionTime = {
	reactionTime: number;
	correct: boolean;
	category: string;
};

// Practice Stimuli
const practiceStimuli = [
	{ word: "Chemistry", category: "Science" },
	{ word: "Literature", category: "Liberal Arts" },
	{ word: "Nuclear Physics", category: "Science" },
	{ word: "Photography", category: "Liberal Arts" },
];

// Level 1: Science vs Liberal Arts
// Level 1: Science vs Liberal Arts
const level1Stimuli = [
    { word: "Anthropology", category: "Liberal Arts" },
    { word: "Astrophysics", category: "Science" },
    { word: "Philosophy", category: "Liberal Arts" },
    { word: "Biology", category: "Science" },
    { word: "Psychology", category: "Science" },
    { word: "Chemistry", category: "Science" },
    { word: "Sociology", category: "Liberal Arts" },
    { word: "Physics", category: "Science" },
    { word: "Political Science", category: "Liberal Arts" },
    { word: "Genetics", category: "Science" },
    { word: "History", category: "Liberal Arts" },
    { word: "Geology", category: "Science" },
    { word: "Literature", category: "Liberal Arts" },
    { word: "Neuroscience", category: "Science" },
    { word: "Linguistics", category: "Liberal Arts" },
    { word: "Ecology", category: "Science" }
];


// Level 2: Male vs Female
const level2Stimuli = [
	{ word: "Dad", category: "Male" },
	{ word: "Mom", category: "Female" },
	{ word: "Brother", category: "Male" },
	{ word: "Sister", category: "Female" },
	{ word: "Grandpa", category: "Male"},
	{ word: "Grandma", category: "Female" },
	{ word: "Uncle", category: "Male"},
	{ word: "Auntie", category: "Female" },
];

// Level 3: Combined Male/Female + Science/Liberal Arts
const combinedStimuli = [
	{ word: "Anthropology", category: "Liberal Arts" },
    { word: "Astrophysics", category: "Science" },
    { word: "Philosophy", category: "Liberal Arts" },
    { word: "Biology", category: "Science" },
    { word: "Psychology", category: "Science" },
    { word: "Chemistry", category: "Science" },
    { word: "Sociology", category: "Liberal Arts" },
    { word: "Physics", category: "Science" },
    { word: "Political Science", category: "Liberal Arts" },
    { word: "Genetics", category: "Science" },
    { word: "History", category: "Liberal Arts" },
    { word: "Geology", category: "Science" },
    { word: "Literature", category: "Liberal Arts" },
    { word: "Neuroscience", category: "Science" },
    { word: "Linguistics", category: "Liberal Arts" },
    { word: "Ecology", category: "Science" },
	{ word: "Dad", category: "Male" },
	{ word: "Mom", category: "Female" },
	{ word: "Brother", category: "Male" },
	{ word: "Sister", category: "Female" },
	{ word: "Grandpa", category: "Male"},
	{ word: "Grandma", category: "Female" },
	{ word: "Uncle", category: "Male"},
	{ word: "Auntie", category: "Female" },
];

// Shuffle function using Fisher-Yates algorithm
const shuffleArray = (array: Stimulus[]) => {
	const shuffledArray = [...array];
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}
	return shuffledArray;
};

const IATTest = () => {
	const [trial, setTrial] = React.useState(0);
	const [reactionTimes, setReactionTimes] = React.useState<ReactionTime[]>([]);
	const [level, setLevel] = React.useState(1); // Track the current level
	const [showInstructions, setShowInstructions] = React.useState(true); // Instructions for each level
	const [isPractice, setIsPractice] = React.useState(true); // Track if in practice round
	const [showReadyScreen, setShowReadyScreen] = React.useState(false); // Ready screen between levels
	const [timeLeft, setTimeLeft] = React.useState(3); // Timer state for 3 seconds
	const [startTime, setStartTime] = React.useState<number | null>(null); // New state for start time
	const [levelTrialCount, setLevelTrialCount] = React.useState(0);

	// Conditionally set stimuli based on the current level or practice mode
	const currentStimuli: Stimulus[] = React.useMemo(() => {
		return shuffleArray(
			isPractice
				? practiceStimuli
				: level === 1
					? level1Stimuli
					: level === 2
						? level2Stimuli
						: combinedStimuli,
		);
	}, [isPractice, level]);

	const handleNextTrial = React.useCallback(
		(userResponse = false) => {
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
				if (isPractice) {
					// After practice, start level 1
					setIsPractice(false);
					setShowReadyScreen(true);
					setLevel(1); // Corrected this to 1
					setTrial(0); // Reset trials for the new level
				} else if (level < 6) {
					// Move to next level after current level ends
					setShowReadyScreen(true);
					setLevel(level + 1); // Move to the next level
					setTrial(0); // Reset trial count for the new level
				} else {
					setLevel(level + 1); // Proceed to the result screen
				}
			}
		},
		[currentStimuli, isPractice, level, trial, reactionTimes],
	);
	
	const stimulus = currentStimuli[trial];

	useInterval(
		() => {
			if (level <=6 && trial < currentStimuli.length) {
				setTimeLeft((prev) => {
					if (prev <= 0) {
						return 0; // Prevent negative value
					}
					return prev - 0.1; // Decrease time left by 0.1 seconds
				});

				if (timeLeft <= 0) {
					handleNextTrial(false);
					setTimeLeft(3);
				}	
			}
		},
		!isPractice && trial < currentStimuli.length && level <= 6 ? 100 : null,
	);

	React.useEffect(() => {
		const handleResponse = (e: KeyboardEvent) => {
			if (level > 6 || !stimulus || trial >= currentStimuli.length) return;

			const keyPressed = e.key.toLowerCase();

			if (keyPressed !== "e" && keyPressed !== "i") {
				return;
			}

			const endTime = performance.now();
			const reactionTime = startTime ? endTime - startTime : 0;

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
					(stimulus.category === "Female" || stimulus.category === "Art") ? "e" : "i";
			}

			const correct = keyPressed === expectedKey;
			// Only allow moving to the next trial if the response is correct
			if (correct) {
				setReactionTimes([
					...reactionTimes,
					{ reactionTime, correct, category: stimulus.category },
				]);
				setTimeLeft(3); // Reset timer for next trial
				handleNextTrial(true); // Move to the next trial
			} else {
				// Show an error if the response is incorrect
				setReactionTimes([
					...reactionTimes,
					{ reactionTime, correct: false, category: stimulus.category },
				]);
				// You can also add an error state to show a red 'X' or other error indicator
			}
		};
		window.addEventListener("keydown", handleResponse);
		return () => {
			window.removeEventListener("keydown", handleResponse);
		};
	}, [
		trial,
		stimulus,
		isPractice,
		currentStimuli.length,
		handleNextTrial,
		level,
		reactionTimes,
		startTime,
	]);

	const startNextLevel = () => {
		setLevel(level + 1);
		setTrial(0); // Reset trials for the new level
		setTimeLeft(3);
		setShowReadyScreen(false); // Hide the ready screen
	};

	const avgReactionTimeForPair = (category1: string, category2: string) => {
		const times = reactionTimes
			.filter((rt) =>
				rt.correct &&
				(rt.category === category1 || rt.category === category2) // Match categories
			)
			.map((rt) => rt.reactionTime);
	
		return times.length > 0
			? (times.reduce((acc, time) => acc + time, 0) / times.length).toFixed(2)
			: "0.00";
	};
	


	// Final results after all levels
	if (level > 6) {
		const correctResponses = reactionTimes.filter((rt) => rt.correct).length;
		const totalTrials = reactionTimes.length;
		const avgReactionTime = totalTrials > 0 
			? (
				reactionTimes.reduce((acc, curr) => acc + curr.reactionTime, 0) / totalTrials
				).toFixed(2)
			: "0.00"; // default to "0.00" if no trials

			console.log("Average Reaction Time:", avgReactionTime); // for debugging
        const avgFemaleScience = avgReactionTimeForPair("Female", "Science");
        const avgMaleScience = avgReactionTimeForPair("Male", "Science");
        const avgFemaleArts = avgReactionTimeForPair("Female", "Liberal Arts");
        const avgMaleArts = avgReactionTimeForPair("Male", "Liberal Arts");		

		return (
			<div className="IAT-container">
				<h2>Test Completed</h2>
				<p>Total Trials: {totalTrials}</p>
				<p>Correct Responses: {correctResponses}</p>
				<p>Average Reaction Time: {avgReactionTime} ms</p>
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


	// Ready screen between levels
	if (showReadyScreen) {
		let nextTask = "";
		if (level === 0) nextTask = "Science vs Liberal Arts categories";
		if (level === 1) nextTask = "Male vs Female categories";
		if (level === 2) nextTask = "Male and Liberal Art vs Female and Science";
		if (level === 3) nextTask = "Male and Science vs Female and Liberal Arts";
		if (level === 4) nextTask = "Female and Science vs Male and Liberal Arts";
		if (level === 5) nextTask = "Female and Liberal Art vs Male and Science";

		return (
			<div className="IAT-container">
				<h2>Get Ready for the Next Level</h2>
				<p>
					In the next level, you will sort <strong>{nextTask}</strong>.
				</p>
				<button type="button" onClick={startNextLevel}>
					Start Next Level
				</button>
			</div>
		);
	}

	// Initial instructions for the first level
	if (showInstructions) {
		return (
			<div className="IAT-container">
				<h2>HOW SEXIST ARE YOU</h2>
				<p>
					{" "}
					You have selected the Gender-Science Task. In this study you will
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
				<button type="button" onClick={() => setShowInstructions(false)}>
					Start Practice
				</button>
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
					{isPractice || level === 1 ? <h2>Liberal Arts</h2> : //pratice subjects 
						level === 2 ? <h2>Male</h2> : // example male vs female
						level === 3 ? <h2> Male</h2> : // Male and Art 
						level === 4 ? <h2>Male </h2> : // Female Science 
						level === 5 ? <h2>Female</h2> : // Male and Science
						<h2>Female</h2> // Female and Arts 
					}
					{level === 3 && <h3>Liberal Arts</h3>}
					{level === 4 && <h3>Science</h3>}
					{level === 5 && <h3>Science</h3>}
					{level === 6 && <h3>Liberal Arts</h3>}
				</div>

				{/* Central stimulus */}
				<div className="stimulus">
					{stimulus ? <h1>{stimulus.word}</h1> : <p>Loading stimulus...</p>}
				</div>

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

			{/* Bottom instructions */}
			<div className="error-instructions">
				<p>
					If you make a mistake, a <span className="error-text">red X</span>{" "}
					will appear. Press the other key to continue.
				</p>
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
