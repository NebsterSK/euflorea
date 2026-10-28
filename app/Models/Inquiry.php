<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\InquiryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property CarbonImmutable|null $wedding_date
 * @property bool $date_unknown
 * @property string|null $venue
 * @property string|null $guests
 * @property array<array-key, mixed>|null $services
 * @property string $message
 * @property CarbonImmutable|null $handled_at
 * @property string|null $ip
 * @property string|null $user_agent
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
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
 *
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

    use Prunable;

    /**
     * Inquiries are kept at most two years after the last contact (see the
     * privacy page). The last update is the best evidence of last contact.
     *
     * @return Builder<static>
     */
    public function prunable(): Builder
    {
        return static::query()->where('updated_at', '<=', now()->subYears(2));
    }

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
