import { format } from "date-fns";
import { checkValueEmpty } from "~/utils";

export const mapping: LogItem<any>[] = [
    {
        url: '/api/users/duty',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `用戶 ${userName} 新增 ${v?.user?.name} 於 ${format(new Date(v?.start_time), 'yyyy-MM-dd')} 的輪值`;
        }
    },
    {
        url: '/api/users/duty/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `用戶 ${userName} 刪除 ${v?.user?.name} 於 ${format(new Date(v?.start_time), 'yyyy-MM-dd')} 的輪值`;
        }
    },
    {
        url: '/api/users',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `姓名：${v?.name}\n電子郵件：${v?.email}\n學號：${v?.sid}`;
        }
    },
    {
        url: '/api/users',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `姓名：${body?.name}\n電子郵件：${v?.email}\n學號：${body?.sid}`;
        }
    },
    {
        url: '/api/users/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `姓名：${v?.name}\n電子郵件：${v?.email}\n學號：${v?.sid}`;
        }
    },
    {
        url: '/api/projects/import',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `標題：${v?.name}`;
        }
    },
    {
        url: '/api/projects/:id/swapBunk',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `${v?.message}`;
        }
    },
    {
        url: '/api/projects',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `標題：${v?.name}`;
        }
    },
    {
        url: '/api/projects',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `標題：${v?.name}`;
        }
    },
    {
        url: '/api/projects/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `標題：${v?.name}`;
        }
    },
    {
        url: '/api/boarders',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.project_bunk)}\n姓名：${v?.name}\n學號：${checkValueEmpty(v?.sid)}`;
        }
    },
    {
        url: '/api/boarders',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.project_bunk)}\n姓名：${body?.name}\n學號：${checkValueEmpty(body?.sid)}`;
        }
    },
    {
        url: '/api/boarders/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.project_bunk)}\n姓名：${v?.name}\n學號：${checkValueEmpty(v?.sid)}`;
        }
    },
    {
        url: '/api/boarderRoles',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `名稱：${v?.name}`;
        }
    },
    {
        url: '/api/boarderRoles',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `名稱：${body?.name}`;
        }
    },
    {
        url: '/api/boarderRoles/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `名稱：${v?.name}`;
        }
    },
    {
        url: '/api/boarderStatuses',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `名稱：${v?.name}`;
        }
    },
    {
        url: '/api/boarderStatuses',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `名稱：${body?.name}`;
        }
    },
    {
        url: '/api/boarderStatuses/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `名稱：${v?.name}`;
        }
    },{
        url: '/api/classes',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `名稱：${v?.name}`;
        }
    },
    {
        url: '/api/classes',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `名稱：${body?.name}`;
        }
    },
    {
        url: '/api/classes/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `名稱：${v?.name}`;
        }
    },
    {
        url: '/api/points/log',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.boarder?.project_bunk)}\n編號：${v?.point_rule?.code}\n事由：${v?.point_rule?.reason}\n點數：${v?.point}`;
        }
    },
    {
        url: '/api/points/log/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.boarder?.project_bunk)}\n編號：${v?.point_rule?.code}\n事由：${v?.point_rule?.reason}\n點數：${v?.point}`;
        }
    },
    {
        url: '/api/points/rule',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `編號：${v?.code}\n事由：${v?.reason}\n點數：${v?.point}`;
        }
    },
    {
        url: '/api/points/rule',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `編號：${body?.code}\n事由：${body?.reason}\n點數：${body?.point}`;
        }
    },
    {
        url: '/api/points/rule/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `編號：${v?.code}\n事由：${v?.reason}\n點數：${v?.point}`;
        }
    },
    {
        url: '/api/telCards/log',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.boarder?.project_bunk)}\n通話對象：${v?.tel_card_contacter?.name}\n通話日期：${format(new Date(v?.contacted_at), 'yyyy-MM-dd')}`;
        }
    },
    {
        url: '/api/telCards/log/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.boarder?.project_bunk)}\n通話對象：${v?.tel_card_contacter?.name}\n通話日期：${format(new Date(v?.contacted_at), 'yyyy-MM-dd')}`;
        }
    },
    {
        url: '/api/telCards/contacter',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `名稱：${v?.name}`;
        }
    },
    {
        url: '/api/telCards/contacter',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `名稱：${body?.name}`;
        }
    },
    {
        url: '/api/telCards/contacter/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `名稱：${v?.name}`;
        }
    },
    {
        url: '/api/notes/boarder',
        method: 'POST',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.boarder?.project_bunk)}\n標題：${v?.title}`;
        }
    },
    {
        url: '/api/notes/boarder',
        method: 'PUT',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.boarder?.project_bunk)}\n標題：${body?.title}`;
        }
    },
    {
        url: '/api/notes/boarder/:id',
        method: 'DELETE',
        template: (userId, userName, body, v) => {
            return `樓寢床：${toStringlish(v?.boarder?.project_bunk)}\n標題：${v?.title}`;
        }
    },
    {
        url: '/api/exports/pointsCheck',
        method: 'GET',
        template: (userId, userName, body, v) => {
            return `項目管理-匯出項目、匯出管理之所有操作(讀取清單、搜尋、匯出個人、匯出區域)皆會紀錄`;
        }
    },
];

interface LogItem<T> {
    url: string,
    method: string,
    template: (userId: number, userName: string, body: any, v: T) => string,
}