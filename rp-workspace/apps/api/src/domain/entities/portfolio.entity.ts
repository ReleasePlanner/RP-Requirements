import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Sponsor } from './sponsor.entity';
import { Initiative } from './initiative.entity';

@Entity('Portfolio')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  portfolioId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn()
  creationDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({ type: 'uuid', nullable: true })
  sponsorId: string;

  @ManyToOne(() => Sponsor, (sponsor) => sponsor.sponsoredPortfolios)
  @JoinColumn({ name: 'sponsorId' })
  sponsor: Sponsor;

  @OneToMany(() => Initiative, (initiative) => initiative.portfolio)
  initiatives: Initiative[];
}
