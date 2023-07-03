import { Entity, Generated, Column, PrimaryColumn } from "typeorm"

@Entity('api_server_log')
export class MyLoggerEntity {
    @PrimaryColumn({name : "id"})
    @Generated("increment")
    id: number;

    @Column({name : "level"})
    level: string

    @Column({name : "logger"})
    logger: string

    @Column({name : "message"})
    message: string
}