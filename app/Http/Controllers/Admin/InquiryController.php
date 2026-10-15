<?php

namespace App\Http\Controllers\Admin;

use App\Data\Admin\InquiryData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IndexInquiriesRequest;
use App\Http\Requests\Admin\ToggleRequest;
use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\AllowedSort;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class InquiryController extends Controller
{
    /**
     * List contact form submissions.
     */
    public function index(IndexInquiriesRequest $request): Response
    {
        $query = $request->toData();

        $inquiries = QueryBuilder::for(Inquiry::query())
            ->allowedFilters(
                AllowedFilter::callback('search', fn (Builder $builder, string $value) => $builder->where(
                    fn (Builder $inner) => $inner->whereLike('name', "%{$value}%")->orWhereLike('email', "%{$value}%")->orWhereLike('venue', "%{$value}%"),
                )),
                AllowedFilter::callback('status', fn (Builder $builder, string $value) => $value === 'handled'
                    ? $builder->whereNotNull('handled_at')
                    : $builder->whereNull('handled_at')),
            )
            ->allowedSorts(
                AllowedSort::field('created_at'),
                AllowedSort::field('name'),
                AllowedSort::field('wedding_date'),
            )
            ->defaultSort('-created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => InquiryData::collect($inquiries->getCollection()->map(fn (Inquiry $inquiry) => InquiryData::fromInquiry($inquiry))),
            'meta' => [
                'currentPage' => $inquiries->currentPage(),
                'lastPage' => $inquiries->lastPage(),
                'total' => $inquiries->total(),
                'from' => $inquiries->firstItem(),
                'to' => $inquiries->lastItem(),
            ],
            'statusOptions' => [
                ['value' => 'open', 'label' => 'Nevybavené'],
                ['value' => 'handled', 'label' => 'Vybavené'],
            ],
            'filters' => $query->filter,
            'sort' => $query->sort,
        ]);
    }

    /**
     * Mark the inquiry as handled or open again.
     */
    public function update(ToggleRequest $request, Inquiry $inquiry): RedirectResponse
    {
        $data = $request->toData();

        try {
            $inquiry->update(['handled_at' => $data->value ? now() : null]);
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Zmenu sa nepodarilo uložiť.');
        }

        $this->flashSuccess($data->value ? 'Dopyt je označený ako vybavený.' : 'Dopyt je znova otvorený.');

        return back();
    }
}
