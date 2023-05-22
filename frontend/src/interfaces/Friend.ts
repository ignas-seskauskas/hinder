import { User } from "./User";
export default interface UserFriend {
    id: number;
    friendshipStartDate: Date;
    requestSent: boolean;
    requestAccepted: boolean;
    searcher: User;
    friend: User;
}