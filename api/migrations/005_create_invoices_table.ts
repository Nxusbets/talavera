import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('invoices', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('subscription_id').unsigned().notNullable().references('id').inTable('subscriptions').onDelete('CASCADE');
    table.string('invoice_number').unique().notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.string('status').defaultTo('pending'); // pending, paid, failed
    table.timestamps(true, true);
    table.index(['user_id', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('invoices');
}
