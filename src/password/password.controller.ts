import { Controller, Post,Get,Param, Response,Query, UseGuards, Body, Delete} from '@nestjs/common';
import { PasswordService } from './password.service';
import { AuthGuard } from './password.guard';

@Controller('password')
export class PasswordController {
    constructor(
        private passwordService: PasswordService
    ){}

    @Get()
    @UseGuards(AuthGuard)
    getPassword(@Query() query:any)
    {
        return this.passwordService.getDecryptedPassword(query);
    }

    @Post()
    @UseGuards(AuthGuard)
    async addPassword(@Body() data) {
        return (await this.passwordService.addPassword(data)).message;
    }

    @Delete()
    @UseGuards(AuthGuard)
    async deletePassword(@Body() data) {
        return (await (this.passwordService.deletePassword(data))).message;
    }

}
