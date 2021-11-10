jest.mock('axios');
jest.mock('../sendVerificationEmail');

import * as C from '../../../constant';
import { login, testApi } from '../../../testUtils';
import db from '../../../db/databaseApi';
import { assertCaptchaToken, submitUserRegister } from '..';
import axios from 'axios';
import { ExpectedInternalError, UnexpectedInternalError, ValidationError } from '../../utils';
import {sendVerificationEmail} from '../sendVerificationEmail';

let mockedAxios: any = axios as any;
function mockSuccessfulCaptcha() {
    mockedAxios.post.mockReturnValue(Promise.resolve({
        status: 200,
        data: { success: true, score: 1, action: C.REGISTER_FORM_ACTION }
    }));
}
(sendVerificationEmail as any) = () => Promise.resolve();

const res = {redirect: () => null};

describe("localAccount", () => {
    describe('submitUserRegister', () => {
        beforeEach(async () => {
            await db.initialize();
        });
        afterEach(async () => {
            await db.end();
        });
        it('works', async () => {
            mockSuccessfulCaptcha();
            await submitUserRegister({body:{email: "a@a.com", password:"asdfasdf", _captchatoken: "token"}}, res);
            expect((await db.users.getUserByEmail("a@a.com")).email).toEqual("a@a.com");
        });
        it('rejects short passwords', async () => {
            mockSuccessfulCaptcha();
            await expect(() => submitUserRegister({body:{email: "a@a.com", password:"asdfa", _captchatoken: "token"}}, res))
                .rejects.toThrowError("Password must be at least 6 characters");
        });
        it('rejects non-emails', async () => {
            mockSuccessfulCaptcha();
            await expect(() => submitUserRegister({body:{email: "a", password:"asdfasdas", _captchatoken: "token"}}, res))
                .rejects.toThrowError("Invalid email");
        });
        it('rejects failed captchas before rejecting existing emails', async () => {
            mockedAxios.post.mockReturnValue(Promise.resolve({
                status: 200,
                data: { success: true, score: 0.3, action: C.REGISTER_FORM_ACTION}
            }));
            await testApi.createUser({email:"a@a.com"});
            await expect(() => submitUserRegister({body:{email: "a@a.com", password:"asdfasdas", _captchatoken: "token"}}, res))
                .rejects.toThrowError("Captcha failed. Contact info@efficientdemocracy.com for help.");
        });
        it('rejects existing email', async () => {
            mockSuccessfulCaptcha();
            await testApi.createUser({email:"a@a.com"});
            await expect(() => submitUserRegister({body:{email: "a@a.com", password:"asdfasdas", _captchatoken: "token"}}, res))
                .rejects.toThrowError(`Email already registered. Contact info@efficientdemocracy.com for help.`);
        });
    }) 

    describe('assertCaptchaToken', () => {
        it('allows success', async () => {
            mockSuccessfulCaptcha();
            assertCaptchaToken("a", "b");
        });
        it('rejects axios failed status', async () => {
            mockedAxios.post.mockReturnValue(Promise.resolve({
                status: 500
            }));
            await expect(() => assertCaptchaToken("a", "b"))
                .rejects.toThrowError("Captcha request failed 500");
        });
        it('rejects failed captcha success', async () => {
            mockedAxios.post.mockReturnValue(Promise.resolve({
                status: 200,
                data: { success: false, score: 1, action: C.REGISTER_FORM_ACTION, "error-codes": ['red alert']}
            }));
            await expect(() => assertCaptchaToken("a", "b"))
                .rejects.toThrowError('Captcha success false ["red alert"]');
        });
        it('rejects mismatched actions', async () => {
            mockedAxios.post.mockReturnValue(Promise.resolve({
                status: 200,
                data: { success: true, score: 1, action: "asdf"}
            }));
            await expect(() => assertCaptchaToken("a", "b"))
                .rejects.toThrowError("Invalid google captcha action asdf");
        });
        it('rejects low scores', async () => {
            mockedAxios.post.mockReturnValue(Promise.resolve({
                status: 200,
                data: { success: true, score: 0.3, action: C.REGISTER_FORM_ACTION}
            }));
            await expect(() => assertCaptchaToken("a", "b"))
                .rejects.toThrowError("Captcha failed. Contact info@efficientdemocracy.com for help.");
        });
    });
});