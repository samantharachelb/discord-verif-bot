const jsonQuery = require('json-query');
import Config from '@src/core/Config';

export abstract class Permissions {
    static checkAdmin(message: any) {
        // extract roles
        const userRoles = jsonQuery('id', { data: message.member?.roles?.cache.array()}).value;

        // check for intersecting values
        // array1 = [1, 2, 3, 4, 5, 6]
        // array2 = [2, 3, 5]
        // result => [2, 3, 5
        const validate = userRoles.filter((x: any) => Config.botAdminRoles.includes(x));

        return validate.length !== 0;
    }
}
