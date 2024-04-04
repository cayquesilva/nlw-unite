import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAtendeeBadge(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/atendees/:atendeeId/badge', {
        schema: {
            summary: 'Get an atendee badge',
            tags: ['atendees'],
            params: z.object({
                atendeeId: z.coerce.number().int(),
            }),
            response: {
                200: z.object({
                    badge: z.object({
                        name: z.string(),
                        email: z.string().email(),
                        eventTitle: z.string(),
                        checkInURL: z.string().url(),
                    })
                })
            },
        }
    }, async (request, reply) => {
        const { atendeeId } = request.params

        const atendee = await prisma.atendee.findUnique({
            select: {
                name: true,
                email: true,
                //posso puxar evento no atendee por conta do relacionamento... mt foda!
                event: {
                    select: {
                        title: true,
                    }

                }
            },
            where: {
                id: atendeeId,
            }
        })

        if(atendee === null){
            throw new Error("Atendee not found.")
        }


        const baseURL = `${request.protocol}://${request.hostname}`

        const checkInURL = new URL(`/atendees/${atendeeId}/check-in`,baseURL)


        return reply.send({ 
            badge: {
                name: atendee.name,
                email: atendee.email,
                eventTitle: atendee.event.title,
                checkInURL: checkInURL.toString(),
            }
         })
    })
}
