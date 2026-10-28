<?php

namespace App\Http\Controllers\Site;

use App\Data\Site\ContactPersonData;
use App\Enums\GuestCount;
use App\Enums\Service;
use App\Http\Controllers\Controller;
use App\Http\Requests\Site\ContactRequest;
use App\Mail\InquiryConfirmation;
use App\Mail\InquiryReceived;
use App\Models\Inquiry;
use Illuminate\Container\Attributes\Config;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Facades\Head;
use Throwable;

class ContactController extends Controller
{
    /**
     * Show the contact page with the inquiry form.
     *
     * @param  list<array{name: string, role?: string, phone?: string, email?: string}>  $people
     */
    public function show(#[Config('site.contact.people')] array $people): Response
    {
        Head::title('Kontakt')
            ->description('Plánujete svadbu? Napíšte Euflorea termín a miesto a ozveme sa do dvoch dní.');

        return Inertia::render('site/contact', [
            'people' => ContactPersonData::collect($people),
            'guestOptions' => array_map(
                fn (GuestCount $count): array => ['value' => $count->value, 'label' => $count->label()],
                GuestCount::cases(),
            ),
            'serviceOptions' => array_map(
                fn (Service $service): array => ['value' => $service->value, 'label' => $service->label()],
                Service::cases(),
            ),
        ]);
    }

    /**
     * Store the inquiry and notify the studio. Spam (honeypot) is accepted
     * silently and dropped.
     */
    public function send(ContactRequest $request): RedirectResponse
    {
        $data = $request->toData();

        if ($data->isSpam) {
            Log::info('Contact inquiry dropped by honeypot.', [
                'name' => $data->name,
                'email' => $data->email,
                'ip' => $data->ip,
            ]);

            return $this->thankYou();
        }

        try {
            $inquiry = Inquiry::query()->create([
                'name' => $data->name,
                'email' => $data->email,
                'phone' => $data->phone,
                'wedding_date' => $data->weddingDate,
                'date_unknown' => $data->dateUnknown,
                'venue' => $data->venue,
                'guests' => $data->guests,
                'services' => $data->services,
                'message' => $data->message,
                'ip' => $data->ip,
                'user_agent' => $data->userAgent,
            ]);
        } catch (Throwable $exception) {
            return $this->failedWrite($exception, 'Správu sa nepodarilo odoslať. Skúste to prosím znova alebo nám napíšte na Instagrame.');
        }

        $this->sendMails($inquiry);

        return $this->thankYou();
    }

    /**
     * Queue the mail to the studio and the optional copy for the couple. The
     * inquiry is already stored, so a mail failure is only logged.
     */
    protected function sendMails(Inquiry $inquiry): void
    {
        try {
            if ($recipient = config('site.contact.recipient')) {
                Mail::to($recipient)->queue(new InquiryReceived($inquiry));
            }

            if (config('site.contact.send_confirmation')) {
                Mail::to($inquiry->email)->queue(new InquiryConfirmation($inquiry));
            }
        } catch (Throwable $exception) {
            report($exception);
        }
    }

    protected function thankYou(): RedirectResponse
    {
        $this->flashSuccess('Ďakujeme! Ozveme sa vám do dvoch dní.');

        return back();
    }
}
