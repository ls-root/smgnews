<?php

add_theme_support('post-thumbnails');

add_action('customize_register', function ($wp_customize) {
    $wp_customize->add_section('smgnews_redirect_section', array(
        'title'    => __('Redirect Settings', 'smgnews-redirect'),
        'priority' => 30,
    ));

    // Add the setting
    $wp_customize->add_setting('smgnews_redirect_base_url', array(
        'default'           => 'http://localhost:3000',
        'sanitize_callback' => 'esc_url_raw',
        'type'              => 'theme_mod',
    ));

    // Add a control for the setting
    $wp_customize->add_control('smgnews_redirect_base_url', array(
        'label'       => __('Redirect Base URL', 'smgnews-redirect'),
        'description' => __('The base URL to which all requests will be redirected (e.g., http://example.com).', 'smgnews-redirect'),
        'section'     => 'smgnews_redirect_section',
        'type'        => 'url',
    ));
});

/**
 * Perform the redirects using the configurable base URL.
 */
add_action('template_redirect', function () {
    // Show preview message (unchanged)
    if (is_preview()) {
        echo '<div style="max-width:700px;margin:4rem auto;font-family:sans-serif">';
        echo '<h1>Nicht verfügbar</h1>';
        echo '<p>Diese funktion wurde noch nicht implementiert du kannst aber helfen preview funktionalitäten im smgnews-redirect theme hinzuzufügen</p>';
        echo '<p>Source: <a href="https://github.com/ls-root/smgnews/tree/main/smgnews-redirect">https://github.com/ls-root/smgnews/tree/main/smgnews-redirect</a></p>';
        echo '</div>';
        exit
    }

    $base_target = get_theme_mod('smgnews_redirect_base_url', 'http://localhost:3000');

    if (is_singular('post')) {
        global $post;

        if (!$post) {
            return;
        }

        $target_url = $base_target . '/artikel/' . $post->post_name;

        wp_redirect($target_url, 301);
        exit;
    }

    wp_redirect($base_target, 301);
    exit;
});
