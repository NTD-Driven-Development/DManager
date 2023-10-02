export const mapping: LogItem<any>[] = [
    {
        url: '/api/users/duty',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/users/duty/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/users',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/users',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/users/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/projects/import',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/projects/:id/swapBunk',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/projects',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/projects',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/projects/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarders',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarders',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarders/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarderRoles',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarderRoles',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarderRoles/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarderStatuses',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarderStatuses',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/boarderStatuses/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },{
        url: '/api/classes',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/classes',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/classes/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/points/log',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/points/log/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/points/rule',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/points/rule',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/points/rule/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/telCards/log',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/telCards/log/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/telCards/contacter',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/telCards/contacter',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/telCards/contacter/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/notes/boarder',
        method: 'POST',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/notes/boarder',
        method: 'PUT',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
    {
        url: '/api/notes/boarder/:id',
        method: 'DELETE',
        template: (userId, userName, v: {
            user_id: number,
            created_by: number,
        }) => {
            return `用戶 ${userName}(${userId})`;
        }
    },
];

interface LogItem<T> {
    url: string,
    method: string,
    template: (userId: number, userName: string, v: T) => string,
}