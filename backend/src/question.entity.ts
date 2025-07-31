import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class QuestionHistory {
  @PrimaryGeneratedColumn()
  id!: number;  

  @Column()
  domain!: string;

  @Column()
  question!: string;

  @Column()
  answer!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
