import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { generateSlug } from "../utils/generate-slug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .post('/events', {
        schema:{
            //cria um modelo "schema" para o json 'body' a ser enviado para o banco
            body: z.object({
                title: z.string().min(4),
                details: z.string().nullable(),
                maximumAtendees: z.number().int().positive().nullable(),
            }),
            response: {
                //restringe o tipo de response ao cadastrar evento.
                201: z.object({
                    eventId: z.string().uuid(),
                })
            },
        },
    }, async (request, reply) => {
        //verifica se o que foi enviado é igual ao modelo do schema
        const {
            title,
            details,
            maximumAtendees,
        } = (request.body)
    
        //salva o slug depois de passar na função generateSlug criada.
        const slug = generateSlug(title)
    
        const eventWithSameSlug = await prisma.event.findUnique({
            where: {
                //slug: slug (posso usar short sintax pois é o mesmo nome.)
                slug,
            }
        })
    
        if(eventWithSameSlug !== null){
            throw new Error('Another event with same title already exists.')
        }
    
        const event = await prisma.event.create({
            data: {
                title,
                details,
                maximumAtendees,
                slug,
            },
        })
    
        //ao invés de enviar somente o objeto e receber code 200, ajusta para receber um codigo mais semantico
        return reply.status(201).send({ eventId: event.id })
    })
}