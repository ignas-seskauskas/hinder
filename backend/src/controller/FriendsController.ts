import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserType } from "../entity/User";
import {UserFriend } from "../entity/UserFriend";
import { Brackets } from "typeorm";


export class FriendsController {
    private userFriendRepository = AppDataSource.getRepository(UserFriend);
    private userRepository = AppDataSource.getRepository(User);

    async all(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;
            const friends = await this.userFriendRepository
                .createQueryBuilder('userFriend')
                .select()
                .innerJoin('userFriend.searcher', 'searcher')
                .innerJoin('userFriend.friend', 'friend')
                .addSelect(['searcher.id', 'searcher.nickname', 'searcher.name', 'searcher.surname', 'friend.id', 'friend.nickname', 'friend.name', 'friend.surname'])
                .where("requestAccepted = true")
                .andWhere(new Brackets(qb => {
                    qb.where("searcher.id = :userId", { userId })
                        .orWhere("friend.id = :userId", { userId });
                }))
                .getMany();
            res.status(200).json({ friends });
        } catch (error) {
            console.error('Error fetching friends:', error);
            res.status(500).json({ error: 'Failed to fetch friends' });
            next(error);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try{

        
            const id = parseInt(req.params.id);
        
            let friendToRemove = await this.userFriendRepository.findOneBy({ id });
        
            if (!friendToRemove) {
                return false;
            }
        
            await this.deleteOfFriend(id);
        
            await this.userFriendRepository.remove(friendToRemove);
        
            return true;
        }
        catch (error){
            console.error('Error removing friend:', error);
            res.status(500).json({ error: 'Failed to delete friend' });
            next(error);
        }
    }

    private async deleteOfFriend(id: number) {
        await this.userFriendRepository
          .createQueryBuilder()
          .delete()
          .where("id = :friendshipId", { friendshipId: id })
          .execute();
      }


}