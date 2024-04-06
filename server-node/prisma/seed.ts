import { prisma } from '../src/lib/prisma'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'

//popula automaticamente o banco para testes
async function seed() {
    const eventId = '9e9bd979-9d10-4915-b339-3786b1634f33'
  
    await prisma.event.deleteMany()
  
    await prisma.event.create({
      data: {
        id: eventId,
        title: 'Unite Summit',
        slug: 'unite-summit',
        details: 'Um evento p/ devs apaixonados(as) por código!',
        maximumAtendees: 120,
      }
    })

const atendeesToInsert: Prisma.AtendeeUncheckedCreateInput[] = []

  for (let i = 0; i <= 120; i++) {
    atendeesToInsert.push({
      id: 10000 + i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId,
      createdAt: faker.date.recent({ days: 30, refDate: dayjs().subtract(8, "days").toDate() }),
      checkIn: faker.helpers.arrayElement<Prisma.CheckInUncheckedCreateNestedOneWithoutAtendeeInput | undefined>([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }),
          }
        }
      ])
    })
  }

  await Promise.all(atendeesToInsert.map(data => {
    return prisma.atendee.create({
      data,
    })
  }))
}

seed().then(()=>{
    console.log('Database Seeded!')
    prisma.$disconnect()
})