import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserRole } from "src/user/entities/user-info.entity";

export enum RuleBasedLinkerControllerAccessMehod {
    GET = "GET",
    POST = "POST",
}

@Entity('rule_based_controller_access_detail_info')
export class RuleBasedControllerAccessDetailInfoEntity {
    @PrimaryColumn({name : "path"})
    path: string

    @Column({name : "rule"})
    rule: UserRole

    @Column({name : "method"})
    method: RuleBasedLinkerControllerAccessMehod

    @Column({name : "is_use_parm"})
    isUseParm: number
}