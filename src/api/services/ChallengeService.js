import API from '../api';

class ChallengeService {
  // Fetch warnings
  static createUserChallenge = (challengeId, callback = null) => {
    const data = { challenge_id: challengeId };
    const response = API.createUserChallenge(data).response();
    return response.then((data) => {
      !callback || callback(response.isError === true, data);
      return data;
    });
  };
}

export default ChallengeService;
