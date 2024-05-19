import {Model, Sequelize, Table} from "sequelize-typescript";
import {DataTypes, Optional} from "sequelize";
import {Todo} from "../../shared/todo-item.interface";

const HASH_LENGTH = 60;

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
}

interface UserAttributes {
    email: string;
    password: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'password'>;

@Table
class User extends Model<UserAttributes, UserCreationAttributes> {
    public email!: string;
    public password!: string;

    static associate() {
        this.hasMany(Task, {foreignKey: 'email'});
    }
}

interface TaskAttributes extends Todo {
    email: string;
}

@Table
class Task extends Model<TaskAttributes> {
    public id!: string;
    public content!: string;
    public done!: boolean;
    public email!: string;

    static associate() {
        this.belongsTo(User, {foreignKey: 'email'});
    }
}

export const sequelize = new Sequelize(

    getEnv(process.env.NODE_ENV === 'test' ? 'DB_TEST_DATABASE' : 'DB_DATABASE'),
    getEnv('DB_USERNAME'),
    getEnv('DB_PASSWORD'),
    {
        host: getEnv('DB_HOST'),
        port: Number(getEnv('DB_PORT')),
        dialect: 'mysql',
        models: [User, Task],
    },
);

interface UserInstance extends Model<UserAttributes, UserCreationAttributes> {
    Tasks: Task[];
}

sequelize.authenticate().then(() => {
    console.log('connection to database successfully established');
}).catch((error) => {
    console.error('Unable to connect to database, error: ', error);
});

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },

        password: {
            type: DataTypes.CHAR(HASH_LENGTH),
            allowNull: false
        },
    },
    {
        sequelize,
        // timestamps: false,
        modelName: 'users',
    }
)

User.associate();

Task.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        // timestamps: false,
        modelName: 'tasks',
    }
);

Task.associate();

sequelize.sync({alter: true}).then(() => {
    console.log('tables created successfully');
}).catch((error) => {
    console.error('failed to create tables, error: ', error);
});

//define functions to work with db
export const addTaskToDB = async (task: Todo, email: string) => {
    const dbTask = {...task, email};
    await Task.create(dbTask);
};

export const deleteTask = async (taskID: string) => {
    const deleteCount = await Task.destroy({
        where: {
            id: taskID
        }
    });

    return deleteCount > 0;
};

interface ContentUpdate {
    content: string;
}

interface DoneUpdate {
    done: boolean;
}

type TaskUpdate = ContentUpdate | DoneUpdate

export const updateTask = async (taskID: string, taskUpdate: TaskUpdate) => {

    const updateRes = await Task.update(taskUpdate, {
        where: {
            id: taskID
        }
    });

    const numOfAffectedRows = updateRes[0];

    return numOfAffectedRows > 0;
};

export const getUserTasks = async (email: string) => {
    try {
        const user = await User.findOne({
            where: {
                email: email
            },
            include: {
                model: Task,
                attributes: ['id', 'content', 'done']
            }
        }) as UserInstance | null;

        if (!user) {
            throw new Error('user not found');
        }

        return user.Tasks.map((task: Task) => task.get({plain: true}));

    } catch (error) {
        throw error;
    }
};

export const addUser = async (email: string, password: string) => {
    await User.create({
        email: email,
        password: password
    });
};

export const deleteUser = async (email: string) => {
    const deleteCount = await User.destroy({
        where: {
            email: email
        }
    });

    return deleteCount > 0;
};

export const getUserPassword = async (email: string) => {

    const user = await User.findOne({where: {email: email}});
    if (!user) {
        return null;
    }

    return user.password;
}

export const isUserRegistered = async (email: string) => {
    try{
        const user = await User.findOne({where: {email: email}});
        return !!user;
    }catch(error){
        console.error('failed to check if user is registered: ', error);
        return false;
    }
}