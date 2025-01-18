<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactME;
use App\Http\Requests\ContactMeRequest;
use App\Mail\ContactMeMail;
use App\Mail\SendMessageToEndUser;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactMeController extends Controller
{
    public function contact_me(ContactMeRequest $request)
    {
        $data = $request->validated();
        $name = $data['name'];
        $email = $data['email'];
        $sub = $data['subject'];
        $mess = $data['message'];

        $mailData = [
            'url' => 'https://sandroft.com/',
        ];
        $admin_email = env('MAIL_USERNAME');
        Mail::to($admin_email)->send(new ContactMeMail($name, $email, $sub, $mess));
        $senderMessage = "thanks for your message , we will reply you in later";
        Mail::to($email)->send(new SendMessageToEndUser($name, $senderMessage, $mailData));
        return response()->json(['message' => "Mail Send Successfully", 'status' => 200]);
    }
}
