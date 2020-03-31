import API from '../api';

class ChallengeService {

    // Fetch warnings
    static createUserChallenge = (challenge_id, callback = null) => {
        const data = {challenge_id: challenge_id};
        const response = API.createUserChallenge(data).response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }
}

export default ChallengeService;