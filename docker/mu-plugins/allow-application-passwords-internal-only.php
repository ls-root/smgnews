<?php
/*
 * Plugin Name: HTTP Application Passwords from internal Docker traffic
 * Description: Needed in order to run SMGNews via Docker
 */
add_filter( 'wp_is_application_passwords_available', function ( $available ) {
    if ( $available ) {
        return true;
    }

    $remote = $_SERVER['REMOTE_ADDR'] ?? '';
    if ( '' === $remote ) {
        return false; 
    }

    // Exact IP of the next.js container on the compose network.
    $webIp = gethostbyname( 'web' );
    if ( $remote === $webIp ) {
        return true;
    }

    return false;
} );
