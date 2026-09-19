const { PrismaClient } = require('./src/generated/prisma/client');
const prisma = new PrismaClient();
async function main() {
  const subs = await prisma.submission.findMany({ include: { student: true, assignment: true }});
  console.log(JSON.stringify(subs, null, 2));
}
main().finally(() => prisma.$disconnect());
