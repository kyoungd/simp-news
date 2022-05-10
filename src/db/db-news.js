const DBClient = require('./db-client.js');
const { KEYWORD } = require('../constants.js');
const logger = require('../utility/logger.js');

class TableNews {

    constructor() {
        this.prisma = DBClient.instance.prisma;
        this.tableName = KEYWORD.TABLENAME_NEWS;
        this.table = this.prisma[this.tableName];
    }

    async isNewsExist(id) {
        const getNews = await this.table.findUnique({
            where: {
                id: id
            },
        });
        return (getNews === null ? false : true);
    }

    getNewsId (data) {
        try {
            news = JSON.parse(data);
            return news.id;
        } catch (e) {
            return 0;
        }
    }

    async addNews(id, data) {
        try {
            const isExist = await this.isNewsExist(id);
            if (isExist) return 0;
            let value = {id, data};
            const result = await this.table.create({ data: value });
            return result.id;
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return 0;
        }
    }

    async addSentiment(id, score) {
        try {
            const updateUser = await this.table.update({
                where: {
                    id: id,
                },
                data: {
                    sentiment: score,
                },
            });
            return true;        
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return false;
        }
    }

    async addIsPost(id) {
        try {
            const updateUser = await this.table.update({
                where: {
                    id: id,
                },
                data: {
                    isposted: true,
                },
            });
            return true;
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return false;
        }
    }

    async flushTable() {
        try {
            await this.table.deleteMany({});
        }
        catch (e) {
            logger.error(e); logger.error(e.stack);
            return [];
        }
    }

}

module.exports = TableNews;
