<?php

namespace App\Mail;

use App\Enums\GuestCount;
use App\Enums\Service;
use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * A new inquiry for the studio; replying goes straight to the couple.
 */
class InquiryReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Inquiry $inquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->inquiry->email, $this->inquiry->name)],
            subject: 'Nový dopyt: '.$this->inquiry->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.inquiry-received',
            with: [
                'guests' => $this->inquiry->guests ? GuestCount::tryFrom($this->inquiry->guests)?->label() : null,
                'services' => array_filter(array_map(
                    fn (string $service): ?string => Service::tryFrom($service)?->label(),
                    $this->inquiry->services ?? [],
                )),
                'adminUrl' => route('admin.inquiries.index'),
            ],
        );
    }
}
