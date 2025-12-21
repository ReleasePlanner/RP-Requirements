
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ProductOwner')
export class ProductOwner {
    @PrimaryGeneratedColumn('uuid')
    productOwnerId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    role: string;

    @Column({ default: 'Active' })
    status: string;
}
