import mysql from 'serverless-mysql';

const config = {
    development: {
        host: 'localhost',
        port: '3306',
        database: 'mantool_apps',
        user: 'root',
        password: '',
    },
    production: {
        host: '185.224.137.214',
        port: '3306',
        database: 'u866942444_mitrais',
        user: 'u866942444_mitrais',
        password: 'Password1',
    }
}

export const db = mysql({
    config: { ...config?.production },
});

export default async function excuteQuery({ query, values }) {
    try {
        const results = await db.query(query, values);
        await db.end();
        return results;
    } catch (error) {
        return { error };
    }
}