import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
        schema:{
            summary: 'Get an event',
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    event: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        slug: z.string(),
                        details: z.string().nullable(),
                        maximumAtendees: z.number().int().nullable(),
                        atendeesAmount: z.number().int(),
                    })
                })
            },
        }
    }, async (request, reply) => {
        const { eventId } = request.params

        const event = await prisma.event.findUnique({
            //usa o select para restringir o que vai ser mostrado pelo get
            select: {
                id: true,
                title: true,
                slug: true,
                details: true,
                maximumAtendees: true,
                //como temos a relação, podemos usar o _count pra selecionar os atendees com join em eventos
                _count: {
                    select: {
                        atendees: true
                    }
                }
            },
            where: {
                id: eventId,
            }
        })

        if (event === null){
            throw new BadRequest('Event not found.')
        }

        return reply.send({
            //cria novamente o objeto para melhorar exibição como objeto (_count.atendees ficava bem ruim no normal)
            event: {
                id: event.id,
                title: event.title,
                slug: event.slug,
                details: event.details,
                maximumAtendees: event.maximumAtendees,
                atendeesAmount: event._count.atendees,
            }
        })
    })
    
}