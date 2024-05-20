import zod from "zod";

export const userSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8).refine(password => (
        // check if password contains at least one uppercase letter, one lowercase letter and one digit
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password)
    )),
});

export const emailSchema = userSchema.pick({email: true});
