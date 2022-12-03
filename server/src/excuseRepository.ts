import { ExcuseInterface } from './excuseInterface';
var excuses: ExcuseInterface[] = require('./excuses');

module.exports = {
    getRandom: function getRandom(numberOfExcuses: number): ExcuseInterface[] {
        var limit = numberOfExcuses > excuses.length ? excuses.length : numberOfExcuses;
        var out:ExcuseInterface[] = new Array(limit);

        for (var i = 0; i < limit; i++) {
            do {
                var excuse = excuses[Math.floor(Math.random() * excuses.length)];
            } while (out.indexOf(excuse) > -1);
            out[i] = excuse;
        }
        return out;
    },

    getByID: function getByID(id: number): ExcuseInterface | null {
        for (var i = 0; i < excuses.length; i++) {
            if (excuses[i].id == id) {
                return excuses[i];
            }
        }
        return null;
    },

    getByCategory: function getByCategory(category: string, numberOfExcuses: number): ExcuseInterface[] {
        var categoryExcuses = excuses.filter(function (excuse: ExcuseInterface) {
            return excuse.category === category;
        });

        var limit = numberOfExcuses > categoryExcuses.length ? categoryExcuses.length : numberOfExcuses;

        var out: ExcuseInterface[] = new Array(limit);

        for (var i = 0; i < limit; i++) {
            do {
                var excuse = categoryExcuses[Math.floor(Math.random() * categoryExcuses.length)];
            } while (out.indexOf(excuse) > -1);
            out[i] = excuse;
        }
        return out;
    }
}