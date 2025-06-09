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

export default function IATPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [trialCount, setTrialCount] = useState(0);
  const [showInstruction, setShowInstruction] = useState(true);
  const [level, setLevel] = useState(0);
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [reactionTimes, setReactionTimes] = useState<
    { category: Category; correct: boolean; reactionTime: number; level: number }[]
  >([]);

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

  const [startTime, setStartTime] = useState<number>(Date.now());

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

        // Figure out which category the stimulus belongs to and key assignment,
        // then classify into one of four groups:
        // Female+Science, Female+Arts, Male+Science, Male+Arts

        const leftKeyCats = Object.entries(currentLevel.keys)
          .filter(([, k]) => k === "e")
          .map(([cat]) => cat as Category);
        const rightKeyCats = Object.entries(currentLevel.keys)
          .filter(([, k]) => k === "i")
          .map(([cat]) => cat as Category);

        // Check which side the stimulus category belongs to
        const onLeft = leftKeyCats.includes(stimulus.category);
        const onRight = rightKeyCats.includes(stimulus.category);

        // Now classify into 4 groups:
        // We need to know the pairings for this level, so let's get all categories present
        // And map the stimulus to male/female and science/arts as needed.

        // Assign the "gender" and "domain" for the stimulus:
        const gender = stimulus.category === "Male" || stimulus.category === "Female" ? stimulus.category : null;
        const domain = stimulus.category === "Science" || stimulus.category === "Arts" ? stimulus.category : null;

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

        // Determine which key side is Female assigned to
        const femaleKey = currentLevel.keys["Female"];
        const maleKey = currentLevel.keys["Male"];
        const scienceKey = currentLevel.keys["Science"];
        const artsKey = currentLevel.keys["Arts"];

        // Now check combinations
        // Example: if femaleKey === scienceKey, then Female+Science is one group assigned to that key
        // and maleKey === artsKey forms Male+Arts group on the other key.

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
  // const femaleAvgRT = avg([...rtGroups.femaleScience, ...rtGroups.maleScience]);
  // const maleAvgRT = avg([...rtGroups.femaleArts, ...rtGroups.maleArts]);
  // const dScore = pooledStdDev ? ((maleAvgRT - femaleAvgRT) / pooledStdDev).toFixed(2) : "0";
  const dScore = pooledStdDev ? ((avgFemaleScienceRT - avgMaleScienceRT) / pooledStdDev).toFixed(2) : "0";

  // Interpretation based on dScore
  let biasInterpretation = "No clear implicit preference.";
  const d = parseFloat(dScore);
  if (d > 0.65) {
    biasInterpretation = "Strong implicit association between females and science.";
  } else if (d > 0.35) {
    biasInterpretation = "Moderate implicit association between females and science.";
  } else if (d > 0.15) {
    biasInterpretation = "Slight implicit association between females and science.";
  } else if (d < -0.65) {
    biasInterpretation = "Strong implicit association between males and science.";
  } else if (d < -0.35) {
    biasInterpretation = "Moderate implicit association between males and science.";
  } else if (d < -0.15) {
    biasInterpretation = "Slight implicit association between males and science.";
  } else {
    biasInterpretation = "No clear implicit preference.";
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
        <h2>Gender-Science Implicit Association Test</h2>
				<p>
					{" "}
					This is a Gender-Science Task. In this study you will
					complete an Implicit Association Test (IAT) in which you will be asked
					to <strong>sort words into groups as fast as you can. </strong> This
					study should take about 10 minutes to complete. At the end, you will
					receive your IAT result along with information about what it means.
				</p>
				<p>In this test, you will see words appear on the screen.</p>
				<p>First, there will be a practice round.</p>
				<p>Then, you will sort combined categories.</p>

        <button onClick={() => setShowIntro(false)}>Start Test</button>
      </div>
    );
  }

  return (
    <div className="IAT-container">
      <h1>Gender - Science IAT</h1>

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

            <div className="categories-stimulus-row">
              <div className="category-left">
                <h2>
                  {Object.entries(levels[level].keys)
                    .filter(([, key]) => key === "e")
                    .map(([cat]) => cat)
                    .join(" / ")}
                </h2>
              </div>

              <div className="stimulus">
                <h3 style={{ fontSize: "3rem", marginTop: "2rem" }}>{stimulus?.word}</h3>
              </div>

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
          <h3>HOW SEXIST ARE YOU</h3>
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
