import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Requirement } from './requirement.entity';
import { Portfolio } from './portfolio.entity';

@Entity('Sponsor')
export class Sponsor {
  @PrimaryGeneratedColumn('uuid')
  sponsorId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  role: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string; // Hashed password

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Portfolio, (portfolio) => portfolio.sponsor)
  sponsoredPortfolios: Portfolio[];

  @OneToMany(() => Requirement, (req) => req.productOwner)
  ownedRequirements: Requirement[]; // As Product Owner

  @OneToMany(() => Requirement, (req) => req.approver)
  approvedRequirements: Requirement[]; // As Approver
}
