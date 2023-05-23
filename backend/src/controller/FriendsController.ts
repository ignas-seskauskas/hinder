import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserType } from "../entity/User";
import {UserFriend } from "../entity/UserFriend";
import { Brackets, Not } from "typeorm";
import { Hobby } from "../entity/Hobby";
import { HobbyCategory } from "../entity/HobbyCategory";
import { UserHobby } from "../entity/UserHobby";


export class FriendsController {
    private userFriendRepository = AppDataSource.getRepository(UserFriend);
    private userRepository = AppDataSource.getRepository(User);
    private hobbyRepository = AppDataSource.getRepository(Hobby);
    private userHobbyRepository = AppDataSource.getRepository(UserHobby);
    private hobbyCategoryRepository = AppDataSource.getRepository(HobbyCategory);

    async all(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.id;
            const queryBuilder = this.userFriendRepository.createQueryBuilder("userFriend")
                .select("LEAST(userFriend.searcherId, userFriend.friendId)", "searcher_id")
                .addSelect("GREATEST(userFriend.searcherId, userFriend.friendId)", "friend_id")
                .innerJoin('userFriend.searcher', 'searcher')
                .innerJoin('userFriend.friend', 'friend')
                .where("requestAccepted = true")
                .groupBy("searcher_id, friend_id")
                .having("searcher_id = :userId", { userId })
                .orderBy("searcher_id")
                .addOrderBy("friend_id");
            const friends = await queryBuilder.getRawMany();
            const result = await Promise.all(
                friends.map(async (friend) => {
                    const newFriend = await this.userRepository.findOne({
                        where: {id: friend.friend_id}
                    })
                    return{
                        newFriend
                    };
                })
            );
            //console.log(result);
            res.status(200).json({ result });
        } catch (error) {
            console.error('Error fetching friends:', error);
            res.status(500).json({ error: 'Failed to fetch friends' });
            next(error);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try{

            const UserId = req.user.id;
            const id = parseInt(req.params.id);
        
            let friendToRemove1 = await this.userFriendRepository.findOne({
                where: {searcher: {id: id}, friend: {id: UserId}}
            });
            let friendToRemove2 = await this.userFriendRepository.findOne({
                where: {friend: {id: id}, searcher: {id: UserId}}
            });
        
            if (!friendToRemove1 && !friendToRemove2) {
                return false;
            }
            if(friendToRemove1){
                await this.deleteOfFriend(id, UserId);
                await this.userFriendRepository.remove(friendToRemove1);
            }
            if(friendToRemove2){
                await this.deleteOfFriend(UserId, id);
                await this.userFriendRepository.remove(friendToRemove2);
            }
        
            
        
            return true;
        }
        catch (error){
            console.error('Error removing friend:', error);
            res.status(500).json({ error: 'Failed to delete friend' });
            next(error);
        }
    }

    private async deleteOfFriend(id1: number, id2: number) {
        await this.userFriendRepository
          .createQueryBuilder()
          .delete()
          .where("searcher = :firstId", { firstId: id1 })
          .andWhere("friend = :secondId", { secondId: id2})
          .execute();
    }
    
    async recommended(req: Request, res: Response, next: NextFunction){
        try {
            const userId = req.user.id;
            const recommendedUsers = await this.getBestPerson(userId);
            //console.log(recommendedUsers);
            res.status(200).json({ recommendedUsers });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to generate recommendations" });
          }
    }

    async getBestPerson(userId: number):Promise <Partial<User>>{
        const recommendedUsers = await this.generateMatchingUsers(userId);
        const onlyUsers = recommendedUsers.map((item) => item.user);
        
        console.log(onlyUsers[0]);
        return onlyUsers[0];
    }
    
    async generateMatchingUsers(userId: number): Promise<{ user: Partial<User>; score: number }[]> {
        const categoryWeight = 1;
        const hobbyWeight = 1.5;
        
        const currentUser = await this.getUser(userId);
        const currentUserHobbies = await this.getUserHobbies(userId);
        const currentUserCategoryRatings = await this.getUserHobbyCategoryAverageRating(userId);

        const allUsers = await this.userRepository.find({
            where: {id: Not(userId)},
            select: ["id", "nickname", "name", "surname"],
        });
        //console.log((await this.userHobbyRepository.find({where: {user : {id : userId}},relations:["hobby", "hobby.category"]})));
        console.log(currentUserCategoryRatings);
        const matchingUsersWithScore = await Promise.all(
            allUsers.map(async (user) => {
                let score = 0;
                const userHobbies = await this.getUserHobbies(user.id);
                const userCategoryRatings = await this.getUserHobbyCategoryAverageRating(user.id);
                currentUserCategoryRatings.forEach((currentUserCategory) => {
                    const matchingUserCategory = userCategoryRatings.find(
                      (category) => category.id === currentUserCategory.id
                    );
                    if (matchingUserCategory) {
                      const ratingDifference = Math.abs(
                        matchingUserCategory.averageRating - currentUserCategory.averageRating
                      );
                      score += (5 - ratingDifference) * categoryWeight;
                    }
                  });

                  
                  currentUserHobbies.forEach((currentUserHobby) => {
                    const matchingUserHobby = userHobbies.find(
                      (userHobby) => userHobby.hobby.id === currentUserHobby.hobby.id && userHobby.status != 'Rejected' && currentUserHobby.status != 'Rejected'
                    );
                    //console.log(currentUserHobby);
                    if (matchingUserHobby) {
                      const ratingDifference = Math.abs(matchingUserHobby.rating - currentUserHobby.rating);
                      score += (5 - ratingDifference) * hobbyWeight;
                    }
                  });
                console.log(user);
                console.log(score);

                return {
                    user,
                    score,
                };
            })
        );

        const finalResult = matchingUsersWithScore.sort((a, b) => b.score - a.score);


        return finalResult;
      }

      private async getUser(userId: number): Promise<User>{
        const result = await this.userRepository.findOne({
            where: { id: userId},
        });
        return result;
      }

      private async getUserHobbies(userId: number): Promise<UserHobby[]>{
        const result = await this.userHobbyRepository.find({
            where: {user : {id : userId}},
            relations:["hobby", "hobby.category"]
        });
        return result;
      }

      

      private async getUserHobbyCategoryAverageRating(userId: number): Promise<any[]> {
        const hobbyCategories = await this.userHobbyRepository
          .createQueryBuilder("userHobby")
          .select("category")
          .addSelect("AVG(userHobby.rating)", "averageRating")
          .innerJoin("userHobby.user", "user")
          .innerJoin("userHobby.hobby", "hobby")
          .innerJoin("hobby.category", "category")
          .where("userHobby.user = :userId", { userId })
          .andWhere("userHobby.status != 'Rejected'")
          .groupBy("category.id")
          .getRawMany();
      
        return hobbyCategories;
      }
}