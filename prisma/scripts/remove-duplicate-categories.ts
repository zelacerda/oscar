import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
