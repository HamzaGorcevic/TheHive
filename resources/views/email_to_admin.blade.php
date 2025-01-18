@component('mail::message')
# New Contact Form Submission

**Name:** {{ $name }}
**Email:** {{ $email }}
**Subject:** {{ $subject }}

**Message:**
{{ $message }}

Thanks,
{{ config('app.name') }}
@endcomponent