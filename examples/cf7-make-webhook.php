<?php

/**
 * Contact Form 7 → Make Webhook Integration
 *
 * Sends validated form submissions to Make via HTTP POST.
 * Webhook URL is stored separately in wp-config.php.
 */

add_action('wpcf7_before_send_mail', 'send_cf7_to_make');

function send_cf7_to_make($contact_form) {

    // Process only the specified Contact Form 7 form.
    if ((int) $contact_form->id() !== 7) {
        return;
    }

    // Check webhook configuration.
    if (!defined('FIN_HELP_MAKE_WEBHOOK_URL')) {
        error_log('MAKE configuration error: webhook URL is not defined');
        return;
    }

    $webhook_url = FIN_HELP_MAKE_WEBHOOK_URL;

    // Get form submission.
    $submission = WPCF7_Submission::get_instance();

    if (!$submission) {
        error_log('MAKE error: CF7 submission is unavailable');
        return;
    }

    $data = $submission->get_posted_data();

    // Extract submitted fields.
    $name  = $data['user_name'] ?? '';
    $phone = $data['phone'] ?? '';
    $debt  = $data['debt'] ?? '';

    // Normalize array values.
    if (is_array($name)) {
        $name = implode(', ', $name);
    }

    if (is_array($phone)) {
        $phone = implode(', ', $phone);
    }

    if (is_array($debt)) {
        $debt = implode(', ', $debt);
    }

    // Sanitize and normalize values.
    $name  = sanitize_text_field(trim((string) $name));
    $phone = sanitize_text_field(trim((string) $phone));
    $debt  = sanitize_text_field(trim((string) $debt));

    // Validate required fields.
    if ($name === '' || $phone === '' || $debt === '') {
        error_log('MAKE validation error: required fields are missing');
        return;
    }

    // Prepare JSON payload.
    $payload = [
        'user_name' => $name,
        'phone'     => $phone,
        'debt'      => $debt,
        'source'    => 'fin-help-center.ru',
        'sent_at'   => current_time('mysql'),
    ];

    // Send HTTP POST request to Make.
    $response = wp_remote_post($webhook_url, [
        'timeout' => 20,
        'headers' => [
            'Content-Type' => 'application/json',
        ],
        'body' => wp_json_encode($payload),
    ]);

    // Handle connection errors.
    if (is_wp_error($response)) {
        error_log(
            'MAKE connection error: ' .
            $response->get_error_message()
        );
        return;
    }

    // Check HTTP response status.
    $status_code = wp_remote_retrieve_response_code($response);

    if ($status_code >= 200 && $status_code < 300) {

        error_log('MAKE success: HTTP ' . $status_code);

    } else {

        error_log('MAKE HTTP error: ' . $status_code);

    }
}
