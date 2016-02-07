<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGivenAnswerColumnToAnswerResults extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('answers_results', function (Blueprint $table) {
            $table->string('given_answer');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('answers_results', function (Blueprint $table) {
            $table->dropColumn('given_answer');
        });
    }
}
