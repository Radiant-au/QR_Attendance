import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstSetup1770225451940 implements MigrationInterface {
    name = 'FirstSetup1770225451940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."attendances_attendancetype_enum" AS ENUM('registered', 'walk-in', 'leave')`);
        await queryRunner.query(`CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attendanceType" "public"."attendances_attendancetype_enum" NOT NULL DEFAULT 'registered', "userId" uuid NOT NULL, "activityId" uuid NOT NULL, "registrationId" uuid NOT NULL, "isPresent" boolean NOT NULL DEFAULT false, "scannedAt" TIMESTAMP, "scannedById" uuid, "scanMethod" character varying, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_07f750b2f434f382772c9a133de" UNIQUE ("userId", "activityId"), CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."activities_status_enum" AS ENUM('upcoming', 'ongoing', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(200) NOT NULL, "description" text NOT NULL, "startDateTime" TIMESTAMP NOT NULL, "endDateTime" TIMESTAMP, "location" character varying(200) NOT NULL, "status" "public"."activities_status_enum" NOT NULL DEFAULT 'upcoming', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid NOT NULL, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."activity_registrations_status_enum" AS ENUM('registered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "activity_registrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "activityId" uuid NOT NULL, "cancellationReason" text, "cancelledAt" TIMESTAMP, "status" "public"."activity_registrations_status_enum" NOT NULL DEFAULT 'registered', "registeredAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5afb4347325eb07c42207b485f0" UNIQUE ("userId", "activityId"), CONSTRAINT "PK_ed3d336c3b301af02e6f9ffcbd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_major_enum" AS ENUM('IS', 'CE', 'EcE', 'PrE', 'AME')`);
        await queryRunner.query(`CREATE TYPE "public"."users_year_enum" AS ENUM('1st', '2nd', '3rd', '4th', '5th', '6th')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "fullName" character varying(100), "major" "public"."users_major_enum", "year" "public"."users_year_enum", "isProfileCompleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_5e20bdbc6b72f0da23eb2ff1b60" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_0785c9a8aa41ab70455d20b05e8" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_397cd0226fac3b2ba22e59b5acc" FOREIGN KEY ("scannedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_46de559beacbbe3cf88b7301878" FOREIGN KEY ("registrationId") REFERENCES "activity_registrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_579056df0c92b0f6432e96b2048" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_registrations" ADD CONSTRAINT "FK_9001b742fa29131b1a8df323971" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_registrations" ADD CONSTRAINT "FK_4d4330042fbbc94e35fcc7825ac" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_registrations" DROP CONSTRAINT "FK_4d4330042fbbc94e35fcc7825ac"`);
        await queryRunner.query(`ALTER TABLE "activity_registrations" DROP CONSTRAINT "FK_9001b742fa29131b1a8df323971"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_579056df0c92b0f6432e96b2048"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_46de559beacbbe3cf88b7301878"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_397cd0226fac3b2ba22e59b5acc"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_0785c9a8aa41ab70455d20b05e8"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_5e20bdbc6b72f0da23eb2ff1b60"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_year_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_major_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "activity_registrations"`);
        await queryRunner.query(`DROP TYPE "public"."activity_registrations_status_enum"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP TYPE "public"."activities_status_enum"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP TYPE "public"."attendances_attendancetype_enum"`);
    }

}
