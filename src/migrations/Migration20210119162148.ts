import { Migration } from '@mikro-orm/migrations';

export class Migration20210119162148 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "supplier" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_email" text not null, "password" text not null);');
    this.addSql('alter table "supplier" add constraint "supplier_user_email_unique" unique ("user_email");');
  }

}
