import { RoleInfo } from "../constants/roleInfo.js";
import role from "../models/Roles.schema.js";

const roles=[
    {
        name:RoleInfo.admin
    },
    {
        name:RoleInfo.user
    }
]

class RolesSeeder{
    async seed(){
        const currentRoles= await role.find({});
        for (const item of roles) {
            const found= currentRoles.find(x=>x.name==item.name);
            if(found) continue;
            await role.create(item);
        }
    }
}

const instance= new RolesSeeder();
export default instance;