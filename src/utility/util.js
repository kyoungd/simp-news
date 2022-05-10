// const data = '{"T":"n","id":24919710,"headline":"Granite Wins $90M Construction Manager/General Contractor Project In Northern California","summary":"Granite (NYSE:GVA) announced today that it has been selected by the California Department of Transportation (Caltrans) as the Construction Manager/General Contractor (CM/GC) for the approximately $90 million State Route","author":"Benzinga Newsdesk","created_at":"2022-01-05T22:30:29Z","updated_at":"2022-01-05T22:30:30Z","url":"https://www.benzinga.com/news/22/01/24919710/granite-wins-90m-construction-managergeneral-contractor-project-in-northern-california","content":"\u003cp\u003eGranite (NYSE:...","symbols":["GVA"],"source":"benzinga"}'

const logger = require("./logger");

class Util {

    static WithoutProperty(obj, property='content') {
        if (obj.hasOwnProperty(property)) {
            const { [property]: unused, ...rest } = obj
            return rest
        } 
        else 
            return obj;
    }

    static SafeExecute(funcName, func, message) {
        try {
            func(message);
        }
        catch (e) {
            logger.error(funcName);
            logger.error(e)
            logger.error(e.stack);
        }
    }

    static Format(fmt, ...args) {
        if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
            throw new Error('invalid format string.');
        }
        return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
            if (str) {
                return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
            } else {
                if (index >= args.length) {
                    throw new Error('argument index is out of range in format');
                }
                return args[index];
            }
        });
    }

}

module.exports = Util;
