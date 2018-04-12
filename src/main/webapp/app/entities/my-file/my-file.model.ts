import { BaseEntity } from './../../shared';

export class MyFile implements BaseEntity {
    constructor(
        public id?: number,
        public filename?: string,
        public myFile?: string,
        public fileUrl?: string,
        public imageExampleContentType?: string,
        public imageExample?: any,
        public testExample?: any,
        public imageFile?: any
    ) {
    }
}
