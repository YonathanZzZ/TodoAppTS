import zod, {optional} from "zod";

const VARCHAR_LENGTH = 255;
const MIN_CONTENT_LENGTH = 1;
const UUID_LENGTH = 36;

export const todoSchema = zod.object({
    id: zod.string().length(UUID_LENGTH),
    content: zod.string().min(MIN_CONTENT_LENGTH).max(VARCHAR_LENGTH),
    done: zod.boolean(),
});

export const idSchema = todoSchema.pick({id: true});


export const updateSchema = todoSchema.pick({
    content: true,
    done: true,
}).partial().refine(
    //only one of the two properties is defined
    data =>
        (data.content !== undefined && data.done === undefined) ||
        (data.content === undefined && data.done !== undefined));