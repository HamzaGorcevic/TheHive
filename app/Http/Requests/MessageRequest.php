<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class MessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow the request only if the user is authenticated
        return Auth::check(); // Returns true if the user is logged in, false otherwise
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id' => 'required|exists:rooms,id', // Ensure room exists
            'content' => 'required|string', // Ensure content is provided and a string
            'parent_message_id' => 'nullable|exists:messages,id',  // For replies, ensure the message exists
        ];
    }
}
