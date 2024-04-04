import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";

import { serializerCompiler, validatorCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'

import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAtendeeBadge } from "./routes/get-atendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAtendees } from "./routes/get-event-atendees";
import { errorHandler } from "./error-handler";

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    //qualquer url pode acessar minha API se tiver * em produção, colocamos o dominio do front-end
    origin: '*',
})

app.register(fastifySwagger,{
    swagger: {
        consumes: ['applicatication/json'],
        produces: ['applicatication/json'],
        info: {
            title: 'pass.in',
            description: 'Especificações da API para o back-end da aplicação pass.in construida durante o NLW da RocketSeat',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAtendeeBadge)
app.register(checkIn)
app.register(getEventAtendees)


app.setErrorHandler(errorHandler)
//roda o app na porta 3333
app.listen({port: 3333, host: '0.0.0.0'}).then(() => {
    console.log("HTTP server running!!")
})