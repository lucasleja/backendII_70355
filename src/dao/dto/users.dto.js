export default class UsersDto {
    constructor(user) {
        this.first_name = user.nombre;
        this.last_name = user.apellido
    }
}