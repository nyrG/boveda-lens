import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientView1762630126010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW "patient_view" AS
      SELECT
        p.id,
        p.first_name,
        p.middle_initial,
        p.last_name,
        p.patient_record_number,
        p.afpsn,
        p.date_of_birth,
        EXTRACT(YEAR FROM AGE(NOW(), p.date_of_birth)) AS current_age,
        p.age AS extracted_age,
        p.sex,
        p.branch_of_service,
        p.rank,
        p.unit_assignment,
        p.summary,
        p.created_at,
        p.updated_at,
        p.deleted_at,
        c.id AS category_id,
        c.name AS category_name,
        c.description AS category_description
      FROM patients p
      LEFT JOIN patient_categories c ON c.id = p.category_id
      WHERE p.deleted_at IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW "patient_view";`);
  }
}
