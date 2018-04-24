import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Solution } from './solution.model';
import { SolutionService } from './solution.service';

@Component({
    selector: 'jhi-solution-detail',
    templateUrl: './solution-detail.component.html'
})
export class SolutionDetailComponent implements OnInit, OnDestroy {

    solution: Solution;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private solutionService: SolutionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSolutions();
    }

    load(id) {
        this.solutionService.find(id)
            .subscribe((solutionResponse: HttpResponse<Solution>) => {
                this.solution = solutionResponse.body;
            });
    }
    byteSize(field) {
        return ;
        // return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        const win = window.open();
        win.document.write(`<iframe src="${field}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSolutions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'solutionListModification',
            (response) => this.load(this.solution.id)
        );
    }
}
