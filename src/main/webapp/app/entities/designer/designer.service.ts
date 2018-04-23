import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { SERVER_API_URL, FILE_UPLOAD_URL, STATIC_SERVER_URL } from '../../app.constants';

import { Designer } from './designer.model';
import { createRequestOption } from '../../shared';

import { NgxSpinnerService } from 'ngx-spinner';

export type EntityResponseType = HttpResponse<Designer>;

class FileCallbackModel {
    constructor(
        public fileUrl: string,
        public fileName?: string,
        public extensionName?: string,
        public key?: string
    ){ }
}

@Injectable()
export class DesignerService {

    private fileUploadUrl = FILE_UPLOAD_URL;
    private resourceUrl =  SERVER_API_URL + 'api/designers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/designers';
    constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

    create(designer: Designer): Observable<EntityResponseType> {
        const copy = this.convert(designer);
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
        console.error(this.spinner);
        this.spinner.show();
        if (filePostArr.length <= 0) {
            return this.http.post<Designer>(this.resourceUrl, copy, { observe: 'response' })
                .map((res: EntityResponseType) => this.convertResponse(res));
        }
        return forkJoin(...filePostArr).concatMap((results: FileCallbackModel[]) => {
            results.forEach((element: FileCallbackModel) => {
                copy[element.key] = element.fileName;
                copy[element.key + 'Url'] = element.fileUrl;
            });
            return this.http.post<Designer>(this.resourceUrl, copy, { observe: 'response' });
        }).map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(designer: Designer): Observable<EntityResponseType> {
        const copy = this.convert(designer);

        const filePostArr = [];
        let idx = 0;
        // 匹配url
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
        console.error(this.spinner);
        this.spinner.show();
        if (filePostArr.length <= 0) {
            return this.http.put<Designer>(this.resourceUrl, copy, { observe: 'response' })
                .map((res: EntityResponseType) => this.convertResponse(res));
        }
        return forkJoin(...filePostArr).concatMap((results: FileCallbackModel[]) => {
            results.forEach((element: FileCallbackModel) => {
                copy[element.key] = element.fileName;
                copy[element.key + 'Url'] = element.fileUrl;
            });
            return this.http.put<Designer>(this.resourceUrl, copy, { observe: 'response' });
        }).map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Designer>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Designer[]>> {
        const options = createRequestOption(req);
        return this.http.get<Designer[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Designer[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Designer[]>> {
        const options = createRequestOption(req);
        return this.http.get<Designer[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Designer[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Designer = this.convertItemFromServer(res.body);
        this.spinner.hide();
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Designer[]>): HttpResponse<Designer[]> {
        const jsonResponse: Designer[] = res.body;
        const body: Designer[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Designer.
     */
    private convertItemFromServer(designer: Designer): Designer {
        const copy: Designer = Object.assign({}, designer);
        for (const key in copy) {
            if (key.endsWith('Url') && copy[key]) {
               copy[key] = STATIC_SERVER_URL + '/' + copy[key];
            }
        }
        return copy;
    }

    /**
     * Convert a Designer to a JSON which can be sent to the server.
     */
    private convert(designer: Designer): Designer {
        const copy: Designer = Object.assign({}, designer);
        return copy;
    }
}
