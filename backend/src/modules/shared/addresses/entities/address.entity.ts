import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum AddressType {
  HOME = 'HOME',
  RESIDENCE = 'RESIDENCE',
  MAILING = 'MAILING',
  EMERGENCY = 'EMERGENCY',
}

/**
 * An abstract base class for address entities. It is not a table itself
 * but provides the common columns for other address tables to inherit.
 */
export abstract class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'address_type',
    type: 'varchar',
    enum: AddressType,
  })
  addressType: AddressType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'deactivated_at', type: 'timestamp', nullable: true })
  deactivatedAt: Date | null;

  @Column({ type: 'varchar', name: 'house_no_street', nullable: true })
  houseNoStreet: string | null;

  @Column({ type: 'varchar', nullable: true })
  barangay: string | null;

  @Column({ type: 'varchar', name: 'city_municipality', nullable: true })
  cityMunicipality: string | null;

  @Column({ type: 'varchar', nullable: true })
  province: string | null;

  @Column({ type: 'varchar', name: 'zip_code', nullable: true })
  zipCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
