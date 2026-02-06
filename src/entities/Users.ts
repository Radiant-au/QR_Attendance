
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ActivityRegistration } from './ActivityRegistration';
import { Attendance } from './Attendance';
import { Activity } from './Activity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  // Profile fields
  @Column({ nullable: true, length: 100 })
  fullName: string;

  @Column({ type: 'enum', enum: ['IS', 'CE', 'EcE', 'PrE', 'AME'], nullable: true })
  major: string;

  @Column({ type: 'enum', enum: ['1st', '2nd', '3rd', '4th', '5th', '6th'], nullable: true })
  year: string;

  @Column({ default: false })
  isProfileCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => ActivityRegistration, registration => registration.user)
  registrations: ActivityRegistration[];

  @OneToMany(() => Attendance, attendance => attendance.user)
  attendances: Attendance[];

  @OneToMany(() => Activity, activity => activity.createdBy)
  createdActivities: Activity[];
}
