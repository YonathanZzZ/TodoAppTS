import {Sequelize, Table} from "sequelize-typescript";
import {DataTypes, Optional} from "sequelize";
import {Todo} from "../../shared/todo-item.interface";
import {Model} from 'sequelize-typescript';

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

const sequelize = new Sequelize(
    getEnv('DB_DATABASE'),
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
        timestamps: false,
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
        timestamps: false,
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
export const addTaskToDB = (task: Todo, email: string) => {
    const dbTask = {...task, email}
    return Task.create(dbTask);
};

export const deleteTask = (taskID: string) => {
    return Task.destroy({
        where: {
            id: taskID
        }
    });
};

interface ContentUpdate {
    content: string;
}

interface DoneUpdate {
    done: boolean;
}

type TaskUpdate = ContentUpdate | DoneUpdate

export const updateTask = (taskID: string, taskUpdate: TaskUpdate) => {
    return Task.update(taskUpdate, {
        where: {
            id: taskID
        }
    });
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

export const addUser = (email: string, password: string) => {
    return User.create({
        email: email,
        password: password
    });
};

export const deleteUser = (email: string) => {
    return User.destroy({
        where: {
            email: email
        }
    });
};

export const getUserPassword = async (email: string) => {

    const user = await User.findOne({where: {email: email}});
    if (!user) {
        return false;
    }

    return user.password;
}