import { createHash215, hashPassword, matchPassword } from "."

describe("Password hashing", () => {
    test("String should return a valid hash", () => {
        const hash = hashPassword('password');
        expect(hash).toBeDefined();
    });

    test("Validate hash matching", () => {
        const match = matchPassword('password', '$2b$10$I77IhZ0ncUEhXEnKqEmIEeSDAGbTQNrXGv59bpWMfwGSMM5YOGBTG');
        expect(match).toBeTruthy();
    })
});

describe('Other hashings', () => {
    test('SHA512 Validated', () => {
        const hash = createHash215('password');
        expect(hash).toStrictEqual('b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86');
    })
})
