import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`texts_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`content\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`texts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`texts_categories_order_idx\` ON \`texts_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`texts_categories_parent_id_idx\` ON \`texts_categories\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`artworks\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`exhibitions\` ADD \`show_in_slideshow\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`exhibitions\` DROP COLUMN \`link\`;`)
  await db.run(sql`ALTER TABLE \`texts\` DROP COLUMN \`content\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`texts_categories\`;`)
  await db.run(sql`ALTER TABLE \`exhibitions\` ADD \`link\` text;`)
  await db.run(sql`ALTER TABLE \`exhibitions\` DROP COLUMN \`show_in_slideshow\`;`)
  await db.run(sql`ALTER TABLE \`texts\` ADD \`content\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`artworks\` DROP COLUMN \`description\`;`)
}
