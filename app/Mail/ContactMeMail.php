<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMeMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The contact form data.
     */
    public $name;
    public $email;
    public $subject;
    public $mess;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $email, $subject, $mess)
    {
        $this->name = $name;
        $this->email = $email;
        $this->subject = $subject;
        $this->mess = $mess;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject, // Use the subject from the contact form
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'email_to_admin', // Ensure this path is correct
            with: [
                'name' => $this->name,
                'email' => $this->email,
                'subject' => $this->subject,
                'message' => $this->mess,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
