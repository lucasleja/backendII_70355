
export const authorization = (roles) => {
  return async (req, res, next) => {
      if(!req.user) return res.status(401).json({ error: "No autorizado"});
      if(req.user.roles !== roles) res.status(403).json({ error: "Rol inválido"});
      next();
  }
}


/* export const authorization = (roles) => {

  return async (req, res, next) => {
  
  if (!req.user) { return res.status(401).json({ error: "No autorizado" }) };
  
  if (req.user.roles !== roles) { return res.status(403).json({ error: "Rol inválido" }) };
  
  next();
  }
  } */