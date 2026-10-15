<?php

namespace App\Models;

use Database\Factories\InquiryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property \Carbon\CarbonImmutable|null $wedding_date
 * @property bool $date_unknown
 * @property string|null $venue
 * @property string|null $guests
 * @property array<array-key, mixed>|null $services
 * @property string $message
 * @property \Carbon\CarbonImmutable|null $handled_at
 * @property string|null $ip
 * @property string|null $user_agent
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Database\Factories\InquiryFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereDateUnknown($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereGuests($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereHandledAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereIp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereServices($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereVenue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inquiry whereWeddingDate($value)
 * @mixin \Eloquent
 */
#[Fillable([
    'name',
    'email',
    'phone',
    'wedding_date',
    'date_unknown',
    'venue',
    'guests',
    'services',
    'message',
    'handled_at',
    'ip',
    'user_agent',
])]
class Inquiry extends Model
{
    /** @use HasFactory<InquiryFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'wedding_date' => 'date',
            'date_unknown' => 'boolean',
            'services' => 'array',
            'handled_at' => 'datetime',
        ];
    }
}
