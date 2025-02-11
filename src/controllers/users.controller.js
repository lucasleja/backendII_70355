import { userDao } from "../dao/mongo/user.dao.js";
import { createHash } from "../utils/hashPassword.js";
import { createToken } from "../utils/jwt.js";

class UserController {
  async register(req, res) {
    try {
      res.status(201).json({ status: "success", payload: "Usuario Registrado"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
  }

  async login(req, res) {
    try {
      const token = createToken(req.user)
      res.cookie("token", token, { httpOnly: true}); 
      res.status(200).json({status: "success", payload: req.user, token})
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
  }

  async getProfile(req, res) {
    try {
      if(!req.session.user) return res.status(404).json({ status: "error", msg: "Usuario no logueado"});
      if(req.session.user.role !== "user") return res.status(403).json({ status: "error", msg: "Usuario no autorizado"});
      res.status(200).json({status: "success", payload: req.session.user})
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
  }

  async logout(req, res) {
    try {
      req.session.destroy();
      res.status(200).json({status: "success", payload: "Session cerrada"})
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
  }

  async restorePassword(req, res) {
    try {
      const {email, password} = req.body;
      const user = await userDao.getByEmail(email);
      await userDao.update(user._id, { password: createHash(password)})
      res.status(200).json({status: "success", payload: "Password actualizado"})
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
    }
  }
}

export const usersController = new UserController();