import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { DUMMY_KALENDER_EVENTS } from '../src/features/kalender-akademik/dummy/kalender-akademik.data';

import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/siapos";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding kalender_events...');
  let count = 0;
  for (const event of DUMMY_KALENDER_EVENTS) {
    const exists = await prisma.kalenderEvent.findFirst({
      where: { nama_event: event.nama_event, tanggal_mulai: new Date(event.tanggal_mulai) }
    });

    if (!exists) {
      await prisma.kalenderEvent.create({
        data: {
          nama_event: event.nama_event,
          deskripsi: event.deskripsi,
          kategori: event.kategori,
          tanggal_mulai: new Date(event.tanggal_mulai),
          tanggal_selesai: new Date(event.tanggal_selesai),
          tahun_ajaran: event.tahun_ajaran,
          semester: event.semester,
          status: event.status,
        }
      });
      count++;
    }
  }
  console.log(`Seeded ${count} kalender events.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
