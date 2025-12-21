
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Approver')
export class Approver {
    @PrimaryGeneratedColumn('uuid')
    approverId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    role: string;

    @Column({ default: 'Active' })
    status: string;
}
