const crypto = require('crypto');

const REFERRAL_REWARD_POINTS = 50; // points to referrer on signup
const FIRST_BOOKING_DISCOUNT_PERCENT = 10; // percent discount for referred user's first booking

function generateCandidateCode(seed) {
  // 8-char uppercase base36 code
  const base = (seed || crypto.randomBytes(6).toString('hex')).toUpperCase();
  const hash = crypto.createHash('sha256').update(base).digest('base64').replace(/[^A-Z0-9]/g, '');
  return hash.slice(0, 8);
}

async function generateUniqueReferralCode(UserModel, seed) {
  let attempts = 0;
  while (attempts < 10) {
    const code = generateCandidateCode(seed + ':' + attempts);
    const exists = await UserModel.findOne({ referralCode: code }).lean();
    if (!exists) return code;
    attempts++;
  }
  // Fallback to random if collisions continue
  while (true) {
    const code = generateCandidateCode();
    const exists = await UserModel.findOne({ referralCode: code }).lean();
    if (!exists) return code;
  }
}

async function awardReferrer(referrer) {
  referrer.referralCount = (referrer.referralCount || 0) + 1;
  referrer.rewardPoints = (referrer.rewardPoints || 0) + REFERRAL_REWARD_POINTS;
  await referrer.save();
}

module.exports = {
  REFERRAL_REWARD_POINTS,
  FIRST_BOOKING_DISCOUNT_PERCENT,
  generateUniqueReferralCode,
  awardReferrer,
};
