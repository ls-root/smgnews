<?php

add_theme_support('post-thumbnails');

remove_action('template_redirect', 'redirect_canonical');

add_action('template_redirect', function () {
    if (
        is_preview()
    ) {
        echo '<div style="max-width:700px;margin:4rem auto;font-family:sans-serif">';
        echo '<h1>Nicht verfügbar</h1>';
        echo '<p>Diese funktion wurde noch nicht implementiert du kannst aber helfen preview funktionalitäten im smgnews-redirect theme hinzuzufügen</p>';
        echo '<p>Source: <a href="https://github.com/ls-root/smgnews/tree/main/smgnews-redirect">https://github.com/ls-root/smgnews/tree/main/smgnews-redirect</a></p>';
        echo '</div>';
    }

    $base_target = 'http://localhost:3000';

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
