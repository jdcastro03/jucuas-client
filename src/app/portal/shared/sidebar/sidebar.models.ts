export class User {
    username: String = '';
    first_name: String = '';
    last_name: String = '';
    origin_university: String = '';
    origin_organizational_unit: String = '';
    email: String = '';
    groups: Groups[] = [ { name: '' } ];
}

class Groups {
    name: String = '';
}