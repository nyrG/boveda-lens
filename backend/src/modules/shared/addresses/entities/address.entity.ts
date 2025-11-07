import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddressEntityType } from '../../../../common/enums/address-entity.enum';
import { Patient } from '../../../domains/patients/entities/patient.entity';

export enum AddressType {
  RESIDENCE = 'RESIDENCE',
  MAILING = 'MAILING',
  EMERGENCY = 'EMERGENCY',
}

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  // ID of the owner entity
  @Column({ name: 'entity_id' })
  entityId: number;

  //Type of the owner entity (e.g., 'Patient', 'User')
  @Column({
    name: 'entity_type',
    type: 'varchar',
    enum: AddressEntityType,
  })
  entityType: AddressEntityType;

  // This property is for type-hinting and is not a database relation.
  // The @ManyToOne decorator is removed to fix the metadata error.
  entity: Patient;

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
