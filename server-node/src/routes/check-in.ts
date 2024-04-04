import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function checkIn(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/atendees/:atendeeId/check-in', {
        schema:{
            summary: 'Check in on a event',
            tags: ['checkin'],
            params: z.object({
                atendeeId: z.coerce.number().int(),
            }),
            response: {
                201: z.null(),
            }
        }
    }, async (request, reply) =>{
        const { atendeeId } = request.params

        const atendeeCheckIn = await prisma.checkIn.findUnique({
            where:{
                atendeeId,
            }
        })

        if (atendeeCheckIn !== null){
            throw new BadRequest('Atendee already checked in!')
        }

        await prisma.checkIn.create({
            data: {
                atendeeId,
            }
        })

        return reply.status(201).send()
    })
}