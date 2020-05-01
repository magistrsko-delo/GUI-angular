export class Model {
    constructor(data: any) {
        for (const propName in data) {
            if (data.hasOwnProperty(propName)) {
                // @ts-ignore
                this[propName] = data[propName];
            }
        }
    }
}
