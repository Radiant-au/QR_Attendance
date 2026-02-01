import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./Users";
import { ActivityRegistration } from "./ActivityRegistration";
import { Attendance } from "./Attendance";

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  startDateTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDateTime: Date;

  @Column({ length: 200 })
  location: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'enum', enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' })
  status: string;

  // Metadata
  //   @Column({ nullable: true })
  //   imageUrl: string;

  //   @Column({ type: 'simple-array', nullable: true })
  //   tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User, user => user.createdActivities)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => ActivityRegistration, registration => registration.activity)
  registrations: ActivityRegistration[];

  @OneToMany(() => Attendance, attendance => attendance.activity)
  attendances: Attendance[];
}