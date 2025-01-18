@component('mail::message')
# Hi {{ $name }},

Thank you for reaching out! We have received your email and will get back to you as soon as possible.

@component('mail::button', ['url' => $url])
Visit Our Website
@endcomponent

Thanks,
{{ config('app.name') }}
@endcomponent