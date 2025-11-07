import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum AddressType {
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

  @Column({ name: 'house_no_street' })
  houseNoStreet: string;

  @Column()
  barangay: string;

  @Column({ name: 'city_municipality' })
  cityMunicipality: string;

  @Column()
  province: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  country: string;

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
