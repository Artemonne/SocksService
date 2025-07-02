const {User} = require('../../db/models');

class UserService{
    static async getAll(){
        return await User.findAll();
    }

    static async getUser(id){
        return await User.getByPK(id);
    }

    static async createUser(data){
        return await User.create(data)
    } 

    static async updateUser(id, data){
        const user = await this.getUser(id);
        if(user){
            user.name = data.name;
            user.email = data.email;
            user.password = data.password;
            await user.save();
        }
        return user;
    }

    static async deleteUser(id){
        const user = await this.getUser(id);
        if(user){
            await user.destroy();
        }
        return user;
    }
}

module.exports = UserService;