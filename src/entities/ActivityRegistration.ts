import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Unique, Column } from "typeorm";
import { User } from "./Users";
import { Activity } from "./Activity";

@Entity('activity_registrations')
@Unique(['user', 'activity'])
export class ActivityRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  activityId: string;
  
  @Column({ type: 'enum', enum: ['registered', 'cancelled'], default: 'registered' })
  status: string;

  @CreateDateColumn()
  registeredAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Activity, activity => activity.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;
}