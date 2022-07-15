import { SwiperCard } from "../screens/HomeScreen";

const getMatchedUserInfo = (
  users: { [key: string]: SwiperCard },
  userLoggedInId: string
) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedInId];

  const [id, user] = Object.entries(newUsers).flat() as [string, SwiperCard];

  return { ...user, id };
};

export default getMatchedUserInfo;
