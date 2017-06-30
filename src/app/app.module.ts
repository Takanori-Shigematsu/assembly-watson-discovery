import { NgModule } from '@angular/core';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { Ng2PaginationModule } from 'ng2-pagination';
import { MaterialModule } from '@angular/material';
import { DataTableModule } from 'angular-2-data-table';

import { AppComponent } from './app.component';

import { ReviewOverview } from './pages/review-overview.component';
import { EnrichmentVisualizer } from './pages/enrichment-visualizer.component';
import { ProductSearch } from './pages/product-search.component';

import { QueryForm } from './components/query-form.component';
import { RelationsList } from './components/relations-list.component';
import { KeywordsChart } from './components/keywords-chart.component';
import { BubbleChart } from './components/bubble-chart.component';
import { StackedBarChart } from './components/stacked-barchart.component'
import { PieChart } from './components/pie-chart.component';
import { NumberLine } from './components/number-line.component';
import { ProductSentimentTimeline } from './components/product-sentiment-timeline.component';
import { ProductDataTable } from './components/data-table.component'
import { ConceptsTable } from './components/concepts-table.component'
import { EntitiesTable } from './components/entities-table.component'
import { KeywordsTable } from './components/keywords-table.component'


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    { path: "home", component: ReviewOverview},
    { path: 'enrichment-visualizer', component: EnrichmentVisualizer },
    { path: 'product-search', component: ProductSearch }

];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        Ng2PaginationModule,
        MaterialModule,
        DataTableModule
    ],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    declarations: [ AppComponent, ReviewOverview, EnrichmentVisualizer, ProductSearch, StackedBarChart, NumberLine, ProductSentimentTimeline, QueryForm, RelationsList, KeywordsChart, BubbleChart, PieChart, ProductDataTable, ConceptsTable, EntitiesTable, KeywordsTable],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }