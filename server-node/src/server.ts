import fastify from "fastify";
import {z} from 'zod';
import {PrismaClient} from '@prisma/client';

const app = fastify()

const prisma = new PrismaClient({
    log: ['query'],
})


//ao acessar rota / retorna o código
app.get('/', () =>{
    return 'Hello NLW Unite!'
})


//post - criação de itens, nesse caso, eventos.
app.post('/events', async (request, reply) => {
    //cria um modelo "schema" para o json a ser enviado para o banco
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAtendees: z.number().int().positive().nullable(),
    })

    //verifica se o que foi enviado é igual ao modelo do schema
    const data = createEventSchema.parse(request.body)

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAtendees: data.maximumAtendees,
            slug: new Date().toISOString(),
        },
    })

    //ao invés de enviar somente o objeto e receber code 200, ajusta para receber um codigo mais semantico
    return reply.status(201).send({ eventId: event.id })
})

//roda o app na porta 3333
app.listen({port: 3333}).then(() => {
    console.log("HTTP server running!!")
})