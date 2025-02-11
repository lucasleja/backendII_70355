import { userDao } from "../dao/mongo/user.dao.js";
import passport from "passport";
import { createToken } from "../utils/jwt.js";

class UserService {
  async register(user) {
    try {
      await userDao.save(user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await userDao.getByEmail(email);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      const isValid = await userDao.isValidPassword(email, password);
      if (!isValid) {
        throw new Error("Contraseña inválida");
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProfile(id) {
    try {
      const user = await userDao.getById(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async logout() {
    try {
      // No es necesario hacer nada aquí, ya que la sesión se destruye en el controlador
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async restorePassword(email, password) {
    try {
      const user = await userDao.getByEmail(email);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      await userDao.update(user._id, { password: password});
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const usersService = new UserService();