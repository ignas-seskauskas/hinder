import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Hobby } from "../entity/Hobby"

export class HobbyController {

    private hobbyRepository = AppDataSource.getRepository(Hobby)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.hobbyRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const hobby = await this.hobbyRepository.findOne({
            where: { id }
        })

        if (!hobby) {
            return "hobby not found"
        }
        return hobby
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { id, name, type, place, attempts, attemptDuration } = request.body;

        const hobby = Object.assign(new Hobby(), {
            id,
            name,
            type,
            place,
            attempts,
            attemptDuration
        })

        return this.hobbyRepository.save(hobby)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let hobbyToRemove = await this.hobbyRepository.findOneBy({ id })

        if (!hobbyToRemove) {
            return "this hobby does not exist"
        }

        await this.hobbyRepository.remove(hobbyToRemove)

        return "hobby has been removed"
    }

}
