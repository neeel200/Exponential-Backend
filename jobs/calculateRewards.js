const calculateRewards = () => {
  const random = Math.random();
  if (random < 0.25) return { reward: 'Generic Prize', points: 0 };
  if (random < 0.75) return { reward: null, points: 10 };
  return { reward: null, points: 0 };
};

module.exports = calculateRewards;
