export function computeScenarioOutcome({ budget, vendor, manpower, timeline }) {
  const simulatedRisk = Math.max(
    22,
    92 - budget * 0.72 - vendor * 0.21 - manpower * 0.16 + timeline * 0.96
  );
  const delayProbability = Math.max(
    16,
    86 - budget * 0.58 - manpower * 0.17 - vendor * 0.14 + timeline * 0.88
  );
  const costOverrunCr = Math.max(0.2, 4.4 - budget * 0.06 - vendor * 0.018);

  return {
    simulatedRisk: Number(simulatedRisk.toFixed(0)),
    delayProbability: Number(delayProbability.toFixed(0)),
    costOverrunCr: Number(costOverrunCr.toFixed(1)),
  };
}
