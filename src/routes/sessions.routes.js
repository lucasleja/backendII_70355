import { Router } from "express";
import { userDao } from "../services/user.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import passport from "passport";
import { createToken, verifyToken } from "../utils/jwt.js";
/* import { verify } from "jsonwebtoken"; */

const router = Router();

router.post("/register", passport.authenticate("register"), async (req, res) => {
  try {
      /* const userData = req.body;
      const findUser = await userDao.getByEmail(userData.email);
      if(findUser) return res.status(400).json({ status: "error", msg: "El usuario con el email ya existe"});
      
      /// PRUEBA
      const newUser = {
        ...userData,
        password: createHash(userData.password)
      } */

      /* const user = await userDao.create(userData); */
      /* const user = await userDao.create(newUser); */

      res.status(201).json({ status: "success", payload: "Usuario Registrado"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
  
})

router.post("/login", passport.authenticate("login"), async (req, res) => {
  try {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      /// Quitar comentar a role para autorizar a usuario no logueado
      /* role: "user" */
    }
    /* const { email, password } = req.body;
    const user = await userDao.getByEmail(email);
    const checkPass = isValidPassword(password, user); */
    /* console.log(checkPass); */

    /* if(!user || user.password !== password) return res.status(401).json({status: "error", msg: "Email o password no válido"}); */
    /* if(!user || !checkPass) return res.status(401).json({status: "error", msg: "Email o password no válido"}); */

    // Guardamos la información del usuario en la session
    /* req.session.user = {
      email,
      role: "user"
    } */

      const token = createToken(req.user)
      res.cookie("token", token, { httpOnly: true}); //guardamos del lado del cliente el token
      res.status(200).json({status: "success", payload: req.session.user, token})



    /* res.status(200).json({status: "success", payload: req.session.user}) */
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
})


router.get("/profile", async (req, res) => {

  try {

    if(!req.session.user) return res.status(404).json({ status: "error", msg: "Usuario no logueado"});

    if(req.session.user.role !== "user") return res.status(403).json({ status: "error", msg: "Usuario no autorizado"});

    res.status(200).json({status: "success", payload: req.session.user})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
  
})

router.get("/logout", async (req, res) => {

  try {

    req.session.destroy();

    res.status(200).json({status: "success", payload: "Session cerrada"})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
  
})


router.put("/restore-password", async (req, res) => {

  try {

    const {email, password} = req.body;
    const user = await userDao.getByEmail(email);

    await userDao.update(user._id, { password: createHash(password)})

    res.status(200).json({status: "success", payload: "Password actualizado"})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
  
})

router.get("/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
  session: false
}), async (req, res) => {

  return res.status(200).json({status: "success", session: req.user})
  
})

router.get("/current", passport.authenticate("jwt"), async (req, res) => {

  //const token = req.headers.authorization.split(" ")[1];
  
  //const token = req.cookies.token;
  //const validToken = verifyToken(token);
  //if (!validToken) return res.send("Not token");
  //const user = await userDao.getByEmail(validToken.email);

  res.json({ status: "ok", user: req.user });
});




export default router;