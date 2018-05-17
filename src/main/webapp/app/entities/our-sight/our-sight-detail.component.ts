import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { OurSight } from './our-sight.model';
import { OurSightService } from './our-sight.service';

@Component({
    selector: 'jhi-our-sight-detail',
    templateUrl: './our-sight-detail.component.html'
})
export class OurSightDetailComponent implements OnInit, OnDestroy {

    ourSight: OurSight;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private ourSightService: OurSightService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOurSights();
    }

    load(id) {
        this.ourSightService.find(id)
            .subscribe((ourSightResponse: HttpResponse<OurSight>) => {
                this.ourSight = ourSightResponse.body;
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

    registerChangeInOurSights() {
        this.eventSubscriber = this.eventManager.subscribe(
            'ourSightListModification',
            (response) => this.load(this.ourSight.id)
        );
    }
}