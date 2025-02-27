import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  government_ID!: string;

  @Column('date')
  birthday!: Date;

  @Column()
  gender!: string;

  @Column('date')
  testDate!: Date;

  @Column('date')
  applicationDate!: Date;

  @Column('text', { array: true })
  geneAnalysis!: string[];

  @Column()
  complaint!: boolean;

  @Column()
  treatment!: boolean;

  @Column({
    type: 'bytea',
    nullable: true
  })
  scannedDocument!: Buffer;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
} 