import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAtendees(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/atendees', {
        schema:{
            summary: 'Get atendees of a event',
            tags: ['atendees'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            //querystring trata o que for passado na url como query
            querystring: z.object({
                //nulish pois pode ser undefined e null
                query: z.string().nullish(),
                pageIndex: z.string().nullish().default('0').transform(Number),
            }),
            response: {
                200: z.object({
                    atendees: z.array(
                        z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string().email(),
                            createdAt: z.date(),
                            checkedInAt: z.date().nullable(),
                        })
                    )
                })
            },
        }
    }, async (request, reply) => {
        const { eventId } = request.params
        const { pageIndex,query } = request.query

        //findmany para pegar todos os atendees
        const atendees = await prisma.atendee.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                //innner join permite pela relação, pegar dados com select na tabela checkin.
                checkIn: {
                    select: {
                        createdAt: true,
                    }
                }
            },
            //condicional para usar a query string para busca, se deixar em uma linha, é um if ternário...
            where: query ? {
                eventId,
                name: {
                    contains: query,
                }
            }:{
                eventId,                
            },
            //paginação, pega 10 e skipa os 10 primeiros vezes a página em que se encontra.
            take: 10,
            skip: pageIndex * 10,
            orderBy:{
                createdAt: 'desc',
            }
        })
        
        return reply.send({ 
            atendees: atendees.map(atendee => {
                return {
                    id: atendee.id,
                    name: atendee.name,
                    email: atendee.email,
                    createdAt: atendee.createdAt,
                    //sintaxe reduzida pra acessar o createdAt só se existir Checkin e o ?? caso não exista, garante que retorna null
                    checkedInAt: atendee.checkIn?.createdAt ?? null
                }
            })
         })
    })
    
}