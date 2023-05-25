import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Hobby } from "../entity/Hobby";
import { Event } from "../entity/Event";
import { UserHobby, UserHobbyStatus } from "../entity/UserHobby";
import { User } from "../entity/User";
import { MicrosoftGraphAPI } from "../boundary/MicrosoftGraphAPI";
import { IntegerType } from "typeorm";
import { log } from "console";


export class EventController {
    private userRepository = AppDataSource.getRepository(User);
    private hobbyRepository = AppDataSource.getRepository(Hobby);
    private userHobbyRepository = AppDataSource.getRepository(UserHobby);
    private eventRepository = AppDataSource.getRepository(Event);
    private microsoftGraphAPI = new MicrosoftGraphAPI();

    async createEventsForHobby(
        request: Request,
        response: Response,
        next: NextFunction
      ) {
        //const userId = request.user?.id;
        const userId = 3;
    
        // const user =
        // userId && (await this.userRepository.findOneBy({ id: userId }));
        // if (!user) {
        //   response.status(404).json({ error: "User not found" });
        //   return;
        // }

        let token = await this.checkToken(userId)

        if (!token) {
            token = await this.microsoftGraphAPI.GetToken(); 
            await this.saveToken(token, userId)
        }

        const userEvents = await this.microsoftGraphAPI.getUserEvents(token);

        const hobby = await this.hobbyRepository
            .createQueryBuilder("hobby")
            .leftJoin(UserHobby, "uh", "hobby.id = uh.hobbyId")
            .leftJoin(User, "user", "uh.userId = user.id")
            .where("user.id = :userId", {userId})
            .andWhere("uh.status = 'Active'")
            .getRawOne()
        
        //console.log(hobby);

        const hobbyAttempts = hobby['hobby_attempts'];
        const hobbyAttemptDuration = hobby['hobby_attemptDuration'];

        for (let index = 0; index < hobbyAttempts; index++) {

            
            let date = (new Date((new Date()).setDate((new Date()).getDate() + index + 1)));
            //let day = date.getDate();

            //console.log(date.toDateString());

            let response;
            while(!response) {
                const events = await this.eventRepository
                    .createQueryBuilder("event")
                    .where("event.creatorId = :userId", {userId})
                    .andWhere("datediff(event.start, :date) = 0", {date})
                    .getRawMany()
                //console.log(events)
                //response = "ok";

                let freeTimeForEvent = null;
                while(freeTimeForEvent == null) {
                    if  (events.length > 0) {
                        date = new Date(date.setDate(date.getDate() + 1))
                    } else {
                        const freeTimes = await this.findFreeTimes(userEvents, date);
                        freeTimeForEvent = await this.checkFreeTimes(freeTimes, hobbyAttemptDuration, date);
                        if (freeTimeForEvent == null) {
                            date = new Date(date.setDate(date.getDate() + 1))
                        }
                    }
                }

                console.log(freeTimeForEvent);

                const createRequest = await this.formEventRequest(freeTimeForEvent, hobby)
                response = await this.microsoftGraphAPI.sendCreateEventRequest(createRequest, token);
            }

            const event = new Event();
            event.id = response.id;
            event.creator = await this.userRepository.findOne({
                where: {
                    id: userId
                },
            });
            event.start = new Date((new Date(response.start.dateTime)).getTime() + 3*60*60*1000)
            event.end = new Date((new Date(response.end.dateTime)).getTime() + 3*60*60*1000)
            event.name = response.subject;


            await this.eventRepository
                .createQueryBuilder()
                .insert()
                .into(Event)
                .values(event)
                .execute()
            
        }

    
        const message = "Success"
        return message;
      }

      async checkToken(
        userId: number
      ) {
        const token = null;
        var fs = require('fs');
        const path = `tokens${userId}.json`;
        try {
            if (fs.existsSync(path)) {
                try {
                    const data = fs.readFileSync(path, 'utf8');
                    return token;
                  } catch (err) {
                    console.error(err);
                    return null;
                  }
            }
            return null;
          } catch(err) {
            console.error(err)
            return null;
          }
      }

      async saveToken(
        token: any,
        userId: number
      ) {
        var fs = require('fs');
        fs.writeFile(`tokens${userId}.json`, token, function(err) {
            if (err) {
                console.log(err);
            }
        });
      }

      async findFreeTimes(
        userEvents: any,
        date: Date
      ) {
        const startTime = new Date(date.setUTCHours(12, 0, 0, 0));
        const endTime = new Date(date.setUTCHours(15, 0, 0, 0));
        var filtered = [];
        const data = JSON.parse(userEvents);
        const events = data.value;
        events.forEach(element => {
            const eventStartTime = new Date(element.start.dateTime)
            const eventEndTime = new Date(element.end.dateTime)
            // console.log(eventStartTime);
            // console.log(eventEndTime);
            // console.log(startTime);
            // console.log(endTime);
            if (eventEndTime >= endTime && eventStartTime <= startTime) {
                const takenTime = {
                    start: startTime,
                    end: endTime
                }
                filtered.push(takenTime);
            } else if (eventEndTime <= endTime && eventStartTime <= startTime && eventEndTime >= startTime) {
                const takenTime = {
                    start: startTime,
                    end: eventEndTime
                }
                filtered.push(takenTime);
            } else if (eventStartTime >= startTime && eventEndTime <= endTime) {
                const takenTime = {
                    start: eventStartTime,
                    end: eventEndTime
                }
                filtered.push(takenTime);
            } else if (eventStartTime >= startTime && eventStartTime < endTime && eventEndTime >= endTime) {
                const takenTime = {
                    start: eventStartTime,
                    end: endTime
                }
                filtered.push(takenTime);
            }
        });
        return filtered;
      }

      async checkFreeTimes(
        takenTimes: any,
        hobbyDuration: number,
        date: Date
      ) {
        const startTime = new Date(date.setUTCHours(12, 0, 0, 0));
        const endTime = new Date(date.setUTCHours(15, 0, 0, 0));
        const requiredTime = (hobbyDuration+30)*60*1000
        var freeTime;
        // console.log(takenTimes);
        // console.log(startTime);
        // console.log(endTime);
        if (takenTimes.length == 0) {
            freeTime = {
                start: new Date(date.setUTCHours(15, 0, 0, 0)),
                end: new Date((new Date(date.setUTCHours(15, 0, 0, 0)).getTime()+requiredTime))
            }
            return freeTime;
        } else {
            if (takenTimes[0].start == startTime && takenTimes[0].end == endTime) {
                return null;
            } else if (takenTimes[0].start > startTime && takenTimes[0].end == endTime) {
                if (takenTimes[0].start.getTime() - startTime.getTime() >= requiredTime) {
                    freeTime = {
                        start: new Date(date.setUTCHours(15, 0, 0, 0)),
                        end: new Date((new Date(date.setUTCHours(15, 0, 0, 0)).getTime()+requiredTime))
                    }
                } else {
                    return null;
                }
            } else if (takenTimes[0].start >= startTime && takenTimes[0].end < endTime) {
                if (takenTimes[0].start.getTime() - startTime.getTime() >= requiredTime) {
                    freeTime = {
                        start: new Date(date.setUTCHours(15, 0, 0, 0)),
                        end: new Date((new Date(date.setUTCHours(15, 0, 0, 0)).getTime()+requiredTime))
                    }
                } else if (endTime.getTime() - takenTimes[0].end.getTime()  >= requiredTime) {
                    freeTime = {
                        start: new Date(new Date(takenTimes[0].end.getTime()+3*60*60*1000)),
                        end: new Date((new Date(takenTimes[0].end.getTime()+3*60*60*1000+requiredTime)))
                    }
                } else {
                    return null;
                }
            }
        }
    
        return freeTime;
      }

      async formEventRequest(
        freeTimeForEvent: any,
        hobby: Hobby
      ) {
        const request = {
            subject: hobby['hobby_name'],
            start: {
                dateTime: freeTimeForEvent.start,
                timeZone: 'UTC'
            },
            end: {
                dateTime: freeTimeForEvent.end,
                timeZone: 'UTC'
            }
        }
    
        return request;
      }

}