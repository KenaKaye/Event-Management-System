// src/event/entities/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Event')
export class Event {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    date: Date;

    @Column()
    location: string;
}