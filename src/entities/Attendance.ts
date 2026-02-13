// entities/Attendance.ts
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "./Users";
import { Activity } from "./Activity";
import { ActivityRegistration } from "./ActivityRegistration";

@Entity('attendances')
@Unique(['user', 'activity'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['registered', 'walk-in', 'leave'],
    default: 'registered'
  })
  attendanceType: string; // How they're in the system

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  activityId: string;

  @Column({ type: 'uuid', nullable: true })
  registrationId: string;

  @Column({ default: false })
  isPresent: boolean; // Actually showed up or not

  @Column({ type: 'timestamp', nullable: true })
  scannedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  scannedById: string;

  @Column({ type: 'varchar', nullable: true })
  scanMethod: string; // 'qr', 'manual', 'auto'

  @Column({ type: 'text', nullable: true })
  notes: string; // Leave reason, admin notes, etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Activity, activity => activity.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'scannedById' })
  scannedBy?: User;

  @ManyToOne(() => ActivityRegistration, { nullable: true })
  @JoinColumn({ name: 'registrationId' })
  registration?: ActivityRegistration;
}