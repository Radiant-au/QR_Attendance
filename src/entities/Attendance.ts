import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./Users";
import { Activity } from "./Activity";

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  activityId: string;

  @Column({ default: false })
  isPresent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  scannedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  scannedById: string; // Admin who scanned

  @Column({ type: 'varchar', nullable: true })
  scanMethod: string; // 'qr', 'manual', etc.

  @Column({ type: 'text', nullable: true })
  notes: string;

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
  scannedBy: User;

  // Composite unique constraint (one attendance per user per activity)
  @Index(['userId', 'activityId'], { unique: true })
  userActivityAttendance: any;
}