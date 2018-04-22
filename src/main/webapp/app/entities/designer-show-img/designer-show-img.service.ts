import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { SERVER_API_URL, FILE_UPLOAD_URL, STATIC_SERVER_URL } from '../../app.constants';

import { DesignerShowImg } from './designer-show-img.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<DesignerShowImg>;

class FileCallbackModel {
    constructor(
        public fileUrl: string,
        public fileName?: string,
        public extensionName?: string,
        public key?: string
    ){ }
}

@Injectable()
export class DesignerShowImgService {

    private fileUploadUrl = FILE_UPLOAD_URL;
    private resourceUrl =  SERVER_API_URL + 'api/designer-show-imgs';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/designer-show-imgs';
    constructor(private http: HttpClient) { }

    create(designerShowImg: DesignerShowImg): Observable<EntityResponseType> {
        const copy = this.convert(designerShowImg);
        const filePostArr = [];
        let idx = 0;
        for (const key in copy) {
            const entityFileName = key.substring(0, key.indexOf('FileSource'));
            if (key.endsWith('FileSource') && copy[key]) {
                const formData = new FormData();
                if (copy[key] && copy[key].files) {
                    formData.append('file', copy[key].files[0]);
                    formData.append('key', entityFileName);
                    filePostArr[idx++] = this.http.post(this.fileUploadUrl, formData);
                }
            }
            if (key.endsWith('Base64Data')) {
                copy[key] = '';
            }

        }
        if (filePostArr.length <= 0) {
            return this.http.post<DesignerShowImg>(this.resourceUrl, copy, { observe: 'response' })
                .map((res: EntityResponseType) => this.convertResponse(res));
        }
        return forkJoin(...filePostArr).concatMap((results: FileCallbackModel[]) => {
            results.forEach((element: FileCallbackModel) => {
                copy[element.key] = element.fileName;
                copy[element.key + 'Url'] = element.fileUrl;
            });
            return this.http.post<DesignerShowImg>(this.resourceUrl, copy, { observe: 'response' });
        }).map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(designerShowImg: DesignerShowImg): Observable<EntityResponseType> {
        const copy = this.convert(designerShowImg);

        const filePostArr = [];
        let idx = 0;
        const reg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        for (const key in copy) {
            const entityFileName = key.substring(0, key.indexOf('FileSource'));
            if (key.endsWith('FileSource') && copy[key]) {
                const formData = new FormData();
                if (copy[key] && copy[key].files) {
                    formData.append('file', copy[key].files[0]);
                    formData.append('key', entityFileName);
                    filePostArr[idx++] = this.http.post(this.fileUploadUrl, formData);
                }
            }
            if (key.endsWith('Base64Data')) {
                copy[key] = '';
            }
            if (key.endsWith('Url') && copy[key]) {
                const exec = reg.exec(copy[key]);
                copy[key] = exec[5];
            }
        }
        if (filePostArr.length <= 0) {
            return this.http.put<DesignerShowImg>(this.resourceUrl, copy, { observe: 'response' })
                .map((res: EntityResponseType) => this.convertResponse(res));
        }
        return forkJoin(...filePostArr).concatMap((results: FileCallbackModel[]) => {
            results.forEach((element: FileCallbackModel) => {
                copy[element.key] = element.fileName;
                copy[element.key + 'Url'] = element.fileUrl;
            });
            return this.http.put<DesignerShowImg>(this.resourceUrl, copy, { observe: 'response' });
        }).map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DesignerShowImg>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<DesignerShowImg[]>> {
        const options = createRequestOption(req);
        return this.http.get<DesignerShowImg[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DesignerShowImg[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<DesignerShowImg[]>> {
        const options = createRequestOption(req);
        return this.http.get<DesignerShowImg[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<DesignerShowImg[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DesignerShowImg = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DesignerShowImg[]>): HttpResponse<DesignerShowImg[]> {
        const jsonResponse: DesignerShowImg[] = res.body;
        const body: DesignerShowImg[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DesignerShowImg.
     */
    private convertItemFromServer(designerShowImg: DesignerShowImg): DesignerShowImg {
        const copy: DesignerShowImg = Object.assign({}, designerShowImg);
        for (const key in copy) {
            if (key.endsWith('Url') && copy[key]) {
               copy[key] = STATIC_SERVER_URL + '/' + copy[key];
            }
        }
        return copy;
    }

    /**
     * Convert a DesignerShowImg to a JSON which can be sent to the server.
     */
    private convert(designerShowImg: DesignerShowImg): DesignerShowImg {
        const copy: DesignerShowImg = Object.assign({}, designerShowImg);
        return copy;
    }
}