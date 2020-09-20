import API from '../api';

class BadgeService {
  // Fetch warnings
  static createUserBadge = (badgeId, callback = null) => {
    const data = { badge_id: badgeId };
    const response = API.createUserBadge(data).response();
    return response.then((data) => {
      !callback || callback(response.isError === true, data);
      return data;
    });
  };
}

export default BadgeService;
