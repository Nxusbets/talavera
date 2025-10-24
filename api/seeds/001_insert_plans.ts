import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries (only for development)
  await knex('plans').del();

  // Inserts seed entries
  await knex('plans').insert([
    {
      code: 'free',
      name_en: 'Free',
      name_es: 'Gratis',
      projects_quota: 3,
      price: 0
    },
    {
      code: 'pro',
      name_en: 'Pro',
      name_es: 'Profesional',
      projects_quota: 10,
      price: 29.99
    }
  ]);
}
