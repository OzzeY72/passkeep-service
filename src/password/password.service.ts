import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Decipher, createCipheriv, randomBytes, scrypt,createDecipheriv  } from 'crypto';
import { NotFoundError } from 'rxjs';

export type Password = 
{
  userId: number,
  service_name: string,
  service_url: string,
  service_username: string,
  service_password: Buffer
};

export type PasswordView = 
{
  userId: number,
  service_name: string,
  service_url: string,
  service_username: string,
  service_password: string
};

@Injectable()
export class PasswordService {
    constructor(){}
    
    private passwords: Password[] = 
    [
        {
            userId:2,
            service_name: "Steam",
            service_url:"https://steamcommunity.com/login/",
            service_username: "maria_2024",
            service_password: undefined,
        }
    ]
    private alg = 'aes-256-ctr';

    decryptData = (data) => {
        const iv = data.slice(0, 16);
        data = data.slice(16);
        const decipher = createDecipheriv(this.alg, process.env.PASSWORD_ENCRYPT_KEY, iv);
        const result = Buffer.concat([decipher.update(data), decipher.final()]);
        return result; 
    } 

    encryptData = (data) => {
        const iv = randomBytes(16);
        const cipher = createCipheriv(this.alg, process.env.PASSWORD_ENCRYPT_KEY, iv);
        const result = Buffer.concat([iv, cipher.update(data), cipher.final()]);
        return result;
    };

    getDecryptedPassword(params:Record<string,any>)
    {
        this.passwords[0].service_password = this.encryptData("qwerty");

        const user_passwords = this.passwords.filter(el=> el.userId == params.userId);
        if (user_passwords == undefined) throw new HttpException('Not Found',HttpStatus.NOT_FOUND);

        const password = user_passwords.find(e => e.service_url == params.service_url);
        if (password == undefined) throw new HttpException('Not Found',HttpStatus.NOT_FOUND);

        if(password.service_name != params.service_name)
            return;

        const passwordView: PasswordView = {
            userId:password.userId,
            service_name: password.service_name,
            service_url:password.service_url,
            service_username: password.service_username,
            service_password:  this.decryptData(password.service_password).toString(),
        }
        return passwordView;
    }

    async addPassword(password: PasswordView):Promise<{message:string}>
    {
        const previous = this.passwords.find(el=>el.service_name == password.service_name);
        if(previous != undefined)
        {
            this.passwords.splice(this.passwords.indexOf(previous),1)
        }
        
        const store_password:Password = {
            userId: password.userId,
            service_name: password.service_name,
            service_url: password.service_url,
            service_username: password.service_username,
            service_password: this.encryptData(password.service_password)
        } 

        this.passwords.push(store_password);
        return {message:"Password created"};
    }

    async deletePassword(data):Promise<{message:string}>
    {
        const password = this.passwords.find(el=>el.service_name == data.service_name);
        if(password != undefined)
        {
            this.passwords.splice(this.passwords.indexOf(password),1)
        }
        return {message:"Password deleted"};
    }

}
