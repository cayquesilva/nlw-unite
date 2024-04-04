import { prisma } from "../src/lib/prisma"

//popula automaticamente o banco para testes
async function seed() {
    await prisma.event.create({
        data: {
            id: '44a1c4c9-5118-4e94-b8f4-c6d685218795',
            title: 'Unite Summit',
            slug: 'unite-summit',
            details: 'um evento p; devs apaixonados por código!',
            maximumAtendees: 120,
        }
    })
}

seed().then(()=>{
    console.log('Database Seeded!')
    prisma.$disconnect()
})