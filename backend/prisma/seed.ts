import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({adapter});

async function main() {
  // Fixed sub-style ids so re-running the seed is idempotent (upsert, not create).
  const userA = await prisma.user.upsert({
    where: { id: 'auth0|seed-user-alice' },
    update: {},
    create: {
      id: 'auth0|seed-user-alice',
      email: 'alice@example.com',
      name: 'Alice Anderson',
    },
  });

  const userB = await prisma.user.upsert({
    where: { id: 'auth0|seed-user-bob' },
    update: {},
    create: {
      id: 'auth0|seed-user-bob',
      email: 'bob@example.com',
      name: 'Bob Baker',
    },
  });

  const aliceReading = await prisma.collection.upsert({
    where: { id: 'seed-collection-alice-reading' },
    update: {},
    create: {
      id: 'seed-collection-alice-reading',
      name: 'Reading List',
      ownerId: userA.id,
    },
  });

  const bobRecipes = await prisma.collection.upsert({
    where: { id: 'seed-collection-bob-recipes' },
    update: {},
    create: {
      id: 'seed-collection-bob-recipes',
      name: 'Recipes',
      ownerId: userB.id,
    },
  });

  await prisma.bookmark.upsert({
    where: { id: 'seed-bookmark-alice-1' },
    update: {},
    create: {
      id: 'seed-bookmark-alice-1',
      title: 'Rust ownership explained',
      url: 'https://example.com/rust-ownership',
      notes: 'Good refresher on borrow checker rules',
      collectionId: aliceReading.id,
      ownerId: userA.id,
    },
  });

  await prisma.bookmark.upsert({
    where: { id: 'seed-bookmark-alice-2' },
    update: {},
    create: {
      id: 'seed-bookmark-alice-2',
      title: 'Uncategorised article',
      url: 'https://example.com/random-article',
      collectionId: null,
      ownerId: userA.id,
    },
  });

  await prisma.bookmark.upsert({
    where: { id: 'seed-bookmark-bob-1' },
    update: {},
    create: {
      id: 'seed-bookmark-bob-1',
      title: 'Simple pasta recipe',
      url: 'https://example.com/pasta',
      notes: 'Try with less salt next time',
      collectionId: bobRecipes.id,
      ownerId: userB.id,
    },
  });

  console.log('Seed complete:', {
    users: [userA.email, userB.email],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });