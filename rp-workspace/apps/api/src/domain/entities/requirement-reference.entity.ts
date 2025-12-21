import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Requirement } from './requirement.entity';

@Entity('RequirementReference')
export class RequirementReference {
    @PrimaryGeneratedColumn('uuid')
    referenceId: string;

    @Column({ type: 'varchar', length: 50 })
    type: string; // Document, Link, etc.

    @Column({ type: 'varchar', length: 500 })
    path: string; // URL or file path

    @Column({ type: 'varchar', length: 255 })
    referenceName: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 50, default: 'Active' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'uuid' })
    requirementId: string;

    @ManyToOne(() => Requirement, (requirement) => requirement.references, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'requirementId' })
    requirement: Requirement;
}
