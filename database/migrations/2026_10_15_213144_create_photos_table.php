<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->constrained()->cascadeOnDelete();
            $table->string('original_name')->nullable();
            $table->unsignedInteger('width')->default(0);
            $table->unsignedInteger('height')->default(0);
            $table->string('alt')->nullable();
            $table->unsignedTinyInteger('focal_x')->default(50);
            $table->unsignedTinyInteger('focal_y')->default(50);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['album_id', 'sort_order']);
        });

        Schema::table('albums', function (Blueprint $table) {
            $table->foreign('cover_photo_id')->references('id')->on('photos')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('albums', function (Blueprint $table) {
            $table->dropForeign(['cover_photo_id']);
        });

        Schema::dropIfExists('photos');
    }
};
