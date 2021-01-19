import { Migration } from '@mikro-orm/migrations';

export class Migration20210118233535 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "price" int4 not null, "measure" varchar(255) not null, "is_active" bool not null);');

    this.addSql('drop table if exists "products" cascade;');
  }

}
