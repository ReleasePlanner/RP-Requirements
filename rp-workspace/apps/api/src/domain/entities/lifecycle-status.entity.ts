import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Requirement } from './requirement.entity';
import { Epic } from './epic.entity';
import { Initiative } from './initiative.entity';

@Entity('LifecycleStatus')
export class LifecycleStatus {
    @PrimaryGeneratedColumn()
    statusId: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    status: string;

    @OneToMany(() => Requirement, (requirement) => requirement.status)
    requirements: Requirement[];

    @OneToMany(() => Epic, (epic) => epic.status)
    epics: Epic[];

    @OneToMany(() => Initiative, (initiative) => initiative.status)
    initiatives: Initiative[];
}
