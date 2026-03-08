import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const toDelete = ["Melhor filme", "Melhor diretor"];

  for (const name of toDelete) {
    const category = await prisma.category.findFirst({ where: { name } });
    if (!category) {
      console.log(`Categoria "${name}" não encontrada — pulando.`);
      continue;
    }
    await prisma.category.delete({ where: { id: category.id } });
    console.log(`Categoria "${name}" (id: ${category.id}) removida.`);
  }

  console.log("Concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
