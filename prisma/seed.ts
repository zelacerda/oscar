import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Tier } from "../src/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const YEAR = 2026;

type CategoryData = {
  name: string;
  tier: Tier;
  nominees: { name: string; movie: string }[];
};

const categories: CategoryData[] = [
  // GOLD
  {
    name: "Melhor Filme",
    tier: "GOLD",
    nominees: [
      { name: "Ed Guiney, Andrew Lowe, Yorgos Lanthimos, Emma Stone, Lars Knudsen", movie: "Bugonia" },
      { name: "Chad Oman, Brad Pitt, Dede Gardner, Jeremy Kleiner, Joseph Kosinski, Jerry Bruckheimer", movie: "F1" },
      { name: "Guillermo del Toro, J. Miles Dale, Scott Stuber", movie: "Frankenstein" },
      { name: "Liza Marshall, Pippa Harris, Nicolas Gonda, Steven Spielberg, Sam Mendes", movie: "Hamnet" },
      { name: "Eli Bush, Ronald Bronstein, Josh Safdie, Anthony Katagas, Timothée Chalamet", movie: "Marty Supreme" },
      { name: "Adam Somner, Sara Murphy, Paul Thomas Anderson", movie: "One Battle after Another" },
      { name: "Emilie Lesclaux", movie: "The Secret Agent" },
      { name: "Maria Ekerhovd, Andrea Berentsen Ottmar", movie: "Sentimental Value" },
      { name: "Zinzi Coogler, Sev Ohanian, Ryan Coogler", movie: "Sinners" },
      { name: "Marissa McMahon, Teddy Schwarzman, Will Janowitz, Ashley Schlaifer, Michael Heimler", movie: "Train Dreams" },
    ],
  },

  // SILVER
  {
    name: "Melhor Direção",
    tier: "SILVER",
    nominees: [
      { name: "Chloé Zhao", movie: "Hamnet" },
      { name: "Josh Safdie", movie: "Marty Supreme" },
      { name: "Paul Thomas Anderson", movie: "One Battle after Another" },
      { name: "Joachim Trier", movie: "Sentimental Value" },
      { name: "Ryan Coogler", movie: "Sinners" },
    ],
  },
  {
    name: "Melhor Ator",
    tier: "SILVER",
    nominees: [
      { name: "Timothée Chalamet", movie: "Marty Supreme" },
      { name: "Leonardo DiCaprio", movie: "One Battle after Another" },
      { name: "Ethan Hawke", movie: "Blue Moon" },
      { name: "Michael B. Jordan", movie: "Sinners" },
      { name: "Wagner Moura", movie: "The Secret Agent" },
    ],
  },
  {
    name: "Melhor Atriz",
    tier: "SILVER",
    nominees: [
      { name: "Jessie Buckley", movie: "Hamnet" },
      { name: "Rose Byrne", movie: "If I Had Legs I'd Kick You" },
      { name: "Kate Hudson", movie: "Song Sung Blue" },
      { name: "Renate Reinsve", movie: "Sentimental Value" },
      { name: "Emma Stone", movie: "Bugonia" },
    ],
  },
  {
    name: "Melhor Ator Coadjuvante",
    tier: "SILVER",
    nominees: [
      { name: "Benicio Del Toro", movie: "One Battle after Another" },
      { name: "Jacob Elordi", movie: "Frankenstein" },
      { name: "Delroy Lindo", movie: "Sinners" },
      { name: "Sean Penn", movie: "One Battle after Another" },
      { name: "Stellan Skarsgård", movie: "Sentimental Value" },
    ],
  },
  {
    name: "Melhor Atriz Coadjuvante",
    tier: "SILVER",
    nominees: [
      { name: "Elle Fanning", movie: "Sentimental Value" },
      { name: "Inga Ibsdotter Lilleaas", movie: "Sentimental Value" },
      { name: "Amy Madigan", movie: "Weapons" },
      { name: "Wunmi Mosaku", movie: "Sinners" },
      { name: "Teyana Taylor", movie: "One Battle after Another" },
    ],
  },

  // BRONZE
  {
    name: "Melhor Roteiro Original",
    tier: "BRONZE",
    nominees: [
      { name: "Robert Kaplow", movie: "Blue Moon" },
      { name: "Jafar Panahi, Nader Saïvar, Shadmehr Rastin, Mehdi Mahmoudian", movie: "It Was Just an Accident" },
      { name: "Ronald Bronstein, Josh Safdie", movie: "Marty Supreme" },
      { name: "Eskil Vogt, Joachim Trier", movie: "Sentimental Value" },
      { name: "Ryan Coogler", movie: "Sinners" },
    ],
  },
  {
    name: "Melhor Roteiro Adaptado",
    tier: "BRONZE",
    nominees: [
      { name: "Will Tracy", movie: "Bugonia" },
      { name: "Guillermo del Toro", movie: "Frankenstein" },
      { name: "Chloé Zhao, Maggie O'Farrell", movie: "Hamnet" },
      { name: "Paul Thomas Anderson", movie: "One Battle after Another" },
      { name: "Clint Bentley, Greg Kwedar", movie: "Train Dreams" },
    ],
  },
  {
    name: "Melhor Animação",
    tier: "BRONZE",
    nominees: [
      { name: "Ugo Bienvenu, Félix de Givry, Sophie Mas, Natalie Portman", movie: "Arco" },
      { name: "Madeline Sharafian, Domee Shi, Adrian Molina, Mary Alice Drumm", movie: "Elio" },
      { name: "Maggie Kang, Chris Appelhans, Michelle L.M. Wong", movie: "KPop Demon Hunters" },
      { name: "Maïlys Vallade, Liane-Cho Han, Nidia Santiago, Henri Magalon", movie: "Little Amélie or the Character of Rain" },
      { name: "Jared Bush, Byron Howard, Yvett Merino", movie: "Zootopia 2" },
    ],
  },
  {
    name: "Melhor Filme Internacional",
    tier: "BRONZE",
    nominees: [
      { name: "Brasil", movie: "The Secret Agent" },
      { name: "França", movie: "It Was Just an Accident" },
      { name: "Noruega", movie: "Sentimental Value" },
      { name: "Espanha", movie: "Sirāt" },
      { name: "Tunísia", movie: "The Voice of Hind Rajab" },
    ],
  },

  // BASE
  {
    name: "Melhor Fotografia",
    tier: "BASE",
    nominees: [
      { name: "Dan Laustsen", movie: "Frankenstein" },
      { name: "Darius Khondji", movie: "Marty Supreme" },
      { name: "Michael Bauman", movie: "One Battle after Another" },
      { name: "Autumn Durald Arkapaw", movie: "Sinners" },
      { name: "Adolpho Veloso", movie: "Train Dreams" },
    ],
  },
  {
    name: "Melhor Edição",
    tier: "BASE",
    nominees: [
      { name: "Stephen Mirrione", movie: "F1" },
      { name: "Ronald Bronstein, Josh Safdie", movie: "Marty Supreme" },
      { name: "Andy Jurgensen", movie: "One Battle after Another" },
      { name: "Olivier Bugge Coutté", movie: "Sentimental Value" },
      { name: "Michael P. Shawver", movie: "Sinners" },
    ],
  },
  {
    name: "Melhor Design de Produção",
    tier: "BASE",
    nominees: [
      { name: "Tamara Deverell, Shane Vieau", movie: "Frankenstein" },
      { name: "Fiona Crombie, Alice Felton", movie: "Hamnet" },
      { name: "Jack Fisk, Adam Willis", movie: "Marty Supreme" },
      { name: "Florencia Martin, Anthony Carlino", movie: "One Battle after Another" },
      { name: "Hannah Beachler, Monique Champagne", movie: "Sinners" },
    ],
  },
  {
    name: "Melhor Figurino",
    tier: "BASE",
    nominees: [
      { name: "Deborah L. Scott", movie: "Avatar: Fire and Ash" },
      { name: "Kate Hawley", movie: "Frankenstein" },
      { name: "Malgosia Turzanska", movie: "Hamnet" },
      { name: "Miyako Bellizzi", movie: "Marty Supreme" },
      { name: "Ruth E. Carter", movie: "Sinners" },
    ],
  },
  {
    name: "Melhor Maquiagem e Cabelo",
    tier: "BASE",
    nominees: [
      { name: "Mike Hill, Jordan Samuel, Cliona Furey", movie: "Frankenstein" },
      { name: "Kyoko Toyokawa, Naomi Hibino, Tadashi Nishimatsu", movie: "Kokuho" },
      { name: "Ken Diaz, Mike Fontaine, Shunika Terry", movie: "Sinners" },
      { name: "Kazu Hiro, Glen Griffin, Bjoern Rehbein", movie: "The Smashing Machine" },
      { name: "Thomas Foldberg, Anne Cathrine Sauerberg", movie: "The Ugly Stepsister" },
    ],
  },
  {
    name: "Melhores Efeitos Visuais",
    tier: "BASE",
    nominees: [
      { name: "Joe Letteri, Richard Baneham, Eric Saindon, Daniel Barrett", movie: "Avatar: Fire and Ash" },
      { name: "Ryan Tudhope, Nicolas Chevallier, Robert Harrington, Keith Dawson", movie: "F1" },
      { name: "David Vickery, Stephen Aplin, Charmaine Chan, Neil Corbould", movie: "Jurassic World Rebirth" },
      { name: "Charlie Noble, David Zaretti, Russell Bowen, Brandon K. McLaughlin", movie: "The Lost Bus" },
      { name: "Michael Ralla, Espen Nordahl, Guido Wolter, Donnie Dean", movie: "Sinners" },
    ],
  },
  {
    name: "Melhor Som",
    tier: "BASE",
    nominees: [
      { name: "Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo, Juan Peralta", movie: "F1" },
      { name: "Greg Chapman, Nathan Robitaille, Nelson Ferreira, Christian Cooke, Brad Zoern", movie: "Frankenstein" },
      { name: "José Antonio García, Christopher Scarabosio, Tony Villaflor", movie: "One Battle after Another" },
      { name: "Chris Welcker, Benjamin A. Burtt, Felipe Pacheco, Brandon Proctor, Steve Boeddeker", movie: "Sinners" },
      { name: "Amanda Villavieja, Laia Casanovas, Yasmina Praderas", movie: "Sirāt" },
    ],
  },
  {
    name: "Melhor Trilha Sonora Original",
    tier: "BASE",
    nominees: [
      { name: "Jerskin Fendrix", movie: "Bugonia" },
      { name: "Alexandre Desplat", movie: "Frankenstein" },
      { name: "Max Richter", movie: "Hamnet" },
      { name: "Jonny Greenwood", movie: "One Battle after Another" },
      { name: "Ludwig Goransson", movie: "Sinners" },
    ],
  },
  {
    name: "Melhor Canção Original",
    tier: "BASE",
    nominees: [
      { name: "\"Dear Me\" — Diane Warren", movie: "Diane Warren: Relentless" },
      { name: "\"Golden\" — EJAE, Mark Sonnenblick, Joong Gyu Kwak, Yu Han Lee, Hee Dong Nam, Jeong Hoon Seo, Teddy Park", movie: "KPop Demon Hunters" },
      { name: "\"I Lied To You\" — Raphael Saadiq, Ludwig Goransson", movie: "Sinners" },
      { name: "\"Sweet Dreams Of Joy\" — Nicholas Pike", movie: "Viva Verdi!" },
      { name: "\"Train Dreams\" — Nick Cave, Bryce Dessner", movie: "Train Dreams" },
    ],
  },
  {
    name: "Melhor Curta de Animação",
    tier: "BASE",
    nominees: [
      { name: "Florence Miailhe, Ron Dyens", movie: "Butterfly" },
      { name: "Nathan Engelhardt, Jeremy Spears", movie: "Forevergreen" },
      { name: "Chris Lavis, Maciek Szczerbowski", movie: "The Girl Who Cried Pearls" },
      { name: "John Kelly, Andrew Freedman", movie: "Retirement Plan" },
      { name: "Konstantin Bronzit", movie: "The Three Sisters" },
    ],
  },
  {
    name: "Melhor Curta Live Action",
    tier: "BASE",
    nominees: [
      { name: "Meyer Levinson-Blount, Oron Caspi", movie: "Butcher's Stain" },
      { name: "Lee Knight, James Dean", movie: "A Friend of Dorothy" },
      { name: "Julia Aks, Steve Pinder", movie: "Jane Austen's Period Drama" },
      { name: "Sam A. Davis, Jack Piatt", movie: "The Singers" },
      { name: "Alexandre Singh, Natalie Musteata", movie: "Two People Exchanging Saliva" },
    ],
  },
  {
    name: "Melhor Documentário",
    tier: "BASE",
    nominees: [
      { name: "Andrew Jarecki, Charlotte Kaufman", movie: "The Alabama Solution" },
      { name: "Ryan White, Jessica Hargrave, Tig Notaro, Stef Willen", movie: "Come See Me in the Good Light" },
      { name: "Sara Khaki, Mohammadreza Eyni", movie: "Cutting through Rocks" },
      { name: "David Borenstein, Pavel Talankin, Helle Faber, Alžběta Karásková", movie: "Mr. Nobody against Putin" },
      { name: "Geeta Gandbhir, Alisa Payne, Nikon Kwantu, Sam Bisbee", movie: "The Perfect Neighbor" },
    ],
  },
  {
    name: "Melhor Curta-Documentário",
    tier: "BASE",
    nominees: [
      { name: "Joshua Seftel, Conall Jones", movie: "All the Empty Rooms" },
      { name: "Craig Renaud, Juan Arredondo", movie: "Armed Only with a Camera: The Life and Death of Brent Renaud" },
      { name: "Hilla Medalia, Sheila Nevins", movie: "Children No More: \"Were and Are Gone\"" },
      { name: "Christalyn Hampton, Geeta Gandbhir", movie: "The Devil Is Busy" },
      { name: "Alison McAlpine", movie: "Perfectly a Strangeness" },
    ],
  },
  {
    name: "Melhor Casting",
    tier: "BASE",
    nominees: [
      { name: "Nina Gold", movie: "Hamnet" },
      { name: "Jennifer Venditti", movie: "Marty Supreme" },
      { name: "Cassandra Kulukundis", movie: "One Battle after Another" },
      { name: "Gabriel Domingues", movie: "The Secret Agent" },
      { name: "Francine Maisler", movie: "Sinners" },
    ],
  },
];

async function main() {
  console.log("Seeding Oscar 2026 data...");

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name_year: { name: cat.name, year: YEAR } },
      update: { tier: cat.tier },
      create: { name: cat.name, tier: cat.tier, year: YEAR },
    });

    for (const nom of cat.nominees) {
      const existing = await prisma.nominee.findFirst({
        where: {
          categoryId: category.id,
          name: nom.name,
          movie: nom.movie,
          year: YEAR,
        },
      });

      if (!existing) {
        await prisma.nominee.create({
          data: {
            name: nom.name,
            movie: nom.movie,
            year: YEAR,
            categoryId: category.id,
          },
        });
      }
    }

    console.log(`  ✓ ${cat.name} (${cat.nominees.length} nomeados)`);
  }

  console.log(`\nSeed completo! ${categories.length} categorias populadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
