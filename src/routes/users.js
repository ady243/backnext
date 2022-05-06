import User from "../db/Models/User.js";
import hashPassword from "../hashPassword.js";
import jsonwebtoken from "jsonwebtoken";
import config from "../config.js";

const userRoute = ({ app }) => {
  app.post("/account", async (req, res) => {
    const {
      body: { name, email, sexe, password },
    } = req;
    const user = await User.query().findOne({ email });

    if (user) {
      res.status(401).send({ error: "Email user already exists" });

      return;
    }

    const [passwordHash, passwordSalt] = hashPassword(password);
    const users = await User.query().insertAndFetch({
      name,
      email,
      sexe,
      passwordHash,
      passwordSalt,
    });

    res.send(users);
  });

  app.post("/sign", async (req, res) => {
    const {
      body: { email, password },
    } = req;
    const usager = await User.query().findOne({ email });
    if (!usager) {
      res.status(401).send({ error: "Invalid e-mail or password" });
      return;
    }

    const [passwordHash] = hashPassword(password, usager.passwordSalt);
    if (passwordHash !== usager.passwordHash) {
      res.status(401).send({ error: "Invalid e-mail or password" });
      return;
    }
    const jwt = jsonwebtoken.sign(
      { payload: { usagerId: usager.id } },
      config.security.session.secret,
      { expiresIn: config.security.session.expiresIn }
    );
    res.send(jwt);
  });
};

export default userRoute;
