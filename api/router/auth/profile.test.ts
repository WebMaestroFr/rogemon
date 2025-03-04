import expectExpressHandler from "@api/testUtilities/expectExpressHandler";

import handleProfile from "./profile";
import mockUser from "@api/testUtilities/mockUser";

expectExpressHandler(handleProfile, (req) => {
  req.user = mockUser();
});
