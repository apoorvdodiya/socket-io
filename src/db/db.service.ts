export default class DBService {
    private static users = new Map();
    private static messages = Array();
    private static sessions = new Map();

    public static getSession = (sid: any) => {
        console.log('setSession ', DBService.users, DBService.sessions);
        return DBService.sessions.get(sid);
    }
    public static setSession = (sid: any, uid: any, userName: any) => {
        console.log('userName ', userName);
        DBService.users.set(uid, userName || 'Anonymous');
        DBService.sessions.set(sid, uid);
        console.log('setSession ', DBService.users, DBService.sessions);
        return;
    }
    public static getUser = (uid: any) => {
        return DBService.users.get(uid);
    }
    public static addMessage(message: any) {
        DBService.messages.push(message);
    }
    public static getAllMessages() {
        return DBService.messages;
    }
}

