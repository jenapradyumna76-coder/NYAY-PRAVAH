const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function upsertUser({ name, email, role, status, barCouncilId, password }) {
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
        where: { email },
        update: {
            name,
            role,
            status,
            barCouncilId: barCouncilId || null,
            passwordHash
        },
        create: {
            name,
            email,
            role,
            status,
            barCouncilId: barCouncilId || null,
            passwordHash
        }
    });
}

async function main() {
    const coreTeam = [
        {
            name: 'Sarthak (Admin)',
            email: 'admin@nyay.com',
            role: 'ADMIN',
            status: 'VERIFIED',
            password: 'Admin@123'
        },
        {
            name: 'Mr. (Judge)',
            email: 'judge@nyay.com',
            role: 'JUDGE',
            status: 'VERIFIED',
            barCouncilId: 'JUDGE-BC-001',
            password: 'Judge@123'
        },
        {
            name: 'ACP (Lawyer)',
            email: 'lawyer@nyay.com',
            role: 'LAWYER',
            status: 'VERIFIED',
            barCouncilId: 'LAWYER-BC-001',
            password: 'Lawyer@123'
        }
    ];

    for (const user of coreTeam) {
        await upsertUser(user);
    }

    console.log('Core team users seeded successfully.');
}

main()
    .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
