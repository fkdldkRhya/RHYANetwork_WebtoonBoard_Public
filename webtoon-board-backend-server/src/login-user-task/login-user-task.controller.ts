import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserTaskService } from './login-user-task.service';
import { RuleBasedControllerLinkerQuery } from './dto/rule-based-controller-linker.dto';
import { Optional } from 'src/util/dto/optional.dto';

@Controller('login-user-task')
export class LoginUserTaskController {
    constructor(
        private readonly loginUserTaskService: LoginUserTaskService
    ) {}

    @Post("rule-based-controller-linker")
    async ruleBasedControllerLinker(@Body() ruleBasedControllerLinkerQuery: RuleBasedControllerLinkerQuery) : Promise<Optional<any>> {
        return await this.loginUserTaskService.ruleBasedControllerLinker(ruleBasedControllerLinkerQuery);
    }
}
