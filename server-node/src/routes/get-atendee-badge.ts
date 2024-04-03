import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAtendeeBadge(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/atendees/:atendeeId/badge', {
        schema: {
            params: z.object({
                atendeeId: z.coerce.number().int(),
            }),
            response: {},
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

        return reply.send({ atendee })
    })
}
