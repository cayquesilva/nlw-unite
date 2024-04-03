import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAtendeeBadge } from "./routes/get-atendee-badge";

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAtendeeBadge)

//roda o app na porta 3333
app.listen({port: 3333}).then(() => {
    console.log("HTTP server running!!")
})